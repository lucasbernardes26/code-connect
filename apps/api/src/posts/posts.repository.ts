import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { and, asc, desc, eq, sql, type SQL } from 'drizzle-orm';
import type { Database } from '../database/database.types.js';
import { postComments, postLikes, posts, users } from '../database/schema.js';
import type { PostSortOption } from './dto/list-posts-query.dto.js';

export type PostListParams = {
  q?: string;
  tag?: string;
  sort: PostSortOption;
  page: number;
  limit: number;
  viewerUserId?: string | null;
};

export type PersistedPostSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImageUrl: string | null;
  tags: string[];
  sharesCount: number;
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    username: string | null;
    avatarUrl: string | null;
  };
};

export type PersistedPostDetail = PersistedPostSummary & {
  codeSnippet: string;
};

export type PersistedComment = {
  id: string;
  postId: string;
  body: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    username: string | null;
    avatarUrl: string | null;
  };
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function buildPrefixTsQuery(query: string): string | null {
  const tokens = query
    .trim()
    .split(/\s+/)
    .map((token) => token.replace(/[^\p{L}\p{N}_-]+/gu, ''))
    .filter((token) => token.length > 0);

  if (tokens.length === 0) {
    return null;
  }

  return tokens.map((token) => `${token}:*`).join(' & ');
}

/** Data access layer for posts, likes, comments, and PostgreSQL Full-Text Search. */
@Injectable()
export class PostsRepository {
  constructor(
    @InjectDrizzle()
    private readonly db: Database,
  ) {}

  async list(params: PostListParams): Promise<{ items: PersistedPostSummary[]; total: number }> {
    const conditions: SQL[] = [];

    if (params.q) {
      const ftsDocument = sql`(
        setweight(to_tsvector('portuguese', coalesce(${posts.title}, '')), 'A') ||
        setweight(to_tsvector('portuguese', coalesce(${posts.summary}, '')), 'B') ||
        setweight(to_tsvector('simple', coalesce(${posts.codeSnippet}, '')), 'C')
      )`;
      const prefixQuery = buildPrefixTsQuery(params.q);

      if (prefixQuery) {
        const simpleDocument = sql`to_tsvector(
          'simple',
          coalesce(${posts.title}, '') || ' ' ||
          coalesce(${posts.summary}, '') || ' ' ||
          coalesce(${posts.codeSnippet}, '') || ' ' ||
          array_to_string(${posts.tags}, ' ')
        )`;
        conditions.push(
          sql`(${ftsDocument} @@ websearch_to_tsquery('portuguese', ${params.q}) OR ${simpleDocument} @@ to_tsquery('simple', ${prefixQuery}))`,
        );
      } else {
        conditions.push(sql`${ftsDocument} @@ websearch_to_tsquery('portuguese', ${params.q})`);
      }
    }

    if (params.tag) {
      conditions.push(
        sql`EXISTS (SELECT 1 FROM unnest(${posts.tags}) AS tag_item WHERE lower(tag_item) = lower(${params.tag}))`,
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const likesCountExpr = sql<number>`coalesce((SELECT count(*)::int FROM ${postLikes} pl WHERE pl.post_id = ${posts.id}), 0)`;
    const commentsCountExpr = sql<number>`coalesce((SELECT count(*)::int FROM ${postComments} pc WHERE pc.post_id = ${posts.id}), 0)`;
    const likedByMeExpr = params.viewerUserId
      ? sql<boolean>`EXISTS (SELECT 1 FROM ${postLikes} pl_me WHERE pl_me.post_id = ${posts.id} AND pl_me.user_id = ${params.viewerUserId})`
      : sql<boolean>`false`;

    const orderByClauses =
      params.sort === 'popular'
        ? [
            desc(sql`(${likesCountExpr} + ${commentsCountExpr})`),
            desc(posts.createdAt),
          ]
        : [desc(posts.createdAt)];

    const offset = (params.page - 1) * params.limit;

    const [rows, countRows] = await Promise.all([
      this.db
        .select({
          id: posts.id,
          slug: posts.slug,
          title: posts.title,
          summary: posts.summary,
          coverImageUrl: posts.coverImageUrl,
          tags: posts.tags,
          sharesCount: posts.sharesCount,
          likesCount: likesCountExpr,
          commentsCount: commentsCountExpr,
          likedByMe: likedByMeExpr,
          createdAt: posts.createdAt,
          authorId: users.id,
          authorName: users.name,
          authorUsername: users.username,
          authorAvatarUrl: users.avatarUrl,
        })
        .from(posts)
        .innerJoin(users, eq(posts.authorId, users.id))
        .where(whereClause)
        .orderBy(...orderByClauses)
        .limit(params.limit)
        .offset(offset),
      this.db
        .select({ total: sql<number>`count(*)::int` })
        .from(posts)
        .where(whereClause),
    ]);

    const items: PersistedPostSummary[] = rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      coverImageUrl: row.coverImageUrl,
      tags: row.tags,
      sharesCount: row.sharesCount,
      likesCount: row.likesCount,
      commentsCount: row.commentsCount,
      likedByMe: row.likedByMe,
      createdAt: row.createdAt,
      author: {
        id: row.authorId,
        name: row.authorName,
        username: row.authorUsername,
        avatarUrl: row.authorAvatarUrl,
      },
    }));

    return {
      items,
      total: countRows[0]?.total ?? 0,
    };
  }

  async findById(id: string, viewerUserId?: string | null): Promise<PersistedPostDetail | null> {
    if (!UUID_REGEX.test(id)) {
      return null;
    }

    const likesCountExpr = sql<number>`coalesce((SELECT count(*)::int FROM ${postLikes} pl WHERE pl.post_id = ${posts.id}), 0)`;
    const commentsCountExpr = sql<number>`coalesce((SELECT count(*)::int FROM ${postComments} pc WHERE pc.post_id = ${posts.id}), 0)`;
    const likedByMeExpr = viewerUserId
      ? sql<boolean>`EXISTS (SELECT 1 FROM ${postLikes} pl_me WHERE pl_me.post_id = ${posts.id} AND pl_me.user_id = ${viewerUserId})`
      : sql<boolean>`false`;

    const [row] = await this.db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        summary: posts.summary,
        codeSnippet: posts.codeSnippet,
        coverImageUrl: posts.coverImageUrl,
        tags: posts.tags,
        sharesCount: posts.sharesCount,
        likesCount: likesCountExpr,
        commentsCount: commentsCountExpr,
        likedByMe: likedByMeExpr,
        createdAt: posts.createdAt,
        authorId: users.id,
        authorName: users.name,
        authorUsername: users.username,
        authorAvatarUrl: users.avatarUrl,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      codeSnippet: row.codeSnippet,
      coverImageUrl: row.coverImageUrl,
      tags: row.tags,
      sharesCount: row.sharesCount,
      likesCount: row.likesCount,
      commentsCount: row.commentsCount,
      likedByMe: row.likedByMe,
      createdAt: row.createdAt,
      author: {
        id: row.authorId,
        name: row.authorName,
        username: row.authorUsername,
        avatarUrl: row.authorAvatarUrl,
      },
    };
  }

  async existsById(id: string): Promise<boolean> {
    if (!UUID_REGEX.test(id)) {
      return false;
    }
    const [found] = await this.db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);
    return Boolean(found);
  }

  async addLike(postId: string, userId: string): Promise<number> {
    await this.db.insert(postLikes).values({ postId, userId }).onConflictDoNothing();
    return this.countLikes(postId);
  }

  async removeLike(postId: string, userId: string): Promise<number> {
    await this.db
      .delete(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    return this.countLikes(postId);
  }

  async listComments(postId: string): Promise<PersistedComment[]> {
    const rows = await this.db
      .select({
        id: postComments.id,
        postId: postComments.postId,
        body: postComments.body,
        createdAt: postComments.createdAt,
        authorId: users.id,
        authorName: users.name,
        authorUsername: users.username,
        authorAvatarUrl: users.avatarUrl,
      })
      .from(postComments)
      .innerJoin(users, eq(postComments.authorId, users.id))
      .where(eq(postComments.postId, postId))
      .orderBy(asc(postComments.createdAt));

    return rows.map((row) => ({
      id: row.id,
      postId: row.postId,
      body: row.body,
      createdAt: row.createdAt,
      author: {
        id: row.authorId,
        name: row.authorName,
        username: row.authorUsername,
        avatarUrl: row.authorAvatarUrl,
      },
    }));
  }

  async createComment(postId: string, authorId: string, body: string): Promise<PersistedComment> {
    const [created] = await this.db
      .insert(postComments)
      .values({ postId, authorId, body })
      .returning();

    if (!created) {
      throw new Error('Failed to create comment');
    }

    const [author] = await this.db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.id, authorId))
      .limit(1);

    if (!author) {
      throw new Error('Comment author not found');
    }

    return {
      id: created.id,
      postId: created.postId,
      body: created.body,
      createdAt: created.createdAt,
      author,
    };
  }

  private async countLikes(postId: string): Promise<number> {
    const [result] = await this.db
      .select({ total: sql<number>`count(*)::int` })
      .from(postLikes)
      .where(eq(postLikes.postId, postId));
    return result?.total ?? 0;
  }
}

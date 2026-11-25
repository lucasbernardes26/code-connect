import { Injectable, NotFoundException } from '@nestjs/common';
import type { CommentResponseDto } from './dto/comment-response.dto.js';
import type { CreateCommentDto } from './dto/create-comment.dto.js';
import type { ListPostsQueryDto } from './dto/list-posts-query.dto.js';
import type {
  PaginatedPostsResponseDto,
  PostAuthorDto,
  PostDetailDto,
  PostLikeStatusDto,
  PostSummaryDto,
} from './dto/post-response.dto.js';
import {
  PostsRepository,
  type PersistedComment,
  type PersistedPostDetail,
  type PersistedPostSummary,
} from './posts.repository.js';

function formatHandle(author: { name: string; username: string | null }): string {
  if (author.username && author.username.trim().length > 0) {
    return author.username.startsWith('@') ? author.username : `@${author.username}`;
  }
  const slug = author.name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');
  return `@${slug || 'usuario'}`;
}

function toAuthorDto(author: {
  id: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
}): PostAuthorDto {
  return {
    id: author.id,
    name: author.name,
    handle: formatHandle(author),
    avatarUrl: author.avatarUrl,
  };
}

function toPostSummaryDto(post: PersistedPostSummary): PostSummaryDto {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    coverImageUrl: post.coverImageUrl,
    tags: post.tags,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    sharesCount: post.sharesCount,
    likedByMe: post.likedByMe,
    author: toAuthorDto(post.author),
    createdAt: post.createdAt,
  };
}

function toPostDetailDto(post: PersistedPostDetail): PostDetailDto {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    coverImageUrl: post.coverImageUrl,
    tags: post.tags,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    sharesCount: post.sharesCount,
    likedByMe: post.likedByMe,
    author: toAuthorDto(post.author),
    createdAt: post.createdAt,
    codeSnippet: post.codeSnippet,
  };
}

function toCommentDto(comment: PersistedComment): CommentResponseDto {
  return {
    id: comment.id,
    postId: comment.postId,
    body: comment.body,
    author: toAuthorDto(comment.author),
    createdAt: comment.createdAt,
  };
}

/** Business logic for listing, searching, liking, and commenting on posts. */
@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async list(
    query: ListPostsQueryDto,
    viewerUserId?: string | null,
  ): Promise<PaginatedPostsResponseDto> {
    const { items, total } = await this.postsRepository.list({
      q: query.q,
      tag: query.tag,
      sort: query.sort,
      page: query.page,
      limit: query.limit,
      viewerUserId,
    });

    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    return {
      items: items.map(toPostSummaryDto),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async findById(id: string, viewerUserId?: string | null): Promise<PostDetailDto> {
    const found = await this.postsRepository.findById(id, viewerUserId);
    if (!found) {
      throw new NotFoundException('Post not found');
    }
    return toPostDetailDto(found);
  }

  async likePost(postId: string, userId: string): Promise<PostLikeStatusDto> {
    const exists = await this.postsRepository.existsById(postId);
    if (!exists) {
      throw new NotFoundException('Post not found');
    }

    const likesCount = await this.postsRepository.addLike(postId, userId);
    return { likesCount, likedByMe: true };
  }

  async unlikePost(postId: string, userId: string): Promise<PostLikeStatusDto> {
    const exists = await this.postsRepository.existsById(postId);
    if (!exists) {
      throw new NotFoundException('Post not found');
    }

    const likesCount = await this.postsRepository.removeLike(postId, userId);
    return { likesCount, likedByMe: false };
  }

  async listComments(postId: string): Promise<CommentResponseDto[]> {
    const exists = await this.postsRepository.existsById(postId);
    if (!exists) {
      throw new NotFoundException('Post not found');
    }

    const comments = await this.postsRepository.listComments(postId);
    return comments.map(toCommentDto);
  }

  async createComment(
    postId: string,
    userId: string,
    dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const exists = await this.postsRepository.existsById(postId);
    if (!exists) {
      throw new NotFoundException('Post not found');
    }

    const created = await this.postsRepository.createComment(postId, userId, dto.body);
    return toCommentDto(created);
  }
}

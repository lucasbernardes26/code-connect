import { getDrizzleToken } from '@nestjs/drizzle';
import { Test } from '@nestjs/testing';
import { vi } from 'vitest';
import { PostsRepository } from './posts.repository.js';

describe('PostsRepository', () => {
  const postId = '550e8400-e29b-41d4-a716-446655440001';
  const userId = '550e8400-e29b-41d4-a716-446655440000';
  const createdAt = new Date('2026-11-25T10:00:00.000Z');

  const sampleRow = {
    id: postId,
    slug: 'design-system',
    title: 'Design System',
    summary: 'Resumo do post',
    codeSnippet: 'const a = 1;',
    coverImageUrl: '/posts/cover-1.png',
    tags: ['React', 'Front-end'],
    sharesCount: 5,
    likesCount: 4,
    commentsCount: 2,
    likedByMe: true,
    createdAt,
    authorId: userId,
    authorName: 'Júlio Oliveira',
    authorUsername: 'julio',
    authorAvatarUrl: '/avatars/julio.png',
  };

  let repository: PostsRepository;
  let mockDb: {
    select: ReturnType<typeof vi.fn>;
    insert: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    const offsetMock = vi.fn().mockResolvedValue([sampleRow]);
    const limitListMock = vi.fn().mockReturnValue({ offset: offsetMock });
    const orderByListMock = vi.fn().mockReturnValue({ limit: limitListMock });
    const whereListMock = vi.fn().mockReturnValue({ orderBy: orderByListMock });
    const innerJoinMock = vi.fn().mockReturnValue({ where: whereListMock });

    const whereCountMock = vi.fn().mockResolvedValue([{ total: 1 }]);

    const onConflictDoNothingMock = vi.fn().mockResolvedValue(undefined);
    const valuesInsertMock = vi.fn().mockReturnValue({
      onConflictDoNothing: onConflictDoNothingMock,
      returning: vi.fn().mockResolvedValue([
        {
          id: 'comment-1',
          postId,
          authorId: userId,
          body: 'Ótimo post!',
          createdAt,
        },
      ]),
    });

    const whereDeleteMock = vi.fn().mockResolvedValue(undefined);

    let selectCall = 0;
    mockDb = {
      select: vi.fn().mockImplementation((fields?: Record<string, unknown>) => {
        selectCall += 1;
        if (fields && 'total' in fields) {
          return {
            from: vi.fn().mockReturnValue({
              where: whereCountMock,
            }),
          };
        }
        if (fields && 'codeSnippet' in fields) {
          return {
            from: vi.fn().mockReturnValue({
              innerJoin: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue([sampleRow]),
                }),
              }),
            }),
          };
        }
        if (fields && Object.keys(fields).length === 1 && 'id' in fields) {
          return {
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([{ id: postId }]),
              }),
            }),
          };
        }
        if (fields && 'authorName' in fields) {
          return {
            from: vi.fn().mockReturnValue({
              innerJoin: innerJoinMock,
            }),
          };
        }
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([
                {
                  id: userId,
                  name: 'Júlio Oliveira',
                  username: 'julio',
                  avatarUrl: '/avatars/julio.png',
                },
              ]),
            }),
          }),
        };
      }),
      insert: vi.fn().mockReturnValue({ values: valuesInsertMock }),
      delete: vi.fn().mockReturnValue({ where: whereDeleteMock }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [PostsRepository, { provide: getDrizzleToken(), useValue: mockDb }],
    }).compile();

    repository = moduleRef.get(PostsRepository);
    expect(selectCall).toBe(0);
  });

  it('lists posts with search query, tag filter, and total count', async () => {
    const result = await repository.list({
      q: 'design system',
      tag: 'React',
      sort: 'popular',
      page: 1,
      limit: 12,
      viewerUserId: userId,
    });

    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      id: postId,
      title: 'Design System',
      likesCount: 4,
      commentsCount: 2,
      likedByMe: true,
      author: {
        id: userId,
        name: 'Júlio Oliveira',
        username: 'julio',
      },
    });
  });

  it('returns null without querying database when findById receives invalid UUID', async () => {
    const result = await repository.findById('invalid-id');

    expect(result).toBeNull();
    expect(mockDb.select).not.toHaveBeenCalled();
  });

  it('finds post detail by valid UUID', async () => {
    const result = await repository.findById(postId, userId);

    expect(result).toMatchObject({
      id: postId,
      codeSnippet: 'const a = 1;',
    });
  });

  it('returns false without querying database when existsById receives invalid UUID', async () => {
    await expect(repository.existsById('not-a-uuid')).resolves.toBe(false);
    expect(mockDb.select).not.toHaveBeenCalled();
  });

  it('adds and removes likes and returns updated count', async () => {
    const afterAdd = await repository.addLike(postId, userId);
    const afterRemove = await repository.removeLike(postId, userId);

    expect(afterAdd).toBe(1);
    expect(afterRemove).toBe(1);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it('creates a comment and attaches author details', async () => {
    const comment = await repository.createComment(postId, userId, 'Ótimo post!');

    expect(comment).toMatchObject({
      id: 'comment-1',
      postId,
      body: 'Ótimo post!',
      author: {
        id: userId,
        name: 'Júlio Oliveira',
        username: 'julio',
      },
    });
  });
});

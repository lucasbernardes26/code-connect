import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import type { PostsRepository } from './posts.repository.js';
import { PostsService } from './posts.service.js';

describe('PostsService', () => {
  const postId = '550e8400-e29b-41d4-a716-446655440001';
  const userId = '550e8400-e29b-41d4-a716-446655440000';
  const createdAt = new Date('2026-11-25T10:00:00.000Z');

  let service: PostsService;
  let postsRepository: {
    list: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    existsById: ReturnType<typeof vi.fn>;
    addLike: ReturnType<typeof vi.fn>;
    removeLike: ReturnType<typeof vi.fn>;
    listComments: ReturnType<typeof vi.fn>;
    createComment: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    postsRepository = {
      list: vi.fn(),
      findById: vi.fn(),
      existsById: vi.fn(),
      addLike: vi.fn(),
      removeLike: vi.fn(),
      listComments: vi.fn(),
      createComment: vi.fn(),
    };
    service = new PostsService(postsRepository as unknown as PostsRepository);
  });

  it('returns paginated posts with formatted @handle', async () => {
    postsRepository.list.mockResolvedValue({
      items: [
        {
          id: postId,
          slug: 'post-1',
          title: 'Post 1',
          summary: 'Resumo',
          coverImageUrl: null,
          tags: ['React'],
          sharesCount: 2,
          likesCount: 5,
          commentsCount: 1,
          likedByMe: false,
          createdAt,
          author: {
            id: userId,
            name: 'Ana Costa',
            username: null,
            avatarUrl: null,
          },
        },
      ],
      total: 1,
    });

    const result = await service.list(
      { q: 'react', tag: undefined, sort: 'recent', page: 1, limit: 12 },
      null,
    );

    expect(result.meta).toEqual({
      page: 1,
      limit: 12,
      total: 1,
      totalPages: 1,
    });
    expect(result.items[0]?.author.handle).toBe('@ana.costa');
  });

  it('throws NotFoundException when post does not exist on findById, like, unlike, or comments', async () => {
    postsRepository.findById.mockResolvedValue(null);
    postsRepository.existsById.mockResolvedValue(false);

    await expect(service.findById(postId)).rejects.toThrow(NotFoundException);
    await expect(service.likePost(postId, userId)).rejects.toThrow(NotFoundException);
    await expect(service.unlikePost(postId, userId)).rejects.toThrow(NotFoundException);
    await expect(service.listComments(postId)).rejects.toThrow(NotFoundException);
    await expect(service.createComment(postId, userId, { body: 'Oi' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('likes and unlikes an existing post', async () => {
    postsRepository.existsById.mockResolvedValue(true);
    postsRepository.addLike.mockResolvedValue(6);
    postsRepository.removeLike.mockResolvedValue(5);

    await expect(service.likePost(postId, userId)).resolves.toEqual({
      likesCount: 6,
      likedByMe: true,
    });
    await expect(service.unlikePost(postId, userId)).resolves.toEqual({
      likesCount: 5,
      likedByMe: false,
    });
  });

  it('lists and creates comments for an existing post', async () => {
    postsRepository.existsById.mockResolvedValue(true);
    postsRepository.listComments.mockResolvedValue([
      {
        id: 'comment-1',
        postId,
        body: 'Muito bom!',
        createdAt,
        author: { id: userId, name: 'Júlio', username: 'julio', avatarUrl: null },
      },
    ]);
    postsRepository.createComment.mockResolvedValue({
      id: 'comment-2',
      postId,
      body: 'Novo comentário',
      createdAt,
      author: { id: userId, name: 'Júlio', username: 'julio', avatarUrl: null },
    });

    const comments = await service.listComments(postId);
    const created = await service.createComment(postId, userId, { body: 'Novo comentário' });

    expect(comments[0]?.author.handle).toBe('@julio');
    expect(created).toMatchObject({
      id: 'comment-2',
      body: 'Novo comentário',
      author: { handle: '@julio' },
    });
  });
});

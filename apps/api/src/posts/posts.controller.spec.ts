import { Test } from '@nestjs/testing';
import { vi } from 'vitest';
import type { User } from '../users/entities/user.entity.js';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';

describe('PostsController', () => {
  let controller: PostsController;
  const mockUser: User = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Júlio Oliveira',
    email: 'julio@codeconnect.dev',
    createdAt: new Date('2026-11-25T03:00:00.000Z'),
  };
  const postId = '550e8400-e29b-41d4-a716-446655440001';

  const postsService = {
    list: vi.fn().mockResolvedValue({
      items: [],
      meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
    }),
    findById: vi.fn().mockResolvedValue({ id: postId }),
    likePost: vi.fn().mockResolvedValue({ likesCount: 1, likedByMe: true }),
    unlikePost: vi.fn().mockResolvedValue({ likesCount: 0, likedByMe: false }),
    listComments: vi.fn().mockResolvedValue([]),
    createComment: vi.fn().mockResolvedValue({ id: 'comment-1', body: 'Legal!' }),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: postsService }],
    }).compile();

    controller = moduleRef.get(PostsController);
  });

  it('lists posts for anonymous and authenticated viewers', async () => {
    const query = { q: 'react', sort: 'recent' as const, page: 1, limit: 12 };

    await controller.list(query, null);
    expect(postsService.list).toHaveBeenCalledWith(query, undefined);

    await controller.list(query, mockUser);
    expect(postsService.list).toHaveBeenCalledWith(query, mockUser.id);
  });

  it('delegates findOne, likePost, unlikePost, listComments, and createComment', async () => {
    await controller.findOne(postId, mockUser);
    expect(postsService.findById).toHaveBeenCalledWith(postId, mockUser.id);

    await controller.likePost(postId, mockUser);
    expect(postsService.likePost).toHaveBeenCalledWith(postId, mockUser.id);

    await controller.unlikePost(postId, mockUser);
    expect(postsService.unlikePost).toHaveBeenCalledWith(postId, mockUser.id);

    await controller.listComments(postId);
    expect(postsService.listComments).toHaveBeenCalledWith(postId);

    await controller.createComment(postId, mockUser, { body: 'Legal!' });
    expect(postsService.createComment).toHaveBeenCalledWith(postId, mockUser.id, {
      body: 'Legal!',
    });
  });
});

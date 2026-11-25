import { Test } from '@nestjs/testing';
import { vi } from 'vitest';
import type { User } from './entities/user.entity.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUser: User = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    createdAt: new Date('2026-11-25T03:00:00.000Z'),
  };

  const usersService = {
    create: vi.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = moduleRef.get(UsersController);
  });

  it('registers a user via create()', async () => {
    const dto = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secret123',
    };

    const result = await controller.create(dto);

    expect(usersService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockUser);
  });

  it('returns the current authenticated user via me()', () => {
    const result = controller.me(mockUser);

    expect(result).toEqual(mockUser);
  });
});

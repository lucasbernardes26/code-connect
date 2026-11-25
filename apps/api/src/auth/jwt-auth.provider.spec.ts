import { AuthenticationRegistry } from '@nestjs/authentication';
import { vi } from 'vitest';
import type { User } from '../users/entities/user.entity.js';
import type { UsersService } from '../users/users.service.js';
import { JwtAuthProvider } from './jwt-auth.provider.js';

describe('JwtAuthProvider', () => {
  const mockUser: User = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    createdAt: new Date('2026-11-25T03:00:00.000Z'),
  };

  let usersService: { findById: ReturnType<typeof vi.fn> };
  let registry: { registerProvider: ReturnType<typeof vi.fn> };
  let provider: JwtAuthProvider;

  beforeEach(() => {
    usersService = { findById: vi.fn() };
    registry = { registerProvider: vi.fn() };
    provider = new JwtAuthProvider(
      usersService as unknown as UsersService,
      registry as unknown as AuthenticationRegistry,
    );
  });

  it('registers itself on AuthenticationRegistry', () => {
    expect(registry.registerProvider).toHaveBeenCalledWith(provider);
  });

  it('resolves user by sub claim asynchronously', async () => {
    usersService.findById.mockResolvedValue(mockUser);

    await expect(provider.validate({ sub: mockUser.id })).resolves.toEqual(mockUser);
    expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
  });

  it('returns null when sub claim is absent', async () => {
    await expect(provider.validate({})).resolves.toBeNull();
    expect(usersService.findById).not.toHaveBeenCalled();
  });
});

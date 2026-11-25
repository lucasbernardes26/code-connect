import { UnauthorizedException } from '@nestjs/common';
import { TokenService } from '@nestjs/authentication';
import { vi } from 'vitest';
import type { User } from '../users/entities/user.entity.js';
import type { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  const mockUser: User = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    createdAt: new Date('2026-11-25T03:00:00.000Z'),
  };

  let usersService: { verifyCredentials: ReturnType<typeof vi.fn> };
  let tokenService: { issue: ReturnType<typeof vi.fn> };
  let authService: AuthService;

  beforeEach(() => {
    usersService = {
      verifyCredentials: vi.fn(),
    };
    tokenService = {
      issue: vi.fn().mockResolvedValue({ accessToken: 'signed.jwt.token', expiresIn: 900 }),
    };
    authService = new AuthService(
      usersService as unknown as UsersService,
      tokenService as unknown as TokenService,
    );
  });

  it('issues a JWT access token when credentials are valid', async () => {
    usersService.verifyCredentials.mockResolvedValue(mockUser);

    const result = await authService.createToken({
      email: 'ada@example.com',
      password: 'secret123',
    });

    expect(usersService.verifyCredentials).toHaveBeenCalledWith('ada@example.com', 'secret123');
    expect(tokenService.issue).toHaveBeenCalledWith(mockUser.id, {
      method: 'password',
      claims: { amr: ['pwd'] },
    });
    expect(result).toEqual({ accessToken: 'signed.jwt.token', expiresIn: 900 });
  });

  it('throws UnauthorizedException when credentials are invalid', async () => {
    usersService.verifyCredentials.mockResolvedValue(null);

    await expect(
      authService.createToken({
        email: 'ada@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
    expect(tokenService.issue).not.toHaveBeenCalled();
  });
});

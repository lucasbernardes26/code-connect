import { Test } from '@nestjs/testing';
import { vi } from 'vitest';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    createToken: vi.fn().mockResolvedValue({
      accessToken: 'signed.jwt.token',
      expiresIn: 900,
    }),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = moduleRef.get(AuthController);
  });

  it('delegates token creation to AuthService', async () => {
    const dto = { email: 'ada@example.com', password: 'secret123' };

    const result = await controller.createToken(dto);

    expect(authService.createToken).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      accessToken: 'signed.jwt.token',
      expiresIn: 900,
    });
  });
});

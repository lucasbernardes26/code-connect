import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';
import type { CreateTokenDto } from './dto/create-token.dto.js';
import type { TokenResponseDto } from './dto/token-response.dto.js';

/** Handles credential verification and JWT issuance. */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  /** Authenticates the user and returns a signed JWT access token. */
  async createToken(dto: CreateTokenDto): Promise<TokenResponseDto> {
    const user = await this.usersService.verifyCredentials(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.tokenService.issue(user.id, {
      method: 'password',
      claims: { amr: ['pwd'] },
    });
  }
}

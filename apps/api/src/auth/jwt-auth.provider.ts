import { Injectable } from '@nestjs/common';
import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from '@nestjs/authentication';
import type { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';

/** Validates incoming Bearer JWTs and resolves the authenticated user from PostgreSQL. */
@Injectable()
export class JwtAuthProvider extends JwtBearerProvider<User> {
  constructor(
    private readonly usersService: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super({ realm: 'code-connect' });
    registry.registerProvider(this);
  }

  async validate({ sub }: JwtClaims): Promise<User | null> {
    return sub ? this.usersService.findById(sub) : null;
  }
}

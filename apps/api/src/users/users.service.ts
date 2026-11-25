import { ConflictException, Injectable } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { isUniqueViolationError } from '../database/database.types.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { StoredUser, User } from './entities/user.entity.js';
import { UsersRepository } from './users.repository.js';

/** PostgreSQL-backed user store and credential verification service. */
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  /** Registers a new user in PostgreSQL with a scrypt-hashed password. */
  async create(dto: CreateUserDto): Promise<User> {
    const email = normalizeEmail(dto.email);
    const passwordHash = await this.passwordHasher.hash(dto.password);

    try {
      const created = await this.usersRepository.create({
        name: dto.name.trim(),
        email,
        passwordHash,
      });

      return toPublicUser(created);
    } catch (error) {
      if (isUniqueViolationError(error)) {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
  }

  /** Finds a public user by ID, or returns null when not found. */
  async findById(id: string): Promise<User | null> {
    const found = await this.usersRepository.findById(id);
    return found ? toPublicUser(found) : null;
  }

  /** Verifies email and password in constant-time-safe manner, returning the user or null. */
  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const normalized = normalizeEmail(email);
    const found = await this.usersRepository.findByEmail(normalized);

    // Always invoke verify() even when the user does not exist to prevent timing-based email enumeration.
    const valid = await this.passwordHasher.verify(password, found?.passwordHash);
    if (!valid || !found) {
      return null;
    }

    if (this.passwordHasher.needsRehash(found.passwordHash)) {
      const updatedHash = await this.passwordHasher.hash(password);
      await this.usersRepository.updatePasswordHash(found.id, updatedHash);
    }

    return toPublicUser(found);
  }
}

function normalizeEmail(email: string): string {
  return email.trim().normalize('NFC').toLowerCase();
}

function toPublicUser(stored: StoredUser): User {
  const { passwordHash: _, ...user } = stored;
  return user;
}

import { ConflictException } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { vi } from 'vitest';
import type { UserRow } from '../database/schema.js';
import type { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let passwordHasher: PasswordHasher;
  let usersRepository: {
    create: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    findByEmail: ReturnType<typeof vi.fn>;
    updatePasswordHash: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    passwordHasher = new PasswordHasher({ logN: 10 });
    usersRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      updatePasswordHash: vi.fn(),
    };
    service = new UsersService(usersRepository as unknown as UsersRepository, passwordHasher);
  });

  it('creates a user with hashed password and returns public fields only', async () => {
    const now = new Date('2026-11-25T03:00:00.000Z');
    usersRepository.create.mockImplementation(async (data) => ({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: now,
    }));

    const user = await service.create({
      name: '  Ada Lovelace  ',
      email: 'ADA@Example.COM',
      password: 'secret123',
    });

    expect(usersRepository.create).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash: expect.any(String),
    });
    expect(user).toEqual({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: now,
    });
    expect('passwordHash' in user).toBe(false);
  });

  it('throws ConflictException when database reports unique email violation (23505)', async () => {
    usersRepository.create.mockRejectedValue({ code: '23505' });

    await expect(
      service.create({
        name: 'Ada Lovelace',
        email: 'ADA@example.com',
        password: 'secret123',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('rethrows unexpected repository errors on create', async () => {
    const dbError = new Error('connection lost');
    usersRepository.create.mockRejectedValue(dbError);

    await expect(
      service.create({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'secret123',
      }),
    ).rejects.toThrow(dbError);
  });

  it('finds an existing user by id and returns null for unknown id', async () => {
    const stored: UserRow = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash: 'hashed-secret',
      createdAt: new Date('2026-11-25T03:00:00.000Z'),
    };
    usersRepository.findById.mockResolvedValueOnce(stored).mockResolvedValueOnce(null);

    await expect(service.findById(stored.id)).resolves.toEqual({
      id: stored.id,
      name: stored.name,
      email: stored.email,
      createdAt: stored.createdAt,
    });
    await expect(service.findById('non-existent-id')).resolves.toBeNull();
  });

  it('verifies valid credentials and rejects invalid email or password', async () => {
    const passwordHash = await passwordHasher.hash('secret123');
    const stored: UserRow = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash,
      createdAt: new Date('2026-11-25T03:00:00.000Z'),
    };

    usersRepository.findByEmail.mockResolvedValueOnce(stored);
    await expect(service.verifyCredentials('ADA@example.com', 'secret123')).resolves.toEqual({
      id: stored.id,
      name: stored.name,
      email: stored.email,
      createdAt: stored.createdAt,
    });

    usersRepository.findByEmail.mockResolvedValueOnce(stored);
    await expect(service.verifyCredentials('ada@example.com', 'wrong-password')).resolves.toBeNull();

    usersRepository.findByEmail.mockResolvedValueOnce(null);
    await expect(service.verifyCredentials('nobody@example.com', 'secret123')).resolves.toBeNull();
  });

  it('updates stored password hash when PasswordHasher indicates rehash is needed', async () => {
    const passwordHash = await passwordHasher.hash('secret123');
    const stored: UserRow = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash,
      createdAt: new Date('2026-11-25T03:00:00.000Z'),
    };
    usersRepository.findByEmail.mockResolvedValue(stored);
    vi.spyOn(passwordHasher, 'needsRehash').mockReturnValue(true);

    await service.verifyCredentials('ada@example.com', 'secret123');

    expect(usersRepository.updatePasswordHash).toHaveBeenCalledWith(stored.id, expect.any(String));
  });
});

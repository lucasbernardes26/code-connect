import { getDrizzleToken } from '@nestjs/drizzle';
import { Test } from '@nestjs/testing';
import { vi } from 'vitest';
import type { UserRow } from '../database/schema.js';
import { UsersRepository } from './users.repository.js';

describe('UsersRepository', () => {
  const sampleRow: UserRow = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    passwordHash: 'hashed-password',
    username: null,
    avatarUrl: null,
    createdAt: new Date('2026-11-25T03:00:00.000Z'),
  };

  let repository: UsersRepository;
  let returningMock: ReturnType<typeof vi.fn>;
  let valuesMock: ReturnType<typeof vi.fn>;
  let limitMock: ReturnType<typeof vi.fn>;
  let whereSelectMock: ReturnType<typeof vi.fn>;
  let fromMock: ReturnType<typeof vi.fn>;
  let whereUpdateMock: ReturnType<typeof vi.fn>;
  let setMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    returningMock = vi.fn().mockResolvedValue([sampleRow]);
    valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
    limitMock = vi.fn().mockResolvedValue([sampleRow]);
    whereSelectMock = vi.fn().mockReturnValue({ limit: limitMock });
    fromMock = vi.fn().mockReturnValue({ where: whereSelectMock });
    whereUpdateMock = vi.fn().mockResolvedValue(undefined);
    setMock = vi.fn().mockReturnValue({ where: whereUpdateMock });

    const mockDb = {
      insert: vi.fn().mockReturnValue({ values: valuesMock }),
      select: vi.fn().mockReturnValue({ from: fromMock }),
      update: vi.fn().mockReturnValue({ set: setMock }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [UsersRepository, { provide: getDrizzleToken(), useValue: mockDb }],
    }).compile();

    repository = moduleRef.get(UsersRepository);
  });

  it('inserts and returns the created user row', async () => {
    const result = await repository.create({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash: 'hashed-password',
    });

    expect(result).toEqual(sampleRow);
    expect(valuesMock).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash: 'hashed-password',
    });
  });

  it('returns null without querying database when id is not a valid UUID', async () => {
    const result = await repository.findById('not-a-uuid');

    expect(result).toBeNull();
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('finds a user by valid UUID or email', async () => {
    await expect(repository.findById(sampleRow.id)).resolves.toEqual(sampleRow);
    await expect(repository.findByEmail(sampleRow.email)).resolves.toEqual(sampleRow);

    limitMock.mockResolvedValueOnce([]);
    await expect(repository.findByEmail('missing@example.com')).resolves.toBeNull();
  });

  it('updates passwordHash for a user id', async () => {
    await repository.updatePasswordHash(sampleRow.id, 'new-hash');

    expect(setMock).toHaveBeenCalledWith({ passwordHash: 'new-hash' });
    expect(whereUpdateMock).toHaveBeenCalled();
  });
});

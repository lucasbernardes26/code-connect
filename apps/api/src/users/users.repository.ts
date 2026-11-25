import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { eq } from 'drizzle-orm';
import type { Database } from '../database/database.types.js';
import { type NewUserRow, type UserRow, users } from '../database/schema.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Data access layer for persisted user records in PostgreSQL. */
@Injectable()
export class UsersRepository {
  constructor(
    @InjectDrizzle()
    private readonly db: Database,
  ) {}

  async create(data: NewUserRow): Promise<UserRow> {
    const [created] = await this.db.insert(users).values(data).returning();
    if (!created) {
      throw new Error('Failed to insert user record');
    }
    return created;
  }

  async findById(id: string): Promise<UserRow | null> {
    if (!UUID_REGEX.test(id)) {
      return null;
    }
    const [found] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return found ?? null;
  }

  async findByEmail(email: string): Promise<UserRow | null> {
    const [found] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return found ?? null;
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await this.db.update(users).set({ passwordHash }).where(eq(users.id, id));
  }
}

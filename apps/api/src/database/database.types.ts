import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from './schema.js';

export type Database = NodePgDatabase<typeof schema>;

/** Checks whether an error thrown by node-postgres represents a unique constraint violation (SQLSTATE 23505). */
export function isUniqueViolationError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const pgError = error as { code?: unknown; cause?: { code?: unknown } };
  return pgError.code === '23505' || pgError.cause?.code === '23505';
}

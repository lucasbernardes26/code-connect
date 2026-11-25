/** Public user representation exposed by the API (never includes password hashes). */
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
}

/** Internal user record persisted in PostgreSQL. */
export interface StoredUser extends User {
  passwordHash: string;
}

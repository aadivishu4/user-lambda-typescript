import { getDb } from "../database/postgres.js";
import type { User } from "../types/user.types.js";
import type {
  CreateUserDto,
  UpdateUserDto,
} from "../validators/user.validator.js";

export async function findAllUsers(): Promise<User[]> {
  const db = await getDb();

  const result = await db.query<User>(`
    SELECT id, name, email, created_at, updated_at
    FROM users
    ORDER BY id DESC
  `);

  return result.rows;
}

export async function findUserById(id: string): Promise<User | null> {
  const db = await getDb();

  const result = await db.query<User>(
    `
      SELECT id, name, email, created_at, updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function createUser(
  input: CreateUserDto,
): Promise<User> {
  const db = await getDb();

  const result = await db.query<User>(
    `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING id, name, email, created_at, updated_at
    `,
    [input.name, input.email],
  );

  return result.rows[0];
}

export async function updateUser(
  id: string,
  input: UpdateUserDto,
): Promise<User | null> {
  const db = await getDb();

  const result = await db.query<User>(
    `
      UPDATE users
      SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        updated_at = NOW()
      WHERE id = $3
      RETURNING id, name, email, created_at, updated_at
    `,
    [
      input.name ?? null,
      input.email ?? null,
      id,
    ],
  );

  return result.rows[0] ?? null;
}

export async function deleteUser(
  id: string,
): Promise<boolean> {
  const db = await getDb();

  const result = await db.query(
    `
      DELETE FROM users
      WHERE id = $1
    `,
    [id],
  );

  return (result.rowCount ?? 0) > 0;
}
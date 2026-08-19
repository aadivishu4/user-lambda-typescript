import { getDb } from "../database/postgres.js";
import type { User } from "../types/user.types.js";
import type { CreateUserDto } from "../validators/user.validator.js";

export async function findAllUsers(): Promise<User[]> {
  const db = await getDb();

  const result = await db.query<User>(`
    SELECT
      id,
      name,
      email,
      created_at,
      updated_at
    FROM users
    ORDER BY id DESC
  `);

  return result.rows;
}

export async function findUserById(
  id: string,
): Promise<User | null> {
  const db = await getDb();

  const result = await db.query<User>(
    `
      SELECT
        id,
        name,
        email,
        created_at,
        updated_at
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
      RETURNING
        id,
        name,
        email,
        created_at,
        updated_at
    `,
    [input.name, input.email],
  );

  return result.rows[0];
}
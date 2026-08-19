import { getDb } from "../database/postgres.js";
import type {
  User,
  CreateUserInput,
} from "../types/user.types.js";

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

export async function createUser(
  input: CreateUserInput,
): Promise<User> {
  const db = await getDb();

  const result = await db.query<User>(
    `
      INSERT INTO users (
        name,
        email
      )
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
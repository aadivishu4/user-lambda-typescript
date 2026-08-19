import { getDb } from "../database/postgres.js";

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

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
  name: string,
  email: string,
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
    [name, email],
  );

  return result.rows[0];
}
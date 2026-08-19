import pg from "pg";
import { getDbSecret } from "../config/secrets.js";

const { Pool } = pg;

let pool: pg.Pool | undefined;

export async function getDb(): Promise<pg.Pool> {
  if (pool) {
    return pool;
  }

  const secret = await getDbSecret();

  pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME,

    user: secret.username,
    password: secret.password,

    max: 2,

    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,

    ssl: {
      rejectUnauthorized: false,
    },
  });

  return pool;
}
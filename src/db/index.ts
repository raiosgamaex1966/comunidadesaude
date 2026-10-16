import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

const isLocal =
  databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");

// Remove sslmode dos query params para que o objeto ssl do pg controle a validação de certificado
const cleanDatabaseUrl = databaseUrl.replace(/[?&]sslmode=[^&]+/g, "");

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: cleanDatabaseUrl,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: process.env.NODE_ENV === "production" ? 1 : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);

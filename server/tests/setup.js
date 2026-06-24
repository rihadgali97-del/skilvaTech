import { beforeAll, afterAll } from 'vitest';
import prisma from '../src/config/db.js';

// ─── Global setup ──────────────────────────────────────────────────────────────
beforeAll(async () => {
  if (!process.env.DATABASE_URL?.includes('test')) {
    throw new Error(
      'Refusing to run tests: DATABASE_URL does not look like a test database.\n' +
      'Set DATABASE_URL in .env.test to point at a database with "test" in its name.'
    );
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ─── cleanDatabase ─────────────────────────────────────────────────────────────
// Dynamically discovers all tables that actually exist in the schema, then
// truncates them in one shot. Never breaks when new migrations add tables,
// and never fails because a hardcoded table name doesn't exist yet.
export const cleanDatabase = async () => {
  const tables = await prisma.$queryRaw`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename != '_prisma_migrations'
    ORDER BY tablename;
  `;

  if (tables.length === 0) return;

  const tableNames = tables.map((t) => `"${t.tablename}"`).join(', ');
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`
  );
};
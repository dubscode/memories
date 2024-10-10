import 'dotenv/config';

import { dbMigrations, migrationClient } from '@/lib/db';

import { sql } from 'drizzle-orm';

async function main() {
  const db = dbMigrations;

  await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "drizzle" CASCADE;`));

  await db.execute(sql.raw(`DROP SCHEMA public CASCADE;`));
  await db.execute(sql.raw(`CREATE SCHEMA public;`));
  await db.execute(sql.raw(`GRANT ALL ON SCHEMA public TO postgres;`));
  await db.execute(sql.raw(`GRANT ALL ON SCHEMA public TO public;`));
  await db.execute(
    sql.raw(`COMMENT ON SCHEMA public IS 'standard public schema';`)
  );

  await migrationClient.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

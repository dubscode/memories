import 'dotenv/config';

import { dbMigrations, migrationClient } from '@/lib/db';

import { sql } from 'drizzle-orm';
import { users } from '../schema';

async function main() {
  const db = dbMigrations;

  // Add functions to load data into the database
  const [fakeUser] = await db
    .insert(users)
    .values({
      email: 'fake@email.COM',
      firstName: 'Fake',
      lastName: 'User',
      clerkId: 'fake-clerk-id'
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        firstName: sql`excluded.first_name`,
        lastName: sql`excluded.last_name`
      }
    })
    .returning();

  console.log('Inserted fake user:', fakeUser);

  await migrationClient.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import * as schema from '@/lib/db/schema';

import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '@/config/env.mjs';
import postgres from 'postgres';

export const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, { schema });

// For migrations and functions, we need to use a separate client with max 1 connection
export const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
export const dbMigrations = drizzle(migrationClient, { schema });

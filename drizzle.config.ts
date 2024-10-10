import { defineConfig } from 'drizzle-kit';
import { env } from '@/config/env.mjs';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  schema: './lib/db/schema',
  out: './lib/db/migrations',
  introspect: {
    casing: 'camel',
  },
});

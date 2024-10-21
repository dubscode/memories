import { challenges } from './challenges';
import { fileStorage } from './file-storage';
import { notes } from './notes';
import { submissions } from './submissions';
import { tasks } from './tasks';
import { teams } from './teams';

import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 255 }).notNull().unique(),
  clerkId: text('clerk_id').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  profileImageUrl: text('profile_image_url'),
  created: timestamp('created', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  updated: timestamp('updated', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  challenges: many(challenges),
  files: many(fileStorage),
  notes: many(notes),
  submission: one(submissions, {
    fields: [users.id],
    references: [submissions.userId],
  }),
  tasks: many(tasks),
  teams: many(teams),
}));

export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email.trim().toLowerCase(),
}).omit({
  created: true,
  updated: true,
});

export const updateUserSchema = createInsertSchema(users, {
  clerkId: (schema) => schema.clerkId.optional(),
  email: (schema) => schema.email.trim().toLowerCase().optional(),
}).omit({
  created: true,
  updated: true,
});

export type UserType = typeof users.$inferSelect;

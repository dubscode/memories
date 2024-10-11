import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { createInsertSchema } from 'drizzle-zod';
import { tagsChallenges } from './tags-challenges';
import { tagsSubmissions } from './tags-submissions';

export const tags = pgTable('tags', {
  tagId: text('tag_id')
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull().unique(),
  description: text('description'),
  created: timestamp('created', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  updated: timestamp('updated', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export const tagsRelations = relations(tags, ({ many }) => ({
  challengeTags: many(tagsChallenges),
  submissionTags: many(tagsSubmissions)
}));

export const insertTagSchema = createInsertSchema(tags, {
  name: (schema) => schema.name.trim().toLowerCase()
}).omit({
  created: true,
  updated: true
});

export const updateTagSchema = createInsertSchema(tags, {
  name: (schema) => schema.name.trim().toLowerCase()
}).omit({
  created: true,
  updated: true
});

export type TagType = typeof tags.$inferSelect;

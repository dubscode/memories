import { challenges } from './challenges';

import { relations, sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const resources = pgTable(
  'resources',
  {
    resourceId: text('resource_id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    challengeId: text('challenge_id').references(() => challenges.id),
    title: text('title').notNull(),
    url: text('url'),
    resourceType: text('resource_type').notNull(), // "sponsor", "document", "tool", etc.
    description: text('description'),
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (resources) => ({
    challengeIdIndex: index('resources_challenge_id_idx').on(
      resources.challengeId,
    ),
  }),
);

export const resourcesRelations = relations(resources, ({ one }) => ({
  challenge: one(challenges, {
    fields: [resources.challengeId],
    references: [challenges.id],
  }),
}));

export const insertResourceSchema = createInsertSchema(resources).omit({
  created: true,
  updated: true,
});

export const updateResourceSchema = createInsertSchema(resources).omit({
  created: true,
  updated: true,
});

export type ResourceType = typeof resources.$inferSelect;

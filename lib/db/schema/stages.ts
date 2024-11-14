import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { challenges } from './challenges';
import { createInsertSchema } from 'drizzle-zod';
import { notes } from './notes';
import { tasks } from './tasks';

export const stages = pgTable(
  'stages',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    challengeId: text('challenge_id')
      .notNull()
      .references(() => challenges.id),
    name: text('name').notNull(),
    description: text('description'),
    durationMinutes: integer('duration_minutes'), // Optional time limit in minutes
    loggedMinutes: integer('logged_minutes').default(0), // Total time logged by participants
    order: integer('order').notNull().default(0), // To track order of stages
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (stages) => ({
    challengeIdIndex: index('stages_challenge_id_idx').on(stages.challengeId),
    orderIndex: index('stages_order_idx').on(stages.order),
  }),
);

export const stagesRelations = relations(stages, ({ many, one }) => ({
  challenge: one(challenges, {
    fields: [stages.challengeId],
    references: [challenges.id],
  }),
  notes: many(notes),
  tasks: many(tasks),
}));

export const insertStageSchema = createInsertSchema(stages).omit({
  created: true,
  updated: true,
});

export const updateStageSchema = createInsertSchema(stages).omit({
  created: true,
  updated: true,
});

export type StageType = typeof stages.$inferSelect;

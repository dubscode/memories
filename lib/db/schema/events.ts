import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { challenges } from './challenges';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const events = pgTable(
  'events',
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
    startDate: timestamp('start_date', {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    endDate: timestamp('end_date', {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (events) => ({
    challengeIdIndex: index('events_challenge_id_idx').on(events.challengeId),
    startDateIndex: index('events_start_date_idx').on(events.startDate),
    endDateIndex: index('events_end_date_idx').on(events.endDate),
  }),
);

export const eventsRelations = relations(events, ({ one }) => ({
  challenge: one(challenges, {
    fields: [events.challengeId],
    references: [challenges.id],
  }),
}));

export const insertEventSchema = createInsertSchema(events, {
  startDate: z.string(),
  endDate: z.string(),
}).omit({
  created: true,
  updated: true,
});

export const updateEventSchema = createInsertSchema(events, {
  startDate: z.string(),
  endDate: z.string(),
}).omit({
  created: true,
  updated: true,
});

export type EventType = typeof events.$inferSelect;

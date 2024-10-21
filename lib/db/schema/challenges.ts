import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { createInsertSchema } from 'drizzle-zod';
import { events } from './events';
import { fileStorage } from './file-storage';
import { notes } from './notes';
import { relations } from 'drizzle-orm';
import { resources } from './resources';
import { sql } from 'drizzle-orm';
import { stages } from './stages';
import { tagsChallenges } from './tags-challenges';
import { teams } from './teams';
import { users } from './users';
import { z } from 'zod';

export const challenges = pgTable(
  'challenges',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    description: text('description'),
    public: boolean('public').notNull().default(true),
    startDate: timestamp('start_date', {
      precision: 6,
      withTimezone: true
    }).notNull(),
    endDate: timestamp('end_date', {
      precision: 6,
      withTimezone: true
    }).notNull(),
    organizerId: text('organizer_id')
      .notNull()
      .references(() => users.id),
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date())
  },
  (challenges) => ({
    organizerIdIndex: index('challenges_organizer_id_idx').on(
      challenges.organizerId
    ),
    startDateIndex: index('challenges_start_date_idx').on(challenges.startDate)
  })
);

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  events: many(events),
  files: many(fileStorage),
  organizer: one(users, {
    fields: [challenges.organizerId],
    references: [users.id]
  }),
  notes: many(notes),
  resources: many(resources),
  stages: many(stages),
  tags: many(tagsChallenges),
  teams: many(teams)
}));

export const insertChallengeSchema = createInsertSchema(challenges, {
  startDate: z.string(),
  endDate: z.string()
}).omit({
  created: true,
  updated: true
});

export const updateChallengeSchema = createInsertSchema(challenges, {
  startDate: z.string(),
  endDate: z.string()
}).omit({
  created: true,
  updated: true
});

export type ChallengeType = typeof challenges.$inferSelect;

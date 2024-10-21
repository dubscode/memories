import { challenges } from './challenges';
import { stages } from './stages';
import { teams } from './teams';
import { users } from './users';

import { relations, sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const notes = pgTable(
  'notes',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    challengeId: text('challenge_id').references(() => challenges.id),
    stageId: text('stage_id').references(() => stages.id),
    teamId: text('team_id').references(() => teams.id),
    authorId: text('author_id')
      .notNull()
      .references(() => users.id),
    content: text('content').notNull(),
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (notes) => ({
    challengeIdIndex: index('notes_challenge_id_idx').on(notes.challengeId),
    stageIdIndex: index('notes_stage_id_idx').on(notes.stageId),
    teamIdIndex: index('notes_team_id_idx').on(notes.teamId),
    authorIdIndex: index('notes_author_id_idx').on(notes.authorId),
  }),
);

export const notesRelations = relations(notes, ({ one }) => ({
  challenge: one(challenges, {
    fields: [notes.challengeId],
    references: [challenges.id],
  }),
  stage: one(stages, { fields: [notes.stageId], references: [stages.id] }),
  team: one(teams, { fields: [notes.teamId], references: [teams.id] }),
  author: one(users, { fields: [notes.authorId], references: [users.id] }),
}));

export const insertNoteSchema = createInsertSchema(notes).omit({
  created: true,
  updated: true,
});

export const updateNoteSchema = createInsertSchema(notes).omit({
  created: true,
  updated: true,
});

export type NoteType = typeof notes.$inferSelect;

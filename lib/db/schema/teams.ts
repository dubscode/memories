import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';

import { challenges } from './challenges';
import { createInsertSchema } from 'drizzle-zod';
import { fileStorage } from './file-storage';
import { notes } from './notes';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { submissions } from './submissions';
import { tasks } from './tasks';
import { users } from './users';

export const teams = pgTable(
  'teams',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    joinedAt: timestamp('joined_at', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    teamRole: text('team_role'), // E.g., "developer", "designer"
    challengeId: text('challenge_id')
      .notNull()
      .references(() => challenges.id),
    teamLeadId: text('team_lead_id')
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
  (teams) => ({
    challengeIdIndex: index('teams_challenge_id_idx').on(teams.challengeId),
    teamLeadIdIndex: index('teams_team_lead_id_idx').on(teams.teamLeadId),
    uniqueTeamNamePerChallenge: uniqueIndex(
      'unique_team_name_per_challenge'
    ).on(teams.challengeId, teams.name)
  })
);

export const teamsRelations = relations(teams, ({ one, many }) => ({
  challenge: one(challenges, {
    fields: [teams.challengeId],
    references: [challenges.id]
  }),
  files: many(fileStorage),
  members: many(users),
  notes: many(notes),
  submission: one(submissions, {
    fields: [teams.id],
    references: [submissions.teamId]
  }),
  tasks: many(tasks),
  teamLead: one(users, { fields: [teams.teamLeadId], references: [users.id] })
}));

export const insertTeamSchema = createInsertSchema(teams).omit({
  created: true,
  updated: true
});

export const updateTeamSchema = createInsertSchema(teams).omit({
  created: true,
  updated: true
});

export type TeamType = typeof teams.$inferSelect;

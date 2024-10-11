import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { challenges } from './challenges';
import { createInsertSchema } from 'drizzle-zod';
import { teams } from './teams';
import { users } from './users';

// Submissions Table
export const submissions = pgTable(
  'submissions',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    challengeId: text('challenge_id')
      .notNull()
      .references(() => challenges.id),
    teamId: text('team_id').references(() => teams.id),
    userId: text('user_id').references(() => users.id),
    submissionTitle: text('submission_title').notNull(),
    description: text('description'),
    repoLink: text('repo_link'),
    videoLink: text('video_link'),
    submittedAt: timestamp('submitted_at', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date())
  },
  (submissions) => ({
    challengeIdIndex: index('submissions_challenge_id_idx').on(
      submissions.challengeId
    ),
    teamIdIndex: index('submissions_team_id_idx').on(submissions.teamId),
    userIdIndex: index('submissions_user_id_idx').on(submissions.userId),
    uniqueChallengeTeamIndex: uniqueIndex(
      'submissions_challenge_team_unique'
    ).on(submissions.challengeId, submissions.teamId)
  })
);

export const submissionsRelations = relations(submissions, ({ many, one }) => ({
  challenge: one(challenges, {
    fields: [submissions.challengeId],
    references: [challenges.id]
  }),
  tags: many(submissions),
  team: one(teams, { fields: [submissions.teamId], references: [teams.id] }),
  user: one(users, { fields: [submissions.userId], references: [users.id] })
}));

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  created: true,
  updated: true
});

export const updateSubmissionSchema = createInsertSchema(submissions).omit({
  created: true,
  updated: true
});

export type SubmissionType = typeof submissions.$inferSelect;

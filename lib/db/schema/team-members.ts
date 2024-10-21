import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { createInsertSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { teams } from './teams';
import { users } from './users';

export const teamMembers = pgTable(
  'team_members',
  {
    teamId: text('team_id')
      .notNull()
      .references(() => teams.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    role: text('role', { enum: ['LEADER', 'MEMBER'] })
      .notNull()
      .default('MEMBER'),
    timeTracked: integer('time_tracked').notNull().default(0),
    joinedAt: timestamp('joined_at', { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    created: timestamp('created', { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.teamId, table.userId],
    }),
    teamIdIdx: index('team_members_team_id_idx').on(table.teamId),
    userIdIdx: index('team_members_user_id_idx').on(table.userId),
  }),
);

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  created: true,
  updated: true,
  joinedAt: true,
});

export const updateTeamMemberSchema = createInsertSchema(teamMembers).omit({
  teamId: true,
  userId: true,
  created: true,
  updated: true,
  joinedAt: true,
});

export type TeamMemberType = typeof teamMembers.$inferSelect;

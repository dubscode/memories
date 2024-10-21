import { stages } from './stages';
import { teams } from './teams';
import { users } from './users';

import { relations, sql } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const tasks = pgTable(
  'tasks',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    stageId: text('stage_id')
      .notNull()
      .references(() => stages.id),
    teamId: text('team_id').references(() => teams.id),
    assignedTo: text('assigned_to').references(() => users.id),
    estimateMinutes: integer('estimate_minutes').default(0),
    taskName: text('task_name').notNull(),
    status: text('status').notNull().default('not_started'), // "not_started", "in_progress", "completed"
    dueDate: timestamp('due_date', { precision: 6, withTimezone: true }),
    completedAt: timestamp('completed_at', {
      precision: 6,
      withTimezone: true,
    }),
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (tasks) => ({
    stageIdIndex: index('tasks_stage_id_idx').on(tasks.stageId),
    teamIdIndex: index('tasks_team_id_idx').on(tasks.teamId),
    assignedToIndex: index('tasks_assigned_to_idx').on(tasks.assignedTo),
  }),
);

export const tasksRelations = relations(tasks, ({ one }) => ({
  stage: one(stages, { fields: [tasks.stageId], references: [stages.id] }),
  team: one(teams, { fields: [tasks.teamId], references: [teams.id] }),
  assignee: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
  }),
}));

export const insertTaskSchema = createInsertSchema(tasks).omit({
  created: true,
  updated: true,
});

export const updateTaskSchema = createInsertSchema(tasks).omit({
  created: true,
  updated: true,
});

export type TaskType = typeof tasks.$inferSelect;

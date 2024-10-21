import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { challenges } from './challenges';
import { createInsertSchema } from 'drizzle-zod';
import { teams } from './teams';
import { users } from './users';

export const fileStorage = pgTable(
  'file_storage',
  {
    fileId: text('file_id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    challengeId: text('challenge_id').references(() => challenges.id),
    teamId: text('team_id').references(() => teams.id),
    userId: text('user_id').references(() => users.id),
    fileName: text('file_name').notNull(),
    bucketName: text('bucket_name').notNull(),
    fileType: text('file_type').notNull(), // "image", "video", "document", etc.
    status: text('status').notNull().default('processing'), // "uploaded", "processing", "approved", "rejected"
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (fileStorage) => ({
    challengeIdIndex: index('file_storage_challenge_id_idx').on(
      fileStorage.challengeId,
    ),
    teamIdIndex: index('file_storage_team_id_idx').on(fileStorage.teamId),
    userIdIndex: index('file_storage_user_id_idx').on(fileStorage.userId),
  }),
);

export const fileStorageRelations = relations(fileStorage, ({ one }) => ({
  challenge: one(challenges, {
    fields: [fileStorage.challengeId],
    references: [challenges.id],
  }),
  team: one(teams, { fields: [fileStorage.teamId], references: [teams.id] }),
  user: one(users, { fields: [fileStorage.userId], references: [users.id] }),
}));

export const insertFileSchema = createInsertSchema(fileStorage).omit({
  created: true,
  updated: true,
});

export const updateFileSchema = createInsertSchema(fileStorage).omit({
  created: true,
  updated: true,
});

export type FileStorageType = typeof fileStorage.$inferSelect;

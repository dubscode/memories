import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { submissions } from './submissions';
import { tags } from './tags';

export const tagsSubmissions = pgTable(
  'tags_submissions',
  {
    submissionId: text('submission_id')
      .references(() => submissions.id)
      .notNull(),
    tagId: text('tag_id')
      .references(() => tags.tagId)
      .notNull(),
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date())
  },
  (tagsSubmissions) => ({
    pk: primaryKey({
      columns: [tagsSubmissions.submissionId, tagsSubmissions.tagId]
    }),
    submissionIdIndex: index('tags_submissions_submission_id_idx').on(
      tagsSubmissions.submissionId
    ),
    tagIdIndex: index('tags_submissions_tag_id_idx').on(tagsSubmissions.tagId)
  })
);

export const tagsSubmissionsRelations = relations(
  tagsSubmissions,
  ({ one }) => ({
    submission: one(submissions, {
      fields: [tagsSubmissions.submissionId],
      references: [submissions.id]
    }),
    tag: one(tags, {
      fields: [tagsSubmissions.tagId],
      references: [tags.tagId]
    })
  })
);

export type SubmissionTagType = typeof tagsSubmissions.$inferSelect;

import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp
} from 'drizzle-orm/pg-core';

import { challenges } from './challenges';
import { relations } from 'drizzle-orm';
import { tags } from './tags';

export const tagsChallenges = pgTable(
  'tags_challenges',
  {
    challengeId: text('challenge_id')
      .references(() => challenges.id)
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
  (tagsChallenges) => ({
    pk: primaryKey({
      columns: [tagsChallenges.challengeId, tagsChallenges.tagId]
    }),
    challengeIdIndex: index('tags_challenges_challenge_id_idx').on(
      tagsChallenges.challengeId
    ),
    tagIdIndex: index('tags_challenges_tag_id_idx').on(tagsChallenges.tagId)
  })
);

export const tagsChallengesRelations = relations(tagsChallenges, ({ one }) => ({
  challenge: one(challenges, {
    fields: [tagsChallenges.challengeId],
    references: [challenges.id]
  }),
  tag: one(tags, {
    fields: [tagsChallenges.tagId],
    references: [tags.tagId]
  })
}));

export type ChallengeTagType = typeof tagsChallenges.$inferSelect;

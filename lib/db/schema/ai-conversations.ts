import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { aiMessages } from './ai-messages';
import { createInsertSchema } from 'drizzle-zod';
import { users } from './users';

export const aiConversations = pgTable(
  'ai_conversations',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    userId: text('user_id').references(() => users.id),
    title: text('title'),
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date())
  },
  (aiConversations) => ({
    userIdIndex: index('ai_conversations_user_id_idx').on(
      aiConversations.userId
    ),
    createdIndex: index('ai_conversations_created_idx').on(
      aiConversations.created
    ),
    updatedIndex: index('ai_conversations_updated_idx').on(
      aiConversations.updated
    )
  })
);

export const aiConversationsRelations = relations(
  aiConversations,
  ({ many }) => ({
    messages: many(aiMessages)
  })
);

export const insertAiConversationsSchema = createInsertSchema(
  aiConversations
).omit({
  created: true,
  updated: true
});

export const updateAiConversationsSchema = createInsertSchema(
  aiConversations
).omit({
  created: true,
  updated: true
});

export type AiConversationType = typeof aiConversations.$inferSelect;

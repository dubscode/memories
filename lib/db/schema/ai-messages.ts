import { aiConversations } from './ai-conversations';

import { relations, sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const aiMessages = pgTable(
  'ai_messages',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    conversationId: text('conversation_id').references(
      () => aiConversations.id,
    ),
    role: text('role').notNull(), // 'user' or 'assistant'
    content: text('content').notNull(),
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (aiMessages) => ({
    conversationIndex: index('ai_messages_conversation_id_idx').on(
      aiMessages.conversationId,
    ),
    createdIndex: index('ai_messages_created_idx').on(aiMessages.created),
    updatedIndex: index('ai_messages_updated_idx').on(aiMessages.updated),
  }),
);

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  conversation: one(aiConversations, {
    fields: [aiMessages.conversationId],
    references: [aiConversations.id],
  }),
}));

export const insertAiMessagesSchema = createInsertSchema(aiMessages).omit({
  created: true,
  updated: true,
});

export const updateAiMessagesSchema = createInsertSchema(aiMessages).omit({
  created: true,
  updated: true,
});

export type AiMessageType = typeof aiMessages.$inferSelect;

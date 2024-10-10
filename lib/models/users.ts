import { eq } from 'drizzle-orm';
import _ from 'lodash';
import { z } from 'zod';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { insertUserSchema, updateUserSchema } from '@/lib/db/schema/users';

export async function createUser(input: z.input<typeof insertUserSchema>) {
  const [newUser] = await db.insert(users).values(input).returning();

  return newUser;
}

export async function findById(id: string) {
  return await db.query.users.findFirst({ where: eq(users.id, id) });
}

export async function listUsers() {
  return await db.query.users.findMany();
}

export async function updateUser(input: z.input<typeof updateUserSchema>) {
  const { id, clerkId, email } = input;

  const matcher = id
    ? eq(users.id, id)
    : clerkId
      ? eq(users.clerkId, clerkId)
      : email
        ? eq(users.email, email)
        : undefined;

  const updateData = _.omitBy(input, _.isNil);
  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(matcher)
    .returning();

  return updatedUser;
}

import { challenges, users } from '@/lib/db/schema';

import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { insertChallengeSchema } from '../db/schema/challenges';
import { z } from 'zod';

export async function getChallengesByOrganizer(organizerId: string | null) {
  if (!organizerId) return [];

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, organizerId)
  });

  if (!user) return [];

  return await db.query.challenges.findMany({
    where: eq(challenges.organizerId, user.id)
  });
}

export async function createChallenge(
  input: z.input<typeof insertChallengeSchema>
) {
  console.log('%clib/models/challenges.ts:25 input', 'color: #007acc;', input);

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, input.organizerId)
  });

  console.log('%clib/models/challenges.ts:31 user', 'color: #007acc;', user);

  if (!user) return null;

  const [newChallenge] = await db
    .insert(challenges)
    .values({
      ...input,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      organizerId: user?.id
    })
    .returning();

  return newChallenge;
}

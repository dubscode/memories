import { asc, eq, gt } from 'drizzle-orm';
import { challenges, users } from '@/lib/db/schema';

import { db } from '@/lib/db';
import { insertChallengeSchema } from '../db/schema/challenges';
import { z } from 'zod';

export async function getChallengeById(id: string) {
  return await db.query.challenges.findFirst({
    where: eq(challenges.id, id),
  });
}

export async function getChallengesByOrganizer(organizerId: string | null) {
  if (!organizerId) return [];

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, organizerId),
  });

  if (!user) return [];

  return await db.query.challenges.findMany({
    where: eq(challenges.organizerId, user.id),
  });
}

export async function getChallengeDetails(id: string) {
  return await db.query.challenges.findFirst({
    where: eq(challenges.id, id),
    with: {
      organizer: true,
      events: true,
      stages: true,
      teams: true,
      resources: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
  });
}

export async function getTopChallenges(limit = 5) {
  const now = new Date();
  return await db.query.challenges.findMany({
    where: gt(challenges.endDate, now),
    orderBy: asc(challenges.startDate),
    limit,
    with: { teams: true },
  });
}

export type TopChallengeType = Awaited<
  ReturnType<typeof getTopChallenges>
>[number];

export async function createChallenge(
  input: z.input<typeof insertChallengeSchema>,
) {
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, input.organizerId),
  });

  if (!user) return null;

  const [newChallenge] = await db
    .insert(challenges)
    .values({
      ...input,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      organizerId: user?.id,
    })
    .returning();

  return newChallenge;
}

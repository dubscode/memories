import { asc, eq, gt } from 'drizzle-orm';
import { challenges, users } from '@/lib/db/schema';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { findByClerkId } from './users';
import { insertChallengeSchema } from '../db/schema/challenges';
import { z } from 'zod';

export async function deleteChallengeById(id: string) {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: 'User not authenticated' };
  }

  const user = await findByClerkId(userId);

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, id),
  });

  if (!challenge) {
    return { success: false, error: 'Challenge not found' };
  }

  if (challenge.organizerId !== user.id) {
    return { success: false, error: 'User not authorized' };
  }

  try {
    await db.delete(challenges).where(eq(challenges.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete challenge:', error);
    return { success: false, error: 'Failed to delete challenge' };
  }
}

export async function getChallengeById(id: string) {
  return await db.query.challenges.findFirst({
    where: eq(challenges.id, id),
  });
}

export async function getChallenges() {
  return await db.query.challenges.findMany();
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
      teams: {
        with: {
          members: {
            with: {
              user: true,
            },
          },
        },
      },
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

'use server';

import { challenges } from '@/lib/db/schema/challenges';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateChallengeDescription(
  challengeId: string,
  description: string,
) {
  try {
    await db
      .update(challenges)
      .set({ description })
      .where(eq(challenges.id, challengeId));

    revalidatePath(`/challenges/${challengeId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update challenge description:', error);
    return { success: false, error: 'Failed to update challenge description' };
  }
}

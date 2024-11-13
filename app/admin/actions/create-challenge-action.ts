'use server';

import { createChallenge as createChallengeModel } from '@/lib/models/challenges';
import { insertChallengeSchema } from '@/lib/db/schema/challenges';
import { revalidatePath } from 'next/cache';

export async function createChallenge(
  data: typeof insertChallengeSchema._type,
) {
  try {
    const newChallenge = await createChallengeModel(data);

    if (!newChallenge || newChallenge === null) {
      return { success: false, error: 'Failed to create challenge' };
    }

    revalidatePath('/admin');
    return { success: true, data: newChallenge };
  } catch (error) {
    console.error('Failed to create challenge:', error);
    return { success: false, error: 'Failed to create challenge' };
  }
}

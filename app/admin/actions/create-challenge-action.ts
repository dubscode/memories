'use server';

import { revalidatePath } from 'next/cache';

import { insertChallengeSchema } from '@/lib/db/schema/challenges';
import { createChallenge as createChallengeModel } from '@/lib/models/challenges';

export async function createChallenge(
  data: typeof insertChallengeSchema._type,
) {
  try {
    const newChallenge = await createChallengeModel(data);

    console.log(
      '%capp/admin/actions/create-challenge-action.ts:13 newChallenge',
      'color: #007acc;',
      newChallenge,
    );

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

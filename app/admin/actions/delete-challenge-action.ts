'use server';

import { auth } from '@clerk/nextjs/server';
import { deleteChallengeById } from '@/lib/models/challenges';
import { revalidatePath } from 'next/cache';

export async function deleteChallenge(id: string) {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const result = await deleteChallengeById(id);
    revalidatePath('/admin');
    return result;
  } catch (error) {
    console.error('Failed to delete challenge:', error);
    return { success: false, error: 'Failed to delete challenge' };
  }
}

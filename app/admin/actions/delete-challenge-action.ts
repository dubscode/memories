'use server';

import { challenges } from '@/lib/db/schema/challenges';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteChallenge(id: string) {
  try {
    await db.delete(challenges).where(eq(challenges.id, id));
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete challenge:', error);
    return { success: false, error: 'Failed to delete challenge' };
  }
}

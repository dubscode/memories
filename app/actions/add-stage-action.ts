'use server';

import { insertStageSchema, stages } from '@/lib/db/schema/stages';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addStage(data: typeof insertStageSchema._type) {
  try {
    const validatedData = insertStageSchema.parse(data);
    await db.insert(stages).values(validatedData);
    revalidatePath(`/challenges/${data.challengeId}`);
    return { success: true };
  } catch (error) {
    console.error('Error adding stage:', error);
    return { success: false, error: 'Failed to add stage' };
  }
}

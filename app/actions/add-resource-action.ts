'use server';

import { insertResourceSchema, resources } from '@/lib/db/schema/resources';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addResource(data: typeof insertResourceSchema._type) {
  try {
    const validatedData = insertResourceSchema.parse(data);
    await db.insert(resources).values(validatedData);
    revalidatePath(`/challenges/${data.challengeId}`);
    return { success: true };
  } catch (error) {
    console.error('Error adding resource:', error);
    return { success: false, error: 'Failed to add resource' };
  }
}

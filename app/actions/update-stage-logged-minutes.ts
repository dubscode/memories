'use server';

import { eq, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { stages } from '@/lib/db/schema/stages';

export async function updateStageLoggedMinutes(
  stageId: string,
  additionalMinutes: number,
) {
  try {
    const [updatedStage] = await db
      .update(stages)
      .set({
        loggedMinutes: sql`${stages.loggedMinutes} + ${additionalMinutes}`,
      })
      .where(eq(stages.id, stageId))
      .returning({ loggedMinutes: stages.loggedMinutes });

    revalidatePath('/challenges/[id]', 'page');
    return { success: true, loggedMinutes: updatedStage.loggedMinutes };
  } catch (error) {
    console.error('Failed to update logged minutes:', error);
    return { success: false, error: 'Failed to update logged minutes' };
  }
}

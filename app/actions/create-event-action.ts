'use server';

import { events, insertEventSchema } from '@/lib/db/schema/events';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createEvent(data: typeof insertEventSchema._type) {
  const { userId } = auth();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const newEvent = await db
      .insert(events)
      .values({
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      })
      .returning();
    revalidatePath(`/challenges/${data.challengeId}`);
    return { success: true, data: newEvent[0] };
  } catch (error) {
    console.error('Failed to create event:', error);
    return { success: false, error: 'Failed to create event' };
  }
}

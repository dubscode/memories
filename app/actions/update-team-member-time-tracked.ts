'use server';

import { and, eq, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { teamMembers } from '@/lib/db/schema/team-members';

export async function updateTeamMemberTimeTracked(
  teamId: string,
  userId: string,
  additionalMinutes: number,
) {
  try {
    const [updatedMember] = await db
      .update(teamMembers)
      .set({
        timeTracked: sql`${teamMembers.timeTracked} + ${additionalMinutes}`,
      })
      .where(
        and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
      )
      .returning({ timeTracked: teamMembers.timeTracked });

    revalidatePath('/challenges/[id]', 'page');
    return { success: true, timeTracked: updatedMember.timeTracked };
  } catch (error) {
    console.error('Failed to update time tracked:', error);
    return { success: false, error: 'Failed to update time tracked' };
  }
}

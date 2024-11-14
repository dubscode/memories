'use server';

import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { teamMembers } from '@/lib/db/schema/team-members';

export async function getTeamMemberAction(
  teamId?: string | null,
  userId?: string | null,
) {
  if (!teamId || !userId) {
    return { teamMember: null, error: 'Invalid team or user ID' };
  }

  try {
    const teamMember = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId),
      ),
    });

    revalidatePath('/challenges/[id]', 'page');
    return { teamMember, error: null };
  } catch (error) {
    console.error('Failed to update time tracked:', error);
    return {
      error: 'Failed to update time tracked',
      teamMember: null,
    };
  }
}

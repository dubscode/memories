import { insertUserSchema, updateUserSchema } from '@/lib/db/schema/users';
import { teamMembers, users } from '@/lib/db/schema';

import _ from 'lodash';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export async function createUser(input: z.input<typeof insertUserSchema>) {
  const [newUser] = await db.insert(users).values(input).returning();

  return newUser;
}

export async function findByClerkId(clerkId?: string | null) {
  if (!clerkId) {
    return null;
  }
  return await db.query.users.findFirst({ where: eq(users.clerkId, clerkId) });
}

export async function findById(id: string) {
  return await db.query.users.findFirst({ where: eq(users.id, id) });
}

export async function registeredChallengesByClerkId(clerkId?: string | null) {
  if (!clerkId) {
    return [];
  }

  const user = await findByClerkId(clerkId);

  if (!user) {
    return [];
  }

  return await db.query.teamMembers.findMany({
    where: eq(teamMembers.userId, user.id),
    with: {
      team: {
        with: { challenge: true },
      },
    },
  });
}

export async function isRegisteredForChallenge(
  userId: string | null,
  challengeId: string,
) {
  if (!userId) {
    return {
      isRegistered: false,
      teamId: null,
      dbUserId: null,
    };
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!dbUser) {
    return {
      isRegistered: false,
      teamId: null,
      dbUserId: null,
    };
  }

  const userTeams = await db.query.teamMembers.findMany({
    where: eq(teamMembers.userId, dbUser.id),
    with: { team: true },
  });

  const challengeTeam = userTeams.find(
    (userTeam) => userTeam.team.challengeId === challengeId,
  );

  return {
    isRegistered: !!challengeTeam,
    teamId: challengeTeam?.teamId,
    dbUserId: dbUser.id,
  };
}

export async function listUsers() {
  return await db.query.users.findMany();
}

export async function updateUser(input: z.input<typeof updateUserSchema>) {
  const { id, clerkId, email } = input;

  const matcher = id
    ? eq(users.id, id)
    : clerkId
      ? eq(users.clerkId, clerkId)
      : email
        ? eq(users.email, email)
        : undefined;

  const updateData = _.omitBy(input, _.isNil);
  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(matcher)
    .returning();

  return updatedUser;
}

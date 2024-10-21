'use server'

import { teamMembers, teams, users } from '@/lib/db/schema'

import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const formSchema = z.object({
  challengeId: z.string(),
  clerkId: z.string(),
  firstName: z.string().min(2, {
    message: 'User first name',
  }),
  lastName: z.string().min(2, {
    message: 'User last name',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  teamName: z.string().min(2, {
    message: 'Team name must be at least 2 characters.',
  }),
})

export async function registerTeamAction(formData: z.infer<typeof formSchema>) {
  try {
    // Validate the form data
    const validatedData = formSchema.parse(formData)

    // Check if the user already exists
    let user = await db.query.users.findFirst({
      where: eq(users.clerkId, validatedData.clerkId),
    })

    // If the user doesn't exist, create a new user
    if (!user) {
      const [newUser] = await db.insert(users).values({
        clerkId: validatedData.clerkId,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
      }).returning()
      user = newUser
    }

    // Create a new team
    const [team] = await db.insert(teams).values({
      challengeId: validatedData.challengeId,
      name: validatedData.teamName,
      teamLeadId: user.id,
      teamRole: 'developer',
    }).returning()

    // Associate the user with the team
    await db.insert(teamMembers).values({
      userId: user.id,
      teamId: team.id,
      role: 'LEADER', // Assuming the registering user is the team leader
    })

    // Revalidate the challenge page to reflect the new team
    revalidatePath(`/challenges/${validatedData.challengeId}`)

    return { success: true, message: `Team ${team.name} successfully registered.`, teamId: team.id }
  } catch (error) {
    console.error('Error registering team:', error)
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Validation error', errors: error.errors }
    }
    return { success: false, message: 'An unexpected error occurred' }
  }
}

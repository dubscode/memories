import { z } from 'zod';

export const formSchema = z.object({
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
});

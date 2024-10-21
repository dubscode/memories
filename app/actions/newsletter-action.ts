'use server'

import { loops } from '@/lib/loops'
import { z } from 'zod'

const emailSchema = z.string().email()

export async function registerNewsletter(email: string) {
  try {
    const validatedEmail = emailSchema.parse(email)

    const contact = await loops.createContact(validatedEmail)

    if (contact) {
      // Optionally, you can add the contact to a specific group or trigger a workflow
      // await loops.addContactToGroup(contact.id, 'newsletter-subscribers')
      // await loops.triggerWorkflow('welcome-email', { contactId: contact.id })

      return { success: true, message: 'Successfully registered for newsletter' }
    } else {
      return { success: false, message: 'Failed to create contact' }
    }
  } catch (error) {
    console.error('Error registering for newsletter:', error)
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Invalid email address' }
    }
    return { success: false, message: 'An unexpected error occurred' }
  }
}

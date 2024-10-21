'use client'

import * as z from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SignIn, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { registerTeamAction } from '@/app/challenges/[id]/register/actions/register-team-action'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'

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

export default function ChallengeRegistrationPage({ params }: { params: { id: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useUser()

  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      challengeId: params.id,
      clerkId: user?.id || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress || '',
      teamName: '',
    },
  })

  useEffect(() => {
    form.setValue('clerkId', user?.id || '')
    form.setValue('firstName', user?.firstName || '')
    form.setValue('lastName', user?.lastName || '')
    form.setValue(
      'email',
      user?.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress || ''
    )
  }, [form, user])

  if (!user) {
    return <SignIn />
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setIsSubmitting(true)

    const result = await registerTeamAction(values)

    if (!result.success) {
      setIsSubmitting(false)
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      })
      return
    } else {
      setIsSubmitting(false)
      toast({
        title: 'Registration Successful',
        description: result.message,
      })
    }
    router.push(`/challenges/${params.id}`)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Register for Challenge</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your full name as you&apos;d like it to appear.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your full name as you&apos;d like it to appear.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  We&apos;ll use this email to contact you about the challenge.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <Input placeholder="Awesome Hackers" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a name for your team. If you&apos;re participating solo, you can use your own name or a creative solo team name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Registering...' : 'Register for Challenge'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

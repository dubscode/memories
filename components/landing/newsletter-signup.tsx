'use client'

import * as z from 'zod'

import { ArrowRight, Loader2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerNewsletter } from '@/app/actions/newsletter-action'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
})

export function NewsletterSignup() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await registerNewsletter(values.email)
      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        })
        form.reset()
      } else {
        toast({
          title: 'Error',
          description: result.message || 'An error occurred. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='w-full py-12 md:py-24 lg:py-32'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              Ready to Join the Next Challenge?
            </h2>
            <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Stay updated with the latest hackathons and be the first to know about new opportunities.
            </p>
          </div>
          <div className='w-full max-w-sm space-y-2'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='flex space-x-2'>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className='flex-grow'>
                      <FormControl>
                        <Input
                          className='max-w-lg flex-1'
                          placeholder='Enter your email'
                          type='email'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </form>
            </Form>
            <p className='text-xs text-muted-foreground'>
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

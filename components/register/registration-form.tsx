'use client';

import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { formSchema } from '@/lib/schemas/register-schema';
import { registerTeamAction } from '@/app/challenges/[id]/register/actions/register-team-action';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';

export default function RegistrationForm({
  challengeId,
}: {
  challengeId: string;
}) {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      challengeId,
      clerkId: user?.id,
      email:
        user?.emailAddresses.find(
          (email) => email.id === user?.primaryEmailAddressId,
        )?.emailAddress || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      teamName: '',
    },
  });

  useEffect(() => {
    form.setValue('clerkId', user?.id || '');
    form.setValue(
      'email',
      user?.emailAddresses.find(
        (email) => email.id === user?.primaryEmailAddressId,
      )?.emailAddress || '',
    );
    form.setValue('firstName', user?.firstName || '');
    form.setValue('lastName', user?.lastName || '');
  }, [user, form]);

  const onError = (error: unknown) => {
    console.log('error:', error);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const result = await registerTeamAction(values);

    if (!result.success) {
      setIsSubmitting(false);
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
      return;
    } else {
      setIsSubmitting(false);
      toast({
        title: 'Registration Successful',
        description: result.message,
      });
    }
    router.push(`/challenges/${challengeId}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='teamName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder='Awesome Hackers' {...field} />
              </FormControl>
              <FormDescription>
                Enter a name for your team. If you&apos;re participating solo,
                you can use your own name or a creative solo team name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {isSubmitting ? 'Registering...' : 'Register for Challenge'}
        </Button>
      </form>
    </Form>
  );
}

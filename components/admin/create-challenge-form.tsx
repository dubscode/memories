'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { formatISO, parseISO } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createChallenge } from '@/app/admin/actions/create-challenge-action';
import { insertChallengeSchema } from '@/lib/db/schema/challenges';
import { useAuth } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Update the schema to expect ISO date strings
const formSchema = insertChallengeSchema.extend({
  startDate: z.string(),
  endDate: z.string(),
});

export function CreateChallengeForm() {
  const router = useRouter();
  const { userId } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      public: true,
      organizerId: userId || '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Convert local datetime to UTC
      const utcStartDate = formatISO(parseISO(data.startDate));
      const utcEndDate = formatISO(parseISO(data.endDate));

      await createChallenge({
        ...data,
        startDate: utcStartDate,
        endDate: utcEndDate,
      });

      toast({
        title: 'Success',
        description: 'Challenge created successfully',
      });
      router.refresh();
      form.reset();
    } catch (error) {
      console.error(error);

      const description =
        error instanceof Error ? error.message : 'Failed to create challenge';

      toast({
        title: 'Error',
        description,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Challenge Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter challenge name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter challenge description'
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='startDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date and Time</FormLabel>
              <FormControl>
                <Input type='datetime-local' {...field} />
              </FormControl>
              <FormDescription>
                All times are in your local timezone
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='endDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date and Time</FormLabel>
              <FormControl>
                <Input type='datetime-local' {...field} />
              </FormControl>
              <FormDescription>
                All times are in your local timezone
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='public'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Public Challenge</FormLabel>
                <FormDescription>
                  Make this challenge visible to the public
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type='submit'>Create Challenge</Button>
      </form>
    </Form>
  );
}

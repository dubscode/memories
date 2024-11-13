'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createEvent } from '@/app/actions/create-event-action';
import { insertEventSchema } from '@/lib/db/schema/events';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

type FormData = Omit<typeof insertEventSchema._type, 'challengeId'>;

export function AddEventForm({ challengeId }: { challengeId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(insertEventSchema.omit({ challengeId: true })),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await createEvent({ ...data, challengeId });
      if (result.success) {
        toast({
          title: 'Event created',
          description:
            'The event has been successfully added to the challenge.',
        });
        reset();
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Add New Event</CardTitle>
        <CardDescription>Create a new event for this challenge</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Event Name</Label>
              <Input
                id='name'
                {...register('name')}
                placeholder='Event Name'
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='startDate'>Start Date</Label>
              <Input
                id='startDate'
                {...register('startDate')}
                type='datetime-local'
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && (
                <p className='text-sm text-red-500'>
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='endDate'>End Date</Label>
              <Input
                id='endDate'
                {...register('endDate')}
                type='datetime-local'
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && (
                <p className='text-sm text-red-500'>{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Event Description</Label>
            <Textarea
              id='description'
              {...register('description')}
              placeholder='Event Description'
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className='text-sm text-red-500'>
                {errors.description.message}
              </p>
            )}
          </div>

          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
          >
            {isSubmitting ? 'Adding Event...' : 'Add Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

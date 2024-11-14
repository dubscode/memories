'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addStage } from '@/app/actions/add-stage-action';
import { insertStageSchema } from '@/lib/db/schema/stages';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

type FormData = Omit<typeof insertStageSchema._type, 'id'>;

interface AddStageFormProps {
  challengeId: string;
}

export function AddStageForm({ challengeId }: AddStageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,

    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(insertStageSchema.omit({ id: true })),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await addStage({ ...data, challengeId });

      if (result.success) {
        toast({
          title: 'Stage added',
          description:
            'The stage has been successfully added to the challenge.',
        });
        reset();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      const description =
        error instanceof Error
          ? error.message
          : 'Failed to add stage. Please try again.';
      toast({
        title: 'Error',
        description,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
      className='space-y-4'
    >
      <div className='space-y-2'>
        <Label htmlFor='name'>Stage Name</Label>
        <Input id='name' {...register('name')} placeholder='Stage Name' />
        {errors.name && (
          <p className='text-sm text-red-500'>{errors.name.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          {...register('description')}
          placeholder='Stage description'
        />
        {errors.description && (
          <p className='text-sm text-red-500'>{errors.description.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='durationMinutes'>Duration (minutes)</Label>
        <Input
          id='durationMinutes'
          type='number'
          {...register('durationMinutes', { valueAsNumber: true })}
          placeholder='Duration in minutes'
        />
        {errors.durationMinutes && (
          <p className='text-sm text-red-500'>
            {errors.durationMinutes.message}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='order'>Order</Label>
        <Input
          id='order'
          type='number'
          {...register('order', { valueAsNumber: true })}
          placeholder='Stage order'
        />
        {errors.order && (
          <p className='text-sm text-red-500'>{errors.order.message}</p>
        )}
      </div>
      <input type='hidden' {...register('challengeId')} value={challengeId} />
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Adding Stage...' : 'Add Stage'}
      </Button>
    </form>
  );
}

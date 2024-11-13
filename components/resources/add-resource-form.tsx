'use client';

import { Controller, useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addResource } from '@/app/actions/add-resource-action';
import { insertResourceSchema } from '@/lib/db/schema/resources';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

type FormData = Omit<typeof insertResourceSchema._type, 'resourceId'>;

interface AddResourceFormProps {
  challengeId: string;
}

export function AddResourceForm({ challengeId }: AddResourceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(insertResourceSchema.omit({ resourceId: true })),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await addResource({ ...data, challengeId });
      if (result.success) {
        toast({
          title: 'Resource added',
          description:
            'The resource has been successfully added to the challenge.',
        });
        reset();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      const description =
        error instanceof Error
          ? error.message
          : 'Failed to add resource. Please try again.';
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
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Title</Label>
        <Input id='title' {...register('title')} placeholder='Resource Title' />
        {errors.title && (
          <p className='text-sm text-red-500'>{errors.title.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='url'>URL</Label>
        <Input
          id='url'
          {...register('url')}
          placeholder='https://example.com'
          type='url'
        />
        {errors.url && (
          <p className='text-sm text-red-500'>{errors.url.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='resourceType'>Resource Type</Label>
        <Controller
          name='resourceType'
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder='Select resource type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='sponsor'>Sponsor</SelectItem>
                <SelectItem value='document'>Document</SelectItem>
                <SelectItem value='tool'>Tool</SelectItem>
                <SelectItem value='other'>Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.resourceType && (
          <p className='text-sm text-red-500'>{errors.resourceType.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          {...register('description')}
          placeholder='Brief description of the resource'
        />
        {errors.description && (
          <p className='text-sm text-red-500'>{errors.description.message}</p>
        )}
      </div>

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Adding Resource...' : 'Add Resource'}
      </Button>
    </form>
  );
}

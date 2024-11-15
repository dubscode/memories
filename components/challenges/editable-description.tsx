'use client';

import { useState } from 'react';

import { Pencil } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { updateChallengeDescription } from '@/app/actions/update-challenge-description';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface EditableDescriptionProps {
  initialDescription: string | null;
  challengeId: string;
  isOrganizer: boolean;
}

export function EditableDescription({
  initialDescription,
  challengeId,
  isOrganizer,
}: EditableDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!description) return;
    try {
      await updateChallengeDescription(challengeId, description);
      setIsEditing(false);
      toast({
        title: 'Description updated',
        description: 'The challenge description has been successfully updated.',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update the challenge description. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setDescription(initialDescription);
    setIsEditing(false);
  };

  return (
    <Card className='bg-accent mt-6'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>Description</CardTitle>
        {isOrganizer && !isEditing && (
          <Button variant='ghost' size='sm' onClick={handleEdit}>
            <Pencil className='h-4 w-4 mr-2' />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className='space-y-2'>
            <Textarea
              value={description ?? ''}
              onChange={(e) => setDescription(e.target.value)}
              className='min-h-[100px]'
            />
            <div className='flex justify-end space-x-2'>
              <Button variant='outline' onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        ) : (
          <div className='prose dark:prose-invert max-w-none'>
            <ReactMarkdown>{description ?? ''}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

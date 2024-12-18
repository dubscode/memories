'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { ChallengeType } from '@/lib/db/schema/challenges';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { deleteChallenge } from '@/app/admin/actions/delete-challenge-action';
import { useToast } from '@/hooks/use-toast';

export function ChallengesTable({
  challenges,
  dbUserId,
}: {
  challenges: ChallengeType[];
  dbUserId?: string | null;
}) {
  const { toast } = useToast();

  const isOrganizer = (organizedId: string) => {
    if (!dbUserId) return false;

    return dbUserId === organizedId;
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteChallenge(id);
      toast({
        title: 'Success',
        description: 'Challenge deleted successfully',
      });
    } catch (error) {
      console.log(error);

      const description =
        error instanceof Error ? error.message : 'Failed to delete challenge';

      toast({
        title: 'Error',
        description,
        variant: 'destructive',
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {challenges.map((challenge) => (
          <TableRow key={challenge.id}>
            <TableCell>
              <Link href={`/challenges/${challenge.id}`}>{challenge.name}</Link>
            </TableCell>
            <TableCell>
              {new Date(challenge.startDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {new Date(challenge.endDate).toLocaleDateString()}
            </TableCell>
            <TableCell>{getChallengeStatus(challenge)}</TableCell>
            <TableCell>
              {isOrganizer(challenge.organizerId) && (
                <Button
                  variant='destructive'
                  disabled={!isOrganizer(challenge.organizerId)}
                  size='sm'
                  onClick={() => handleDelete(challenge.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function getChallengeStatus(challenge: ChallengeType): string {
  const now = new Date();
  if (now < new Date(challenge.startDate)) return 'Upcoming';
  if (now > new Date(challenge.endDate)) return 'Completed';
  return 'In Progress';
}

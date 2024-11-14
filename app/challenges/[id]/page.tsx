import { Calendar, Clock, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { AddResourceForm } from '@/components/resources/add-resource-form';
import { AddStageForm } from '@/components/stages/add-stage-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditableDescription } from '@/components/challenges/editable-description';
import { EventList } from '@/components/events/event-list';
import Link from 'next/link';
import { PeriodicScreenshotCapture } from '@/components/captures/periodic-screenshot-capture';
import { RegisteredTeams } from '@/components/challenges/registered-teams';
import { ResourceList } from '@/components/resources/resource-list';
import { StageList } from '@/components/stages/stage-list';
import { auth } from '@clerk/nextjs/server';
import { format } from 'date-fns';
import { getChallengeDetails } from '@/lib/models/challenges';
import { isRegisteredForChallenge } from '@/lib/models/users';
import { notFound } from 'next/navigation';

export default async function ChallengePage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();

  const challenge = await getChallengeDetails(params.id);

  if (!challenge) {
    notFound();
  }

  const { dbUserId, isRegistered, teamId } = await isRegisteredForChallenge(
    userId,
    params.id,
  );

  const isOrganizer = challenge.organizer.id === dbUserId;

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-4xl font-bold mb-6'>{challenge.name}</h1>
      <div className='grid gap-6 md:grid-cols-3'>
        <div className='md:col-span-2'>
          <EditableDescription
            initialDescription={challenge.description}
            challengeId={challenge.id}
            isOrganizer={isOrganizer}
          />
        </div>
        <Card className='bg-accent'>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex items-center'>
              <Calendar className='mr-2 h-4 w-4' />
              <span>Start: {format(challenge.startDate, 'E, P p')}</span>
            </div>
            <div className='flex items-center'>
              <Clock className='mr-2 h-4 w-4' />
              <span>End: {format(challenge.endDate, 'E, P p')}</span>
            </div>
            <div className='flex items-center'>
              <Users className='mr-2 h-4 w-4' />
              <span>Organizer: {challenge.organizer.firstName}</span>
            </div>
            <div className='flex flex-wrap gap-2 mt-2'>
              {challenge.tags.map((tag) => (
                <Badge key={tag.tag.tagId} variant='secondary'>
                  {tag.tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className='w-full disabled:cursor-not-allowed'
              disabled={isRegistered}
            >
              {isRegistered ? (
                <span>Already Registered</span>
              ) : (
                <Link href={`/challenges/${challenge.id}/register`}>
                  Register Now
                </Link>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {isRegistered && (
        <Card className='mt-6 bg-accent'>
          <CardHeader>
            <CardTitle>Capture Progress</CardTitle>
            <CardDescription>
              Take periodic screenshots of your work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PeriodicScreenshotCapture
              challengeId={challenge.id}
              teamId={teamId}
              userId={dbUserId}
            />
          </CardContent>
        </Card>
      )}

      <div className='mt-10 space-y-6'>
        <EventList
          events={challenge.events}
          isOrganizer={isOrganizer}
          challengeId={challenge.id}
        />

        <StageList stages={challenge.stages} />

        {isOrganizer && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Stage</CardTitle>
              <CardDescription>
                Add a new stage to the challenge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddStageForm challengeId={challenge.id} />
            </CardContent>
          </Card>
        )}

        <RegisteredTeams teams={challenge.teams} />

        <ResourceList resources={challenge.resources} />

        {isOrganizer && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Resource</CardTitle>
              <CardDescription>
                Add a helpful resource for participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddResourceForm challengeId={challenge.id} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

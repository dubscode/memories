import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

import { getTeamMemberAction } from '@/app/actions/get-team-member-action';
import { PeriodicScreenshotCapture } from '@/components/captures/periodic-screenshot-capture';
import { ChallengeSummary } from '@/components/challenges/challenge-summary';
import { EditableDescription } from '@/components/challenges/editable-description';
import { RegisteredTeams } from '@/components/challenges/registered-teams';
import { AddEventForm } from '@/components/events/add-event-form';
import { EventList } from '@/components/events/event-list';
import { AddResourceForm } from '@/components/resources/add-resource-form';
import { ResourceList } from '@/components/resources/resource-list';
import { AddStageForm } from '@/components/stages/add-stage-form';
import { StageList } from '@/components/stages/stage-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getChallengeDetails } from '@/lib/models/challenges';
import { isRegisteredForChallenge } from '@/lib/models/users';

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

  const { teamMember } = await getTeamMemberAction(teamId, dbUserId);

  const isOrganizer = challenge.organizer.id === dbUserId;

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-4xl font-bold mb-6'>{challenge.name}</h1>
      <ChallengeSummary challenge={challenge} isRegistered={isRegistered} />

      <EditableDescription
        initialDescription={challenge.description}
        challengeId={challenge.id}
        isOrganizer={isOrganizer}
      />

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

      <div className='mt-6 space-y-6'>
        <StageList stages={challenge.stages} teamMember={teamMember} />

        <EventList
          events={challenge.events}
          isOrganizer={isOrganizer}
          challengeId={challenge.id}
        />

        <RegisteredTeams teams={challenge.teams} />

        <ResourceList resources={challenge.resources} />

        {isOrganizer && (
          <>
            <AddEventForm challengeId={challenge.id} />
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
          </>
        )}
      </div>
    </div>
  );
}

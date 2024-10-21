'use client';

import { Calendar } from '@/components/ui/calendar';
import { ChallengeType } from '@/lib/db/schema/challenges';

export default function UpcomingChallengesCalendar({
  challenges
}: {
  challenges: ChallengeType[];
}) {
  const upcomingChallenges = challenges.filter(
    (challenge) => new Date(challenge.startDate) > new Date()
  );

  return (
    <Calendar
      mode='multiple'
      selected={upcomingChallenges.map(
        (challenge) => new Date(challenge.startDate)
      )}
      className='rounded-md border'
    />
  );
}

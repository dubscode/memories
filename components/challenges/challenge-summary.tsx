'use client';

import { Calendar, Clock, Mail, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChallengeDetails } from '@/lib/types/challenges';
import Link from 'next/link';

type ChallengeSummaryProps = {
  challenge: ChallengeDetails;
  isRegistered: boolean;
};

export function ChallengeSummary({
  challenge,
  isRegistered,
}: ChallengeSummaryProps) {
  const [userTimezone, setUserTimezone] = useState('');
  const [localStartTime, setLocalStartTime] = useState('');
  const [localEndTime, setLocalEndTime] = useState('');

  useEffect(() => {
    if (!challenge) return;

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);

    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    const localStart = startDate.toLocaleString('en-US', {
      timeZone: timezone,
      dateStyle: 'full',
      timeStyle: 'long',
    });
    setLocalStartTime(localStart);

    const localEnd = endDate.toLocaleString('en-US', {
      timeZone: timezone,
      dateStyle: 'full',
      timeStyle: 'medium',
    });
    setLocalEndTime(localEnd);
  }, [challenge]);

  if (!challenge) return null;

  return (
    <Card className='bg-accent mt-6'>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Date row - flex on desktop, stack on mobile */}
        <div className='flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0'>
          <div className='flex items-center'>
            <Calendar className='mr-2 h-4 w-4' />
            <span>Start: {localStartTime}</span>
          </div>
          <div className='flex items-center'>
            <Calendar className='mr-2 h-4 w-4' />
            <span>End: {localEndTime}</span>
          </div>
        </div>

        {/* Timezone row */}
        <div className='flex items-center'>
          <Clock className='mr-2 h-4 w-4' />
          <span>Your Timezone: {userTimezone}</span>
        </div>

        {/* Organizer row */}
        <div className='flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0'>
          <div className='flex items-center'>
            <Users className='mr-2 h-4 w-4' />
            <span>Organizer: {challenge.organizer.firstName}</span>
          </div>
          <div className='flex items-center'>
            <Mail className='mr-2 h-4 w-4' />
            <span>
              Email:{' '}
              <a href={`mailto:${challenge.organizer.email}`}>
                {challenge.organizer.email}
              </a>
            </span>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
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
  );
}

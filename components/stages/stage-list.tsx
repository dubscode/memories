'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Play, StopCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StageType } from '@/lib/db/schema/stages';
import { TeamMemberType } from '@/lib/db/schema/team-members';
import { sortBy } from 'lodash';
import { updateTeamMemberTimeTracked } from '@/app/actions/update-team-member-time-tracked';
import { useToast } from '@/hooks/use-toast';

interface StageListProps {
  stages: StageType[];
  teamMember?: TeamMemberType | null;
}

export function StageList({ stages, teamMember }: StageListProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [totalTimeTracked, setTotalTimeTracked] = useState(
    teamMember?.timeTracked || 0,
  );
  const lastSavedMinuteRef = useRef(0);
  const { toast } = useToast();

  const saveLoggedTime = useCallback(async () => {
    if (!teamMember) return;
    try {
      const result = await updateTeamMemberTimeTracked(
        teamMember.teamId,
        teamMember.userId,
        1,
      );
      if (result.success) {
        setTotalTimeTracked(result.timeTracked || 0);
        toast({
          title: 'Time logged',
          description: '1 minute added to your total time.',
        });
      }
    } catch (error) {
      console.error('Failed to save logged time:', error);
    }
  }, [teamMember, toast]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setElapsedSeconds((prev) => {
          const newSeconds = prev + 1;
          const currentMinute = Math.floor(newSeconds / 60);

          if (currentMinute > lastSavedMinuteRef.current) {
            lastSavedMinuteRef.current = currentMinute;
            saveLoggedTime();
          }

          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTimerRunning, saveLoggedTime]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    lastSavedMinuteRef.current = 0;
  };

  const handleStopTimer = async () => {
    setIsTimerRunning(false);

    // If we have any seconds logged at all, save a minute
    if (elapsedSeconds > 0) {
      await saveLoggedTime();
    }

    setElapsedSeconds(0);
    lastSavedMinuteRef.current = 0;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className='bg-accent'>
      <CardHeader>
        <CardTitle>Stages</CardTitle>
        <CardDescription>Challenge stages and milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='mb-4 flex justify-between items-center'>
          <p>Total time tracked: {formatTime(totalTimeTracked * 60)}</p>
          <div className='flex items-center space-x-2'>
            {isTimerRunning ? (
              <>
                <Badge variant='secondary'>
                  Current session: {formatTime(elapsedSeconds)}
                </Badge>
                <Button size='sm' onClick={handleStopTimer}>
                  <StopCircle className='mr-2 h-4 w-4' />
                  Stop Timer
                </Button>
              </>
            ) : (
              <Button size='sm' onClick={handleStartTimer}>
                <Play className='mr-2 h-4 w-4' />
                Start Timer
              </Button>
            )}
          </div>
        </div>
        {stages.length > 0 ? (
          <ul className='space-y-4'>
            {sortBy(stages, 'order').map((stage) => (
              <li key={stage.id} className='flex flex-col space-y-2'>
                <div className='flex items-center justify-between'>
                  <div>
                    <span className='font-medium'>{stage.name}</span>
                    {stage.description && (
                      <p className='text-sm text-muted-foreground'>
                        {stage.description}
                      </p>
                    )}
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge variant='outline'>
                      {stage.durationMinutes} minutes
                    </Badge>
                    <Badge variant='secondary'>Order: {stage.order}</Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-center text-muted-foreground'>
            No stages defined yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

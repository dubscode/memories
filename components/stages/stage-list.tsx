'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Play, StopCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [lastSavedTime, setLastSavedTime] = useState<number>(0);
  const [totalTimeTracked, setTotalTimeTracked] = useState<number>(
    teamMember?.timeTracked || 0,
  );
  const { toast } = useToast();

  const saveLoggedTime = useCallback(
    async (seconds: number) => {
      if (!teamMember) return;
      const minutes = Math.ceil(seconds / 60);
      try {
        const result = await updateTeamMemberTimeTracked(
          teamMember.teamId,
          teamMember.userId,
          minutes,
        );
        if (result.success) {
          setLastSavedTime(seconds);
          setTotalTimeTracked(result.timeTracked || 0);
          toast({
            title: 'Time logged',
            description: `${minutes} minutes added to your total time.`,
          });
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Failed to save logged time:', error);
        toast({
          title: 'Error',
          description: 'Failed to save logged time. Please try again.',
          variant: 'destructive',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [teamMember?.teamId, teamMember?.userId],
  );

  useEffect(() => {
    if (!teamMember) return;
    const savedState = localStorage.getItem(`timerState_${teamMember.userId}`);
    if (savedState) {
      const {
        isTimerRunning: savedIsTimerRunning,
        elapsedSeconds: savedElapsedSeconds,
      } = JSON.parse(savedState);
      setIsTimerRunning(savedIsTimerRunning);
      setElapsedSeconds(savedElapsedSeconds);
    }
  }, [teamMember]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          if (teamMember) {
            localStorage.setItem(
              `timerState_${teamMember.userId}`,
              JSON.stringify({ isTimerRunning, elapsedSeconds: newSeconds }),
            );
          }
          return newSeconds;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, teamMember]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isTimerRunning) {
          saveLoggedTime(elapsedSeconds - lastSavedTime);
        }
      }
    };

    const handleBeforeUnload = () => {
      if (isTimerRunning) {
        saveLoggedTime(elapsedSeconds - lastSavedTime);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isTimerRunning, elapsedSeconds, lastSavedTime, saveLoggedTime]);

  useEffect(() => {
    if (isTimerRunning && elapsedSeconds - lastSavedTime >= 60) {
      saveLoggedTime(elapsedSeconds - lastSavedTime);
    }
  }, [isTimerRunning, elapsedSeconds, lastSavedTime, saveLoggedTime]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handleStopTimer = async () => {
    if (!teamMember) return;
    setIsTimerRunning(false);
    await saveLoggedTime(elapsedSeconds - lastSavedTime);
    setElapsedSeconds(0);
    setLastSavedTime(0);
    localStorage.removeItem(`timerState_${teamMember.userId}`);
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

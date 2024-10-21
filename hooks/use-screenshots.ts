'use client';

import {
  getTeamScreenshots,
  updateFileStatus,
} from '@/app/actions/get-presigned-url-action';
import { useCallback, useEffect, useState } from 'react';

import { FileStorageType } from '@/lib/db/schema/file-storage';
import { useToast } from '@/hooks/use-toast';

export type ScreenshotWithUrl = FileStorageType & { url: string };

type UseScreenshotsProps = {
  challengeId: string;
  teamId?: string | null;
  userId: string | null;
};

export function useScreenshots({
  challengeId,
  teamId,
  userId,
}: UseScreenshotsProps) {
  const [screenshots, setScreenshots] = useState<ScreenshotWithUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const refreshScreenshots = useCallback(async () => {
    if (!challengeId || !userId || !teamId) {
      setScreenshots([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedScreenshots = await getTeamScreenshots(challengeId, teamId);
      setScreenshots(fetchedScreenshots);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('An unknown error occurred'),
      );
      toast({
        title: 'Error',
        description: 'Failed to fetch screenshots',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [challengeId, teamId, userId, toast]);

  useEffect(() => {
    refreshScreenshots();
  }, [refreshScreenshots]);

  const addScreenshot = useCallback((newScreenshot: ScreenshotWithUrl) => {
    setScreenshots((prevScreenshots) => [...prevScreenshots, newScreenshot]);
  }, []);

  const updateScreenshotStatus = useCallback(
    async (
      fileId: string,
      status: 'uploaded' | 'processing' | 'approved' | 'rejected',
    ) => {
      await updateFileStatus(fileId, status);
      refreshScreenshots();
    },
    [refreshScreenshots],
  );

  return {
    screenshots,
    isLoading,
    error,
    refreshScreenshots,
    addScreenshot,
    updateScreenshotStatus,
  };
}

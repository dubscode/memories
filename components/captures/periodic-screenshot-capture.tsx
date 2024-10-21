'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScreenshotWithUrl, useScreenshots } from '@/hooks/use-screenshots';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { getPresignedUrlAction } from '@/app/actions/get-presigned-url-action';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const COUNTDOWN_SECONDS = 60;

type PeriodicScreenshotCaptureProps = {
  challengeId: string;
  teamId?: string | null;
  userId: string | null;
};

export function PeriodicScreenshotCapture({
  challengeId,
  teamId,
  userId,
}: PeriodicScreenshotCaptureProps) {
  const { toast } = useToast();
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const streamRef = useRef<MediaStream | null>(null);
  const isCapturingRef = useRef(false);

  const {
    screenshots,
    isLoading,
    error,
    addScreenshot,
    updateScreenshotStatus,
  } = useScreenshots({
    challengeId,
    teamId,
    userId,
  });

  const captureScreenshot = useCallback(async () => {
    if (!streamRef.current || isCapturingRef.current || !teamId) return;

    isCapturingRef.current = true;
    console.log('Capturing screenshot...');

    try {
      const video = document.createElement('video');
      video.srcObject = streamRef.current;
      await new Promise((resolve) => (video.onloadedmetadata = resolve));
      video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((blob) => resolve(blob), 'image/png'),
      );

      if (!blob) {
        throw new Error('Failed to capture screenshot');
      }

      const { putUrl, getUrl, fileId } = await getPresignedUrlAction({
        challengeId,
        teamId,
      });

      if (!putUrl) {
        throw new Error('Failed to get presigned URL');
      }

      const response = await fetch(putUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': 'image/png',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Screenshot uploaded successfully');
      await updateScreenshotStatus(fileId, 'uploaded');
      addScreenshot({
        fileId,
        url: getUrl,
        created: new Date().toISOString(),
      } as unknown as ScreenshotWithUrl);
    } catch (error) {
      console.error('Error in captureScreenshot:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to capture or upload screenshot',
        variant: 'destructive',
      });
    } finally {
      isCapturingRef.current = false;
    }
  }, [challengeId, teamId, toast, addScreenshot, updateScreenshotStatus]);

  const startCapturing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      streamRef.current = stream;
      setIsCapturing(true);
    } catch (error) {
      console.error('Error starting screen capture:', error);
      toast({
        title: 'Error',
        description: 'Failed to start screen capture',
        variant: 'destructive',
      });
    }
  };

  const stopCapturing = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsCapturing(false);
    setCountdown(COUNTDOWN_SECONDS);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isCapturing) {
      intervalId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            captureScreenshot();
            return COUNTDOWN_SECONDS;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCapturing, captureScreenshot]);

  if (isLoading) {
    return <div>Loading screenshots...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Periodic Screenshot Capture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4'>
          <div className='space-y-4'>
            {isCapturing ? (
              <>
                <div className='text-center text-sm'>
                  Next in: {Math.floor(countdown / 60)}:
                  {(countdown % 60).toString().padStart(2, '0')}
                </div>
                <Progress
                  value={
                    ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100
                  }
                  className='w-full'
                />
                <Button
                  onClick={stopCapturing}
                  variant='destructive'
                  className='w-full'
                >
                  Stop
                </Button>
              </>
            ) : (
              <Button onClick={startCapturing} className='w-full'>
                Start Capturing
              </Button>
            )}
            <div className='text-sm text-center'>
              Total: {screenshots.length}
            </div>
          </div>
          <div className='w-full'>
            {screenshots.length > 0 ? (
              <Carousel className='w-full max-w-xs mx-auto'>
                <CarouselContent>
                  {screenshots.map((screenshot, index) => (
                    <CarouselItem key={screenshot.fileId} className='basis-1/3'>
                      <div className='p-1'>
                        <Card>
                          <CardContent className='flex aspect-square items-center justify-center p-6'>
                            <Dialog>
                              <DialogTrigger asChild>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className='relative cursor-pointer group'
                                >
                                  <Image
                                    src={screenshot.url}
                                    alt={`Screenshot ${index + 1}`}
                                    width={300}
                                    height={300}
                                    className='rounded-lg object-cover'
                                  />
                                  <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                    <Expand className='text-white w-10 h-10' />
                                  </div>
                                </motion.div>
                              </DialogTrigger>
                              <DialogContent className='max-w-3xl w-full p-0'>
                                <Image
                                  src={screenshot.url}
                                  alt={`Full size screenshot ${index + 1}`}
                                  width={1920}
                                  height={1080}
                                  className='w-full h-auto'
                                />
                              </DialogContent>
                            </Dialog>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className='hidden md:flex'>
                  <ChevronLeft className='w-6 h-6' />
                </CarouselPrevious>
                <CarouselNext className='hidden md:flex'>
                  <ChevronRight className='w-6 h-6' />
                </CarouselNext>
              </Carousel>
            ) : (
              <div className='text-center text-muted-foreground'>
                No screenshots captured yet.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

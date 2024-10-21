'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';

export default function PeriodicScreenshotCapture() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(5); // 5 minutes in seconds
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const captureScreenshot = async () => {
    if (!streamRef.current) return;

    const video = document.createElement('video');
    video.srcObject = streamRef.current;
    await new Promise((resolve) => (video.onloadedmetadata = resolve));
    video.play();

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);

    const screenshotDataUrl = canvas.toDataURL('image/png');
    setScreenshots((prev) => [...prev, screenshotDataUrl]);
  };

  const startCapturing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      streamRef.current = stream;
      setIsCapturing(true);
    } catch (error) {
      console.error('Error starting screen capture:', error);
    }
  };

  const stopCapturing = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsCapturing(false);
    setCountdown(5);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isCapturing) {
      intervalId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            captureScreenshot();
            return 5; // Reset to 5 minutes
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCapturing]);

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Periodic Screenshot Capture</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isCapturing ? (
          <>
            <div className='text-center'>
              Next screenshot in: {Math.floor(countdown / 60)}:
              {(countdown % 60).toString().padStart(2, '0')}
            </div>
            <Progress value={(5 - countdown) / 3} />
            <Button onClick={stopCapturing} variant='destructive'>
              Stop Capturing
            </Button>
          </>
        ) : (
          <Button onClick={startCapturing}>Start Capturing</Button>
        )}
        <div>Total screenshots: {screenshots.length}</div>
        <div className='grid grid-cols-2 gap-2'>
          {screenshots.slice(-4).map((screenshot, index) => (
            <Image
              key={index}
              src={screenshot}
              alt={`Screenshot ${index + 1}`}
              className='w-full'
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

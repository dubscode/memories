'use client';

import { useEffect, useState } from 'react';

import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function DualNotification() {
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const sendNotification = (message: string) => {
    // Send toast notification
    toast({
      title: 'Notification',
      description: message,
    });

    // Send OS notification
    if (notificationPermission === 'granted') {
      new Notification('Webdevathon Notification', {
        body: message,
        icon: '/favicon.ico', // Make sure to have a favicon in your public folder
      });
    } else if (notificationPermission === 'default') {
      requestNotificationPermission();
    }
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Bell className='h-5 w-5' />
          Dual Notification System
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Button
          onClick={() => sendNotification('Your hackathon project is awesome!')}
          className='w-full'
        >
          Send Notification
        </Button>
        {notificationPermission !== 'granted' && (
          <Button
            onClick={requestNotificationPermission}
            variant='outline'
            className='w-full'
          >
            {notificationPermission === 'denied'
              ? 'Notification Permission Denied'
              : 'Request Notification Permission'}
          </Button>
        )}
        <div className='text-sm text-muted-foreground'>
          OS Notification Status: {notificationPermission}
        </div>
      </CardContent>
    </Card>
  );
}

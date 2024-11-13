'use client';

import { Calendar, Clock, Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { compareAsc, format } from 'date-fns';
import { formatToICSDate, generateICS } from '@/lib/utils';

import { AddEventForm } from './add-event-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EventType } from '@/lib/db/schema/events';

interface EventListProps {
  events: EventType[];
  isOrganizer: boolean;
  challengeId: string;
}

export function EventList({
  events,
  isOrganizer,
  challengeId,
}: EventListProps) {
  const sortedEvents = [...events].sort((a, b) =>
    compareAsc(new Date(a.startDate), new Date(b.startDate)),
  );

  const handleDownloadICS = (event: EventType) => {
    console.log(
      '%ccomponents/events/event-list.tsx:36 event.startDate',
      'color: #007acc;',
      formatToICSDate(event.startDate),
    );
    const icsContent = generateICS(event);
    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.name}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events</CardTitle>
        <CardDescription>Scheduled events for this challenge</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedEvents.length > 0 ? (
          <ul className='space-y-4'>
            {sortedEvents.map((event) => (
              <li key={event.id}>
                <Card>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='text-lg'>{event.name}</CardTitle>
                      <Badge variant='outline'>
                        {format(new Date(event.startDate), 'MMM d')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground mb-2'>
                      {event.description}
                    </p>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4 text-sm'>
                        <div className='flex items-center'>
                          <Calendar className='mr-1 h-4 w-4' />
                          <span>
                            {format(new Date(event.startDate), 'MMMM d, yyyy')}
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Clock className='mr-1 h-4 w-4' />
                          <span>
                            {format(new Date(event.startDate), 'h:mm a')} -{' '}
                            {format(new Date(event.endDate), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDownloadICS(event)}
                        className='ml-4'
                      >
                        <Download className='mr-2 h-4 w-4' />
                        Add to Calendar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-center text-muted-foreground'>
            No events scheduled yet.
          </p>
        )}
      </CardContent>
      {isOrganizer && (
        <CardFooter>
          <AddEventForm challengeId={challengeId} />
        </CardFooter>
      )}
    </Card>
  );
}

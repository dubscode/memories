import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { StageType } from '@/lib/db/schema/stages';
import { sortBy } from 'lodash';

interface StageListProps {
  stages: StageType[];
}

export function StageList({ stages }: StageListProps) {
  return (
    <Card className='bg-accent'>
      <CardHeader>
        <CardTitle>Stages</CardTitle>
        <CardDescription>Challenge stages and milestones</CardDescription>
      </CardHeader>
      <CardContent>
        {stages.length > 0 ? (
          <ul className='space-y-2'>
            {sortBy(stages, 'order').map((stage) => (
              <li key={stage.id} className='flex items-center justify-between'>
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

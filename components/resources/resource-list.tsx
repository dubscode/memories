import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, LinkIcon, PenToolIcon as Tool, Users } from 'lucide-react';

import { ResourceType } from '@/lib/db/schema/resources';

interface ResourceListProps {
  resources: ResourceType[];
}

export function ResourceList({ resources }: ResourceListProps) {
  const getIconForResourceType = (type: string) => {
    switch (type) {
      case 'sponsor':
        return <Users className='h-4 w-4' />;
      case 'document':
        return <FileText className='h-4 w-4' />;
      case 'tool':
        return <Tool className='h-4 w-4' />;
      default:
        return <LinkIcon className='h-4 w-4' />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources</CardTitle>
        <CardDescription>Helpful resources for participants</CardDescription>
      </CardHeader>
      <CardContent>
        {resources.length > 0 ? (
          <ul className='space-y-2'>
            {resources.map((resource) => (
              <li key={resource.resourceId}>
                <a
                  href={resource.url || '#'}
                  className='flex items-center hover:underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {getIconForResourceType(resource.resourceType)}
                  <span className='ml-2'>{resource.title}</span>
                </a>
                {resource.description && (
                  <p className='text-sm text-muted-foreground ml-6'>
                    {resource.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-center text-muted-foreground'>
            No resources available yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

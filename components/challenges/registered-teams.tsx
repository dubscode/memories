import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';

interface TeamMember {
  userId: string;
  user: {
    firstName: string | null;
    lastName: string | null;
  };
  role: string;
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

interface RegisteredTeamsProps {
  teams: Team[];
}

export function RegisteredTeams({ teams }: RegisteredTeamsProps) {
  return (
    <Card className='bg-accent'>
      <CardHeader>
        <CardTitle>Teams</CardTitle>
        <CardDescription>Participating teams</CardDescription>
      </CardHeader>
      <CardContent>
        {teams.length > 0 ? (
          <div className='space-y-6'>
            {teams.map((team) => (
              <div key={team.id} className='space-y-2'>
                <h3 className='text-lg font-semibold flex items-center'>
                  <Badge variant='secondary' className='mr-2'>
                    {team.name}
                  </Badge>
                  <span className='text-sm text-muted-foreground'>
                    ({team.members.length} members)
                  </span>
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[200px]'>Name</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.members.map((member) => (
                      <TableRow key={member.userId}>
                        <TableCell className='font-medium'>
                          {member.user.firstName} {member.user.lastName}
                        </TableCell>
                        <TableCell>{member.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-center text-muted-foreground'>
            No teams registered yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

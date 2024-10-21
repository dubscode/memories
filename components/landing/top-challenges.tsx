import { ArrowRight, Calendar, Trophy, Users } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TopChallengeType } from '@/lib/models/challenges';

type TopChallengesProps = {
  challenges: TopChallengeType[];
};

export const TopChallenges = ({ challenges }: TopChallengesProps) => {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32'>
      <div className='container mx-auto px-4 md:px-6'>
        <h2 className='mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
          Top Upcoming Challenges
        </h2>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
          {challenges.map((challenge) => (
            <Card key={challenge.id} className='flex flex-col justify-between'>
              <CardHeader>
                <CardTitle>
                  <Link href={`/challenges/${challenge.id}`}>
                    {challenge.name}
                  </Link>
                </CardTitle>
                <CardDescription>
                  <div className='flex items-center mt-2'>
                    <Calendar className='mr-2 h-4 w-4' />
                    <span>
                      {challenge.startDate.toLocaleDateString()} to{' '}
                      {challenge.endDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className='flex items-center mt-1'>
                    <Users className='mr-2 h-4 w-4' />
                    <span>{challenge.teams.length ?? 0} teams</span>
                  </div>
                  <div className='flex items-center mt-1'>
                    <Trophy className='mr-2 h-4 w-4' />
                    <span>Prizes</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className='w-full'>
                  <Link href={`/challenges/${challenge.id}/register`}>
                    Register Now
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

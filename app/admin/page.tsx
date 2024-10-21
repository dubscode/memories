import {
  findByClerkId,
  registeredChallengesByClerkId,
} from '@/lib/models/users';

import { ChallengesTable } from '@/components/admin/challenges-table';
import { CreateChallengeForm } from '@/components/admin/create-challenge-form';
import { auth } from '@clerk/nextjs/server';
import { getChallengesByOrganizer } from '@/lib/models/challenges';

export default async function AdminPage() {
  const { userId } = auth();
  const organizedChallenges = await getChallengesByOrganizer(userId);
  const registeredChallenges = await registeredChallengesByClerkId(userId);
  const dbUser = await findByClerkId(userId);

  const challenges = registeredChallenges.map(
    (registratiion) => registratiion.team.challenge,
  );

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <div className='md:col-span-2'>
        <h2 className='mb-4 text-xl font-semibold'>Challenges You Organized</h2>
        <ChallengesTable
          challenges={organizedChallenges}
          dbUserId={dbUser?.id}
        />
      </div>
      <div className='md:col-span-2'>
        <h2 className='mb-4 text-xl font-semibold'>Your Teams</h2>
        <ChallengesTable challenges={challenges} dbUserId={dbUser?.id} />
      </div>
      <div>
        <h2 className='mb-4 text-xl font-semibold'>Create New Challenge</h2>
        <CreateChallengeForm />
      </div>
    </div>
  );
}

import ChallengesTable from '@/components/admin/challenges-table';
import CreateChallengeForm from '@/components/admin/create-challenge-form';
import { auth } from '@clerk/nextjs/server';
import { getChallengesByOrganizer } from '@/lib/models/challenges';

export default async function AdminPage() {
  const { userId } = auth();
  const challenges = await getChallengesByOrganizer(userId);

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <div className='md:col-span-2'>
        <h2 className='mb-4 text-xl font-semibold'>Your Challenges</h2>
        <ChallengesTable challenges={challenges} />
      </div>
      <div>
        <h2 className='mb-4 text-xl font-semibold'>Create New Challenge</h2>
        <CreateChallengeForm />
      </div>
    </div>
  );
}

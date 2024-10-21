import { ChallengesTable } from '@/components/admin/challenges-table';
import { appOptions } from '@/config/app-options';
import { auth } from '@clerk/nextjs/server';
import { findByClerkId } from '@/lib/models/users';
import { getChallenges } from '@/lib/models/challenges';

export default async function ChallengesPage() {
  const { userId } = auth();
  const dbUser = await findByClerkId(userId);
  const challenges = await getChallenges();

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <div className='md:col-span-2'>
        <h2 className='mb-4 text-xl font-semibold'>
          Challenges on {appOptions.appName}
        </h2>
        <ChallengesTable challenges={challenges} dbUserId={dbUser?.id} />
      </div>
    </div>
  );
}

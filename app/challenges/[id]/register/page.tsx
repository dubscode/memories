import RegistrationForm from '@/components/register/registration-form';
import UserInfoDisplay from '@/components/register/user-info-display';
import { auth } from '@clerk/nextjs/server';
import { getChallengeById } from '@/lib/models/challenges';
import { isRegisteredForChallenge } from '@/lib/models/users';
import { redirect } from 'next/navigation';

export default async function ChallengeRegistrationPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect(`/sign-in?redirectUrl=/challenges/${params.id}/register`);
  }

  const challenge = await getChallengeById(params.id);

  if (!challenge) {
    redirect('/challenges');
  }

  const isRegistered = await isRegisteredForChallenge(userId, params.id);

  if (isRegistered) {
    redirect(`/challenges/${params.id}`);
  }

  return (
    <div className='container mx-auto py-10 px-4'>
      <h1 className='text-3xl font-bold mb-6'>
        Register for Challenge: {challenge.name}
      </h1>

      <UserInfoDisplay />
      <RegistrationForm challengeId={params.id} />
    </div>
  );
}

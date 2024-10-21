'use client';

import { useUser } from '@clerk/nextjs';

export default function UserInfoDisplay() {
  const { user } = useUser();

  return (
    <div className='mb-6'>
      <h2 className='text-xl font-semibold mb-2'>Your Information</h2>
      <p>
        <strong>Name:</strong> {user?.firstName} {user?.lastName}
      </p>
      <p>
        <strong>Email:</strong>{' '}
        {
          user?.emailAddresses.find(
            (email) => email.id === user?.primaryEmailAddressId,
          )?.emailAddress
        }
      </p>
    </div>
  );
}

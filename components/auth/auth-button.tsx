'use client';

import { SignIn } from './sign-in';
import { SignOut } from './sign-out';
import { useSession } from 'next-auth/react';

export const AuthButton = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    return <SignIn />;
  } else {
    return <SignOut user={session.user} />;
  }
};

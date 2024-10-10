'use client';

import { Button } from '@/components/ui/button';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

type SignOutProps = {
  user: Session['user'];
};

export const SignOut = ({ user }: SignOutProps) => {
  return <Button onClick={() => signOut()}>{user?.name ?? 'Sign Out'}</Button>;
};

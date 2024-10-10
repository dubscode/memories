'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export const SignIn = () => {
  return (
    <Button onClick={() => signIn('google', { redirectTo: '/dashboard' })}>
      Sign In
    </Button>
  );
};

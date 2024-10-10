import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export const AuthButton = () => {
  return (
    <>
      <SignedOut>
        <SignInButton>
          <Button className='text-sm' variant='ghost'>
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
};

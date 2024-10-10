'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useClerk, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export function UserNav() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.imageUrl) {
      setUserImage(user?.imageUrl);
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <Button
        variant='ghost'
        size='icon'
        className='relative h-8 w-8 rounded-full'
      >
        <Loader2 className='h-4 w-4 animate-spin' />
      </Button>
    );
  }

  if (!isSignedIn) {
    return null; // Or render a sign-in button
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            {userImage ? (
              <div className='aspect-square h-full w-full'>
                <Image
                  src={userImage}
                  alt={user.fullName ?? 'User avatar'}
                  width={32}
                  height={32}
                  className='rounded-full object-cover'
                />
              </div>
            ) : (
              <AvatarFallback>{user.firstName?.[0] ?? 'U'}</AvatarFallback>
            )}
          </Avatar>
          <span className='sr-only'>Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {user.fullName ?? user.firstName}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut({ redirectUrl: '/' })}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'use client';

import { AuthButton } from '../auth/auth-button';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { appOptions } from '@/config/app-options';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();

  if (pathname.includes('dashboard')) {
    return null;
  }

  return (
    <header className='flex h-14 items-center justify-between px-4 lg:px-6'>
      <Link className='flex items-center justify-center' href='/'>
        <Zap className='h-6 w-6' />
        <span className='ml-2 font-bold'>{appOptions.appName}</span>
      </Link>
      <nav className='flex gap-4 sm:gap-6'>
        {appOptions.navLinks.map((link, idx) => (
          <Link
            key={idx}
            className='text-sm font-medium underline-offset-4 hover:underline'
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <AuthButton />
    </header>
  );
};

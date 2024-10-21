import Link from 'next/link';

import { appOptions } from '@/config/app-options';

export const Footer = () => {
  return (
    <footer className='flex w-full shrink-0 flex-col items-center justify-between gap-2 border-t px-4 py-6 sm:flex-row md:px-6'>
      <p className='text-xs text-gray-500 dark:text-gray-400'>
        © 2024 {appOptions.appName}. All rights reserved.
      </p>
      <nav className='flex gap-4 sm:gap-6'>
        <Link className='text-xs underline-offset-4 hover:underline' href='#'>
          Terms of Service
        </Link>
        <Link className='text-xs underline-offset-4 hover:underline' href='#'>
          Privacy
        </Link>
      </nav>
    </footer>
  );
};

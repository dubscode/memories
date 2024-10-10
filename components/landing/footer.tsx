import Link from 'next/link';
import { appOptions } from '@/config/app-options';

export const Footer = () => {
  return (
    <footer className='flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-between px-4 md:px-6 border-t'>
      <p className='text-xs text-gray-500 dark:text-gray-400'>
        © 2024 {appOptions.appName}. All rights reserved.
      </p>
      <nav className='flex gap-4 sm:gap-6'>
        <Link
          className='text-xs hover:underline underline-offset-4'
          href='#'
        >
          Terms of Service
        </Link>
        <Link
          className='text-xs hover:underline underline-offset-4'
          href='#'
        >
          Privacy
        </Link>
      </nav>
    </footer>
  );
};

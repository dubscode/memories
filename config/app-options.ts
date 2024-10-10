type AppOptions = {
  appName: string;
  address: string;
  supportEmail: string;
  supportPhone: string;

  navLinks: {
    href: __next_route_internal_types__.RouteImpl<string>;
    label: string;
  }[];
};

export const appOptions: AppOptions = {
  appName: 'Starter App',
  address: '1234 Elm St, Springfield, IL 62701',
  supportEmail: 'help@starter.app',
  supportPhone: '+1 (800) 555-1234',
  navLinks: [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
};

import localFont from 'next/font/local';

export const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
export const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

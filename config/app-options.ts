import localFont from 'next/font/local';

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
  appName: 'Webdevathon',
  address: 'Portland, Oregon',
  supportEmail: 'hi@danwise.dev',
  supportPhone: '+1 (503) 597-8290',
  navLinks: [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
};

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

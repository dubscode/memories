import '@/config/globals.css';

import { appOptions, geistMono, geistSans } from '@/config/app-options';

import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';
import type { Metadata } from 'next';
import { SessionProvider } from '@/components/auth/session-provider';
import { ThemeProvider } from '@/components/dark-mode/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: `${appOptions.appName}`,
  description: 'Hit the ground running with this starter app.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <head>
        <link
          rel='icon'
          href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>'
        ></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <div className='flex flex-col min-h-screen'>
              <Header />
              {children}
              <Footer />
              <Toaster />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';

import { ThemeProvider } from '@/components/dark-mode/theme-provider';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';
import { Toaster } from '@/components/ui/toaster';
import { appOptions, geistMono, geistSans } from '@/config/app-options';
import '@/config/globals.css';

export const metadata: Metadata = {
  title: `${appOptions.appName}`,
  description: 'Hit the ground running with this starter app.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link
          rel='icon'
          href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>'
        ></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <div className='flex min-h-screen flex-col'>
              <Header />
              {children}
              <Footer />
              <Toaster />
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

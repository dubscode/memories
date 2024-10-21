import { Calendar, Trophy, Users, Zap } from 'lucide-react';

import Image from 'next/image';
import { NewsletterSignup } from '@/components/landing/newsletter-signup';
import { TopChallenges } from '@/components/landing/top-challenges';
import { getTopChallenges } from '@/lib/models/challenges';
import hackathonParticipants from '@/images/hackathon-users.webp';

export default async function LandingPage() {
  const challenges = await getTopChallenges();

  return (
    <main className='flex-1'>
      <section className='flex w-full items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-primary to-primary-foreground dark:from-primary-dark dark:to-primary-foreground-dark'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary-contrast dark:text-primary-contrast-dark'>
                Join a Hackathon, Learn, Network, and Create Memories!
              </h1>
              <p className='mx-auto max-w-[700px] md:text-xl text-primary-contrast/80 dark:text-primary-contrast-dark/80'>
                Discover exciting challenges, showcase your skills, and connect
                with like-minded innovators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <ScreenshotCapture />

      <PeriodicScreenshotCapture />

      <DualNotification /> */}

      <TopChallenges challenges={challenges} />

      <section className='w-full bg-muted py-12 md:py-24 lg:py-32'>
        <div className='container mx-auto px-4 md:px-6'>
          <div className='grid items-center gap-6 lg:grid-cols-2 lg:gap-12'>
            <div className='space-y-4'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                Why Choose Webdevathon?
              </h2>
              <p className='text-muted-foreground'>
                We&apos;re committed to providing the best hackathon experience.
                Here&apos;s why participants love us:
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center'>
                  <Zap className='mr-2 h-4 w-4 text-primary' />
                  <span>Exciting and diverse challenges</span>
                </li>
                <li className='flex items-center'>
                  <Users className='mr-2 h-4 w-4 text-primary' />
                  <span>Network with industry professionals</span>
                </li>
                <li className='flex items-center'>
                  <Trophy className='mr-2 h-4 w-4 text-primary' />
                  <span>Attractive prizes and opportunities</span>
                </li>
                <li className='flex items-center'>
                  <Calendar className='mr-2 h-4 w-4 text-primary' />
                  <span>Regular events throughout the year</span>
                </li>
              </ul>
            </div>
            <div className='flex justify-center'>
              <Image
                alt='Hackathon Participants'
                className='rounded-lg object-cover'
                height='400'
                src={hackathonParticipants.src}
                style={{
                  aspectRatio: '600/400',
                  objectFit: 'cover',
                }}
                width='600'
              />
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </main>
  );
}

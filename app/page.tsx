import { ArrowRight, BarChart, CheckCircle, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

export default function LandingPage() {
  return (
    <main className='flex-1'>
      <section className='w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                Welcome to the Future of Technology
              </h1>
              <p className='mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400'>
                Discover how our innovative solutions can transform your
                business and drive growth.
              </p>
            </div>
            <div className='space-x-4'>
              <Button>Get Started</Button>
              <Button variant='outline'>Learn More</Button>
            </div>
          </div>
        </div>
      </section>
      <section className='w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800'>
        <div className='container px-4 md:px-6 mx-auto'>
          <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8'>
            Our Key Features
          </h2>
          <div className='grid gap-6 lg:grid-cols-3 lg:gap-12 justify-items-center'>
            <Card className='w-full max-w-sm'>
              <CardHeader>
                <Shield className='w-8 h-8 mb-2' />
                <CardTitle>Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Bank-grade security to keep your data safe and protected at
                  all times.
                </p>
              </CardContent>
            </Card>
            <Card className='w-full max-w-sm'>
              <CardHeader>
                <Zap className='w-8 h-8 mb-2' />
                <CardTitle>Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Lightning-fast performance that keeps your business running
                  smoothly.
                </p>
              </CardContent>
            </Card>
            <Card className='w-full max-w-sm'>
              <CardHeader>
                <BarChart className='w-8 h-8 mb-2' />
                <CardTitle>Insightful</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Powerful analytics to help you make data-driven decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className='w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6 mx-auto'>
          <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
            <div className='space-y-4'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                Why Choose Us?
              </h2>
              <p className='text-gray-500 dark:text-gray-400'>
                We&apos;re committed to providing the best solutions for your
                business. Here&apos;s why our customers love us:
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  <span>24/7 customer support</span>
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  <span>99.9% uptime guarantee</span>
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  <span>Flexible pricing plans</span>
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  <span>Regular feature updates</span>
                </li>
              </ul>
            </div>
            <div className='flex justify-center'>
              <Image
                alt='Dashboard Preview'
                className='rounded-lg object-cover'
                height='400'
                src='https://placehold.co/600x400/png'
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
      <section className='w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800'>
        <div className='container px-4 md:px-6 mx-auto'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                Ready to Get Started?
              </h2>
              <p className='mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
                Join thousands of satisfied customers and take your business to
                the next level.
              </p>
            </div>
            <div className='w-full max-w-sm space-y-2'>
              <form className='flex space-x-2'>
                <Input
                  className='max-w-lg flex-1'
                  placeholder='Enter your email'
                  type='email'
                />
                <Button type='submit'>
                  Subscribe
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </form>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                By subscribing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

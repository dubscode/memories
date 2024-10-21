import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import Image from 'next/image';
import drEvil from '@/images/one-hundred-million.jpg';

export default function PricingPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container mx-auto px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                  Choose Your Plan
                </h1>
                <p className='max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Select the perfect plan for your needs. Upgrade or downgrade
                  at any time.
                </p>
              </div>
            </div>
            <div className='mt-8 flex items-center justify-center'>
              <Image
                src={drEvil.src}
                width={400}
                height={300}
                alt='Silly Dr. Evil One Million Dollars Meme Pose'
              />
            </div>
          </div>
        </section>
        <section className='w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32'>
          <div className='container mx-auto px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Frequently Asked Questions
                </h2>
                <p className='max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Find answers to common questions about our pricing and plans.
                </p>
              </div>
            </div>
            <div className='mt-8 grid gap-6 md:grid-cols-2'>
              {[
                {
                  q: 'Can I change plans later?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time.'
                },
                {
                  q: 'Is there a free trial?',
                  a: 'We offer a 14-day free trial for all our plans.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards and PayPal.'
                },
                {
                  q: 'Is there a setup fee?',
                  a: 'No, there are no setup fees for any of our plans.'
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

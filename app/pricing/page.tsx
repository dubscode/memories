import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Basic',
      price: '$9.99',
      description: 'For individuals and small teams',
      features: ['1 user', '10 projects', '5GB storage', 'Basic support'],
    },
    {
      name: 'Pro',
      price: '$29.99',
      description: 'For growing businesses',
      features: [
        '5 users',
        'Unlimited projects',
        '50GB storage',
        'Priority support',
        'Advanced analytics',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Unlimited users',
        'Unlimited projects',
        'Unlimited storage',
        '24/7 dedicated support',
        'Custom integrations',
      ],
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6 mx-auto'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                  Choose Your Plan
                </h1>
                <p className='max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
                  Select the perfect plan for your needs. Upgrade or downgrade
                  at any time.
                </p>
              </div>
            </div>
            <div className='grid md:grid-cols-3 gap-6 mt-8'>
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className='flex flex-col justify-between'
                >
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='text-4xl font-bold mb-4'>{plan.price}</div>
                    <ul className='space-y-2'>
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className='flex items-center'
                        >
                          <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className='w-full'>Choose {plan.name}</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className='w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800'>
          <div className='container px-4 md:px-6 mx-auto'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Frequently Asked Questions
                </h2>
                <p className='max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
                  Find answers to common questions about our pricing and plans.
                </p>
              </div>
            </div>
            <div className='grid gap-6 mt-8 md:grid-cols-2'>
              {[
                {
                  q: 'Can I change plans later?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time.',
                },
                {
                  q: 'Is there a free trial?',
                  a: 'We offer a 14-day free trial for all our plans.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards and PayPal.',
                },
                {
                  q: 'Is there a setup fee?',
                  a: 'No, there are no setup fees for any of our plans.',
                },
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

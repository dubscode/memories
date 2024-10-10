import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';

export default function FeaturesPage() {
  const features = [
    {
      name: 'Automated Workflows',
      description: 'Streamline your processes with our intelligent automation.',
    },
    {
      name: 'Real-time Analytics',
      description: 'Gain insights with our powerful, real-time data analytics.',
    },
    {
      name: 'Secure Cloud Storage',
      description:
        'Keep your data safe and accessible with our secure cloud solution.',
    },
    {
      name: '24/7 Customer Support',
      description:
        'Get help anytime with our round-the-clock customer support.',
    },
  ];

  const plans = [
    { name: 'Basic', features: ['Automated Workflows', 'Real-time Analytics'] },
    {
      name: 'Pro',
      features: [
        'Automated Workflows',
        'Real-time Analytics',
        'Secure Cloud Storage',
      ],
    },
    {
      name: 'Enterprise',
      features: [
        'Automated Workflows',
        'Real-time Analytics',
        'Secure Cloud Storage',
        '24/7 Customer Support',
      ],
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <header className='mb-12 text-center'>
        <h1 className='text-4xl font-bold mb-4'>Our Features</h1>
        <p className='text-xl text-muted-foreground'>
          Discover what makes our product stand out
        </p>
      </header>

      <section className='mb-12'>
        <h2 className='text-2xl font-semibold mb-6'>Key Features</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {features.map((feature) => (
            <Card key={feature.name}>
              <CardHeader>
                <CardTitle>{feature.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className='mb-12'>
        <h2 className='text-2xl font-semibold mb-6'>Feature Comparison</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              {plans.map((plan) => (
                <TableHead key={plan.name}>{plan.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature.name}>
                <TableCell>{feature.name}</TableCell>
                {plans.map((plan) => (
                  <TableCell key={`${plan.name}-${feature.name}`}>
                    {plan.features.includes(feature.name) ? (
                      <CheckCircle className='text-green-500' />
                    ) : (
                      <XCircle className='text-red-500' />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className='text-center'>
        <h2 className='text-2xl font-semibold mb-6'>Ready to Get Started?</h2>
        <p className='mb-4 text-muted-foreground'>
          Join thousands of satisfied customers and take your business to the
          next level.
        </p>
        <Button size='lg'>Start Your Free Trial</Button>
      </section>
    </div>
  );
}

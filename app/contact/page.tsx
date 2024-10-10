import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { appOptions } from '@/config/app-options';

export default function ContactPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6 mx-auto'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                  Contact Us
                </h1>
                <p className='max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
                  We&apos;re here to help. Get in touch with us for any
                  inquiries or support.
                </p>
              </div>
            </div>
            <div className='grid gap-6 mt-8 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll get back to you as
                    soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className='space-y-4'>
                    <div className='space-y-2'>
                      <label htmlFor='name'>Name</label>
                      <Input
                        id='name'
                        placeholder='Your name'
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <label htmlFor='email'>Email</label>
                      <Input
                        id='email'
                        placeholder='Your email'
                        required
                        type='email'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label htmlFor='message'>Message</label>
                      <Textarea
                        id='message'
                        placeholder='Your message'
                        required
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button className='w-full'>Send Message</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    You can also reach us through the following channels.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-center space-x-2'>
                      <Mail className='h-5 w-5' />
                      <span>
                        <a href={`mailto:${appOptions.supportEmail}`}>
                          {appOptions.supportEmail}
                        </a>
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Phone className='h-5 w-5' />
                      <span>{appOptions.supportPhone}</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <MapPin className='h-5 w-5' />
                      <span>{appOptions.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                  Find quick answers to common questions.
                </p>
              </div>
            </div>
            <div className='grid gap-6 mt-8 md:grid-cols-2'>
              {[
                {
                  q: 'What are your business hours?',
                  a: "We're available Monday to Friday, 9 AM to 5 PM PST.",
                },
                {
                  q: 'How long does it take to get a response?',
                  a: 'We aim to respond to all inquiries within 24 hours.',
                },
                {
                  q: 'Do you offer phone support?',
                  a: 'Yes, phone support is available for our Pro and Enterprise customers.',
                },
                {
                  q: 'Can I schedule a demo?',
                  a: 'You can schedule a demo through our website or by contacting our sales team.',
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

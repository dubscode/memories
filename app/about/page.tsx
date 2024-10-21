import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <header className='mb-12 text-center'>
        <h1 className='mb-4 text-4xl font-bold'>About Our Company</h1>
        <p className='text-xl text-muted-foreground'>
          Innovating for a better tomorrow
        </p>
      </header>

      <section className='mb-12'>
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>Driving change through technology</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              At our core, we believe in harnessing the power of technology to
              solve real-world problems. Our team of dedicated professionals
              works tirelessly to develop innovative solutions that make a
              positive impact on people&apos;s lives and businesses around the
              globe.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className='mb-12'>
        <h2 className='mb-6 text-2xl font-semibold'>Our Values</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {['Innovation', 'Integrity', 'Collaboration'].map((value) => (
            <Card key={value}>
              <CardHeader>
                <CardTitle>{value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  We believe in {value.toLowerCase()} as a fundamental principle
                  guiding our work and relationships.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-semibold'>Our Team</h2>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {[
            {
              name: 'John Doe',
              role: 'CEO',
              image: '/placeholder.svg?height=100&width=100',
            },
            {
              name: 'Jane Smith',
              role: 'CTO',
              image: '/placeholder.svg?height=100&width=100',
            },
            {
              name: 'Mike Johnson',
              role: 'Lead Developer',
              image: '/placeholder.svg?height=100&width=100',
            },
            {
              name: 'Sarah Brown',
              role: 'UX Designer',
              image: '/placeholder.svg?height=100&width=100',
            },
          ].map((member) => (
            <Card key={member.name}>
              <CardContent className='pt-6'>
                <div className='flex flex-col items-center'>
                  <Avatar className='mb-4 h-24 w-24'>
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className='text-lg font-semibold'>{member.name}</h3>
                  <p className='text-sm text-muted-foreground'>{member.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

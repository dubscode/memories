import { Calendar, Clock, FileText, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { challenges } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

async function getChallengeDetails(id: string) {
  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, id),
    with: {
      organizer: true,
      events: true,
      stages: true,
      teams: true,
      resources: true,
      tags: {
        with: {
          tag: true
        }
      }
    }
  })

  if (!challenge) {
    notFound()
  }

  return challenge
}

export default async function ChallengePage({ params }: { params: { id: string } }) {
  const challenge = await getChallengeDetails(params.id)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">{challenge.name}</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{challenge.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Start: {format(challenge.startDate, 'PPP')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>End: {format(challenge.endDate, 'PPP')}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>Organizer: {challenge.organizer.firstName}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {challenge.tags.map((tag) => (
                <Badge key={tag.tag.tagId} variant="secondary">{tag.tag.name}</Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/challenges/${challenge.id}/register`}>
                Register Now
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-10 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <CardDescription>Scheduled events for this challenge</CardDescription>
          </CardHeader>
          <CardContent>
            {challenge.events.length > 0 ? (
              <ul className="space-y-2">
                {challenge.events.map((event) => (
                  <li key={event.id} className="flex items-center justify-between">
                    <span>{event.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(event.startDate, 'PPP')}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events scheduled yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stages</CardTitle>
            <CardDescription>Challenge stages and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            {challenge.stages.length > 0 ? (
              <ul className="space-y-2">
                {challenge.stages.map((stage) => (
                  <li key={stage.id} className="flex items-center justify-between">
                    <span>{stage.name}</span>
                    <Badge variant="outline">{stage.durationMinutes} minutes</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No stages defined yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teams</CardTitle>
            <CardDescription>Participating teams</CardDescription>
          </CardHeader>
          <CardContent>
            {challenge.teams.length > 0 ? (
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {challenge.teams.map((team) => (
                  <li key={team.id}>
                    <Badge variant="secondary">{team.name}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No teams registered yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Helpful resources for participants</CardDescription>
          </CardHeader>
          <CardContent>
            {challenge.resources.length > 0 ? (
              <ul className="space-y-2">
                {challenge.resources.map((resource) => (
                  <li key={resource.resourceId}>
                    <a href={resource.url || '#'} className="flex items-center hover:underline" target='_blank'>
                      <FileText className="mr-2 h-4 w-4" />
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No resources available yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, updateUser } from '@/lib/models/users';
import { env } from '@/config/env.mjs';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  // console.log('Webhook body:', JSON.stringify(body, null, 2));

  if (evt.type === 'user.created') {
    console.log('userId:', evt.data.id);

    const preferredEmail = evt.data.email_addresses.find(
      (e) => e.id === evt.data.primary_email_address_id
    )?.email_address;

    if (!preferredEmail) {
      console.log('No preferred email found, cannot save user to database');
      return new Response('', { status: 200 });
    }

    const dbUser = await createUser({
      email: preferredEmail!,
      clerkId: evt.data.id,
      firstName: evt.data.first_name,
      lastName: evt.data.last_name,
      profileImageUrl: evt.data.image_url
    });

    console.log('User saved to database:', dbUser);
  } else if (evt.type === 'user.updated') {
    const preferredEmail = evt.data.email_addresses.find(
      (e) => e.id === evt.data.primary_email_address_id
    )?.email_address;

    if (!preferredEmail) {
      console.log('No preferred email found, cannot save user to database');
      return new Response('', { status: 200 });
    }

    const dbUser = await updateUser({
      email: preferredEmail!,
      clerkId: evt.data.id,
      firstName: evt.data.first_name,
      lastName: evt.data.last_name,
      profileImageUrl: evt.data.image_url
    });

    console.log('User updated to database:', dbUser);
  }

  return new Response('', { status: 200 });
}

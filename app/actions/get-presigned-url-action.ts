'use server';

import { fileStorage, insertFileSchema } from '@/lib/db/schema/file-storage';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { findByClerkId } from '@/lib/models/users';
import { getPresignedUrls } from '@/lib/tigris-storage';
import { z } from 'zod';

const BUCKET_NAME = process.env.BUCKET_NAME;

const inputSchema = z.object({
  challengeId: z.string(),
  teamId: z.string(),
});

export async function getPresignedUrlAction(
  input: z.input<typeof inputSchema>,
) {
  const { userId } = auth();

  const user = await findByClerkId(userId);

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const { challengeId, teamId } = inputSchema.parse(input);

  const fileName = `${teamId}/${challengeId}/${user.id}/screenshot-${Date.now()}.png`;

  const { putUrl, getUrl } = await getPresignedUrls(fileName);

  // add a record to the file_storage table
  const fileData = insertFileSchema.parse({
    challengeId,
    teamId,
    userId: user.id,
    fileName,
    bucketName: BUCKET_NAME,
    fileType: 'image',
  });

  const [file] = await db.insert(fileStorage).values(fileData).returning();

  return { success: true, putUrl, getUrl, fileId: file.fileId, fileName };
}

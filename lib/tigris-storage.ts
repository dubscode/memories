import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://fly.storage.tigris.dev`,
});

const BUCKET_NAME = process.env.BUCKET_NAME;

export async function getPresignedUrls(fileName: string) {
  const putCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    ContentType: 'image/png',
  });

  const getCommand = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  });

  const putUrl = await getSignedUrl(S3, putCommand, { expiresIn: 3600 });
  const getUrl = await getSignedUrl(S3, getCommand, { expiresIn: 3600 });

  return { putUrl, getUrl };
}

export async function uploadImage(
  file: File,
  fileName: string,
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error('BUCKET_NAME is not set');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
  });

  try {
    await S3.send(command);
    return fileName;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function getImageUrl(fileName: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  });

  try {
    const url = await getSignedUrl(S3, command, { expiresIn: 3600 }); // URL expires in 1 hour
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}

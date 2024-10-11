import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { env } from '@/config/env.mjs';

const bedrock = createAmazonBedrock({
  region: 'us-west-2',
  accessKeyId: env.AWS_BEDROCK_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_BEDROCK_SECRET_ACCESS_KEY
});

export const chatModel = bedrock('anthropic.claude-3-5-sonnet-20240620-v1:0');

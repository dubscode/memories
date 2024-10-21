import { createAzure } from '@ai-sdk/azure';

import { env } from '@/config/env.mjs';

export const azure = createAzure({
  resourceName: env.AZURE_RESOURCE_NAME,
  apiKey: env.AZURE_OPENAI_API_KEY,
});

const gpt4o = azure('gpt-4o-2024-08-06');

export const model = gpt4o;

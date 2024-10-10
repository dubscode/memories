import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';
import { env } from '@/config/env.mjs';

// Notice this is only an object, not a full Auth.js instance
export default {
  session: { strategy: 'jwt' },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      // Google requires "offline" access_type to provide a `refresh_token`
      authorization: { params: { access_type: 'offline', prompt: 'consent' } },
    }),
  ],
} satisfies NextAuthConfig;

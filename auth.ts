import NextAuth, { User } from 'next-auth';
import { accounts, users } from '@/lib/db/schema';

import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { JWT } from 'next-auth/jwt';
import authConfig from '@/auth.config';
import { db } from '@/lib/db';
import { env } from '@/config/env.mjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  // You can use this on Vercel to protect preview deployments
  redirectProxyUrl: env.AUTH_REDIRECT_PROXY_URL,
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  providers: [...authConfig.providers],
  callbacks: {
    async jwt({ account, token, user }) {
      if (user && user.id) {
        // Fetch user's teams, roles, and projects
        token = await updateToken(token, user);
      }

      if (account) {
        token.access_token = account.id_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
      } else if (Date.now() < (token.expires_at ?? 0) * 1000) {
        // If the token is still valid, return it
        return token;
      } else {
        // Subsequent logins, if the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new Error('Missing refresh token');

        try {
          // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
          // at their `/.well-known/openid-configuration` endpoint.
          // i.e. https://accounts.google.com/.well-known/openid-configuration
          const response = await fetch('https://oauth2.googleapis.com/token', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID!,
              client_secret: process.env.AUTH_GOOGLE_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token!,
            }),
            method: 'POST',
          });

          const responseTokens = await response.json();

          if (!response.ok) throw responseTokens;

          return {
            // Keep the previous token properties
            ...token,
            access_token: responseTokens.id_token,
            expires_at: Math.floor(
              Date.now() / 1000 + (responseTokens.expires_in as number)
            ),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: responseTokens.refresh_token ?? token.refresh_token,
          };
        } catch (error) {
          console.error('Error refreshing access token', error);
          // The error property can be used client-side to handle the refresh token error
          return { ...token, error: 'RefreshAccessTokenError' as const };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.access_token = token.access_token;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.email) return;
      // TODO - Use this to setup a new Team for the user, or any other "new user" setup tasks.
    },
  },
});

const updateToken = async (token: JWT, user: User) => {
  token.user = user;
  return token;
};

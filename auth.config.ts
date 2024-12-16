// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  secret: process.env.SECRET,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isInAdmin = nextUrl.pathname.startsWith('/admin');
      
      if (isInAdmin) {
        // If trying to access admin pages, require authentication
        return isLoggedIn;
      }

      // All other pages are public
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
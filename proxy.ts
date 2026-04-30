import NextAuth from 'next-auth';
import { authConfig } from 'app/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/guides/upgrading/version-16#middleware-to-proxy
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

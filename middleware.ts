// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';

// const isPublicRoute = createRouteMatcher(['/api/collections', '/sign-in(.*)', '/sign-up(.*)']);
const isPublicRoute = createRouteMatcher(['/(.*)', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware((auth, request: NextRequest) => {
  if(!isPublicRoute(request)) {
    auth().protect();
  }
// }, { debug: true });
});

export const config = {
  // matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  // '/(api|trpc)(.*)',
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
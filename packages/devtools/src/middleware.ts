import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { localePrefix, locales } from "./navigation";
import { AvailableLocales } from "./lib/locales";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: AvailableLocales[0],
  localePrefix: localePrefix,
});

// Helper function to check if user has a session token (Edge Runtime compatible)
function hasSessionToken(req: NextRequest): boolean {
  // Try HTTPS cookie name first (with __Secure- prefix)
  let sessionCookie = req.cookies.get('__Secure-better-auth.session_token');
  
  // Fallback to HTTP cookie name if HTTPS version not found
  if (!sessionCookie) {
    sessionCookie = req.cookies.get('better-auth.session_token');
  }
  
  return !!sessionCookie?.value;
}

export default async function middleware(req: NextRequest) {
  const nextPathname = req.nextUrl.pathname;
  console.log("nextPathname: ", nextPathname);

  // Skip auth for API routes
  if (/^\/(api|trpc|sitemap)/.test(nextPathname)) {
    return NextResponse.next();
  }

  // First, handle internationalization for all routes
  const intlResponse = intlMiddleware(req);

  // For routes that don't require authentication, return the intl response directly
  if (!nextPathname.includes('/submit') && !nextPathname.includes('/dashboard')) {
    return intlResponse;
  }

  // For protected routes, we need to check authentication using cookies
  const hasSession = hasSessionToken(req);

  // Check if user route requires authentication
  if (nextPathname.includes('/submit')) {
    if (!hasSession) {
      const signInUrl = new URL('/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', req.url);
      return Response.redirect(signInUrl);
    }
  }

  // Check if dashboard route requires admin access
  // Note: We can't verify admin status in middleware without calling the database
  // This will be handled at the page level instead
  if (nextPathname.includes('/dashboard')) {
    if (!hasSession) {
      const signInUrl = new URL('/signin', req.url);
      return Response.redirect(signInUrl);
    }
    // Admin verification will be handled at the page level
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

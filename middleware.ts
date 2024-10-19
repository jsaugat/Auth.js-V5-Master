// This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL('/', request.url))
// }
import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { apiAuthPrefix, DEFAULT_LOGIN_REDIRECT, authRoutes, publicRoutes } from "@/routes";
import { NextResponse, NextRequest } from 'next/server'

export const { auth: authMiddleware } = NextAuth(authConfig)

export default authMiddleware((request) => {
  const { nextUrl } = request;
  const isLoggedIn = !!request.auth; // checks if the request have auth object
  console.log("-- Is Logged In (middleware.ts) --> ", isLoggedIn)
  console.log("-- Current Pathname (middleware.ts) --> ", nextUrl.pathname);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Allow API authentication routes to pass through without additional checks
  if (isApiAuthRoute) {
    return NextResponse.next();
  };

  // Handle authentication routes
  if (isAuthRoute) {
    // redirect logged-in users to the default login redirect path
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next(); // Allow access to auth routes for non-logged-in users
  }

  //? Redirect - the unauthorized users to the login page
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/auth/login', nextUrl));
  }

  //? Default behavior: allow the request to proceed
  return NextResponse.next();
}) as any;

export const config = {
  matcher: [
    // Match all paths, except those that start with `_next` (Next.js internals) 
    // or requests for static files (e.g., HTML, CSS, JS, images, fonts, documents, etc.), 
    // unless they are specifically mentioned in the query string.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Always apply middleware to API routes and tRPC routes, including any nested routes.
    '/(api|trpc)(.*)',
  ],
};

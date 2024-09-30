import { auth } from "@/auth"

// This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL('/', request.url))
// }

export default auth((request) => {
  // console.log(request.auth)
  const isLoggedIn = !!request.auth;
  console.log("Is Logged In (middleware.ts)", isLoggedIn)
  console.log("Current Pathname (middleware.ts)", request.nextUrl.pathname);
  // return NextResponse.redirect(new URL('/', request.url))
})

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


/**
 * Full Auth.js instance with a database adapter and session strategy.
 * This file imports the common Auth.js configuration from `auth.config.ts`
 * and adds the PrismaAdapter for connecting to the database, as well as 
 * using JWT for session management.
 * 
 * This setup is used in environments that need database access, such as 
 * traditional cloud or server environments, while keeping edge runtimes
 * lightweight by not including the database adapter in their config.
 * 
 * The PrismaAdapter integrates Prisma to handle session and user data in the database.
 */

import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserById } from "./data/user"

declare module "next-auth" {
  interface User {
    role?: string;
  }
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  debug: true,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  //***** The `callbacks` object allows you to extend the token and session objects. ***** //
  //  By default, the `id` property does not exist on `token` or `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
  callbacks: {
    // documentation link: https://authjs.dev/guides/extending-the-session
    //? extend jwt before session because session depends on jwt
    async jwt({ token }) {
      if (!token.sub) return token; // return if the user is not logged in
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token; // return if the user is not found

      token.role = existingUser.role;
      console.log({ token: token })
      return token //* this modified token will be available in the session callback
    },
    async session({ session, token }) {
      console.log({ sessionToken: token })

      if (session.user && token.sub) {
        session.user.id = token.sub; // create a new property `id` on the session object
      }
      if (session.user && token.role) {
        session.user.role = token.role as string; // create a new property `role` on the session object
      }
      console.log({ session: session })
      return session;
    },
  },
  ...authConfig,
})
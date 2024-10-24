
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

import NextAuth, { type DefaultSession } from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserById } from "./data/user"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { UserRole } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login", // Custom login page.
    error: "/auth/error", //specifies a custom page to handle authentication errors.
  },
  events: {
    //? EVENTS are asynchronous functions that do not return a response. docs: https://next-auth.js.org/configuration/events //
    /**
     * VERIFICATION FOR OAUTH ACCOUNTS: 
     * This automatically marks the user's email as verified when they link a new account, assuming that the linked account (e.g., Google, GitHub) has already verified the user's email.
     * linkAccount triggers when a user connects a new OAuth provider account
     */
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
        // 'emailVerified' stores the date when the email was verified
      })
    }
  },
  //? CALLBACKS are asynchronous functions you can use to control what happens when an action is performed. //
  // The `callbacks` object allows you to extend the token and session objects.
  //  By default, the `id` property does not exist on `token` or `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
  callbacks: {
    //? Use the signIn() callback to control if a user is allowed to sign in.
    async signIn({ user, account }) {
      // "user" parameter represents the user who is currently attempting to log in, while the "account" parameter provides context about the method of authentication being used (e.g., OAuth provider or credentials).
      console.log({ "signIn() callback params": { user, account } })

      //? ALLOW OAUTH PROVIDERS WITHOUT VERIFICATION //
      const isOAuthProvider = account?.provider !== "credentials";
      if (isOAuthProvider) return true;

      //? BLOCK NON VERIFIED USERS //
      const existingUser = await getUserById(user?.id ?? "");
      const isEmailVerified = existingUser?.emailVerified;
      const isVerifiedUser = existingUser && isEmailVerified;
      if (!isVerifiedUser) return false;

      //? HANDLE TWO-FACTOR AUTHENTICATION //
      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        console.log({ twoFactorConfirmation })
        if (!twoFactorConfirmation) return false;
        // delete the 2FA confirmation record 
        await db.twoFactorConfirmation.delete({ where: { id: twoFactorConfirmation.id } });
      }
      return true;
    },
    // documentation link: https://authjs.dev/guides/extending-the-session
    //? extend jwt before session because session depends on jwt
    async jwt({ token }) {
      if (!token.sub) return token; // return if the user is not logged in
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token; // return if the user is not found

      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      console.log({ token: token })
      return token //* this modified token will be available in the session callback
    },
    async session({ session, token }) {
      console.log({ sessionToken: token })

      if (session.user && token.sub) {
        session.user.id = token.sub; // create a new property `id` on the session object
      }
      if (session.user && token.role) {
        session.user.role = token.role as UserRole; // create a new property `role` on the session object
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean; // create a new property `isTwoFactorEnabled` on the session object
      }
      console.log({ session: session })
      return session;
    },
  },
  ...authConfig,
})
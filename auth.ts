
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

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
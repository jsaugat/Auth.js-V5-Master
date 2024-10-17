/**
 * Common configuration for Auth.js without database adapters.
 * This config is used to initialize Auth.js in environments where 
 * database connections are not required, such as edge runtimes.
 * 
 * By separating the database adapter from this config, we can ensure 
 * that NextAuth works in both edge environments (e.g., middleware) 
 * and traditional environments that need full database support.
 * 
 * This object only contains providers (e.g., GitHub) and satisfies the 
 * NextAuthConfig type but does not include a database adapter.
 */

import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "./data/user"
import bcrypt from "bcryptjs"

console.log({ 'Google Client ID': process.env.AUTH_GOOGLE_ID });
console.log({ 'Github Client ID': process.env.AUTH_GITHUB_ID });

export default {
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    Credentials({
      // credentials: {
      //   email: { label: "Email" },
      //   password: { label: "Password", type: "password" },
      // },
      async authorize(credentials) {
        const validationResult = LoginSchema.safeParse(credentials)
        if (validationResult.success) {
          const { email, password } = validationResult.data;

          const user = await getUserByEmail(email);
          // Check if the user exists and has a password set (password doesn't exist for other auth providers)
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        return null; // Return null if user data is invalid
      },
    }),
  ],
} satisfies NextAuthConfig
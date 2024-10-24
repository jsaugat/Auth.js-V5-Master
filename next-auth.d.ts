import { UserRole } from "@prisma/client";
import NextAuth , { type DefaultSession } from "next-auth";

/**
 * ExtendedUser type that extends the default user properties
 * with additional fields specific to our application.
 */
export type ExtendedUser = DefaultSession["user"] & {
  /** The user's role in the application. */
  role: UserRole;
  /** Indicates if two-factor authentication is enabled for the user. */
  isTwoFactorEnabled: boolean;
} 

declare module "next-auth" {
  /**
   * Session interface that extends the default session properties
   * to include the ExtendedUser type.
   */
  interface Session {
    /** The user object containing extended user properties. */
    user: ExtendedUser
  }
}

import { db } from "@/lib/db"

/**
 * Retrieves a password reset token by email address.
 * 
 * @param email - The email address associated with the password reset token.
 * @returns The password reset token if found, or null if not found or an error occurs.
 */
export const getPasswordResetTokenByEmail = async (
  email: string
) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({ where: { email } })
    return passwordResetToken;
  } catch (error) {
    return null;
  }
}

/**
 * Retrieves a password reset token by its token value.
 * 
 * @param token - The token string to search for.
 * @returns The password reset token if found, or null if not found or an error occurs.
 */
export const getPasswordResetTokenByToken = async (
  token: string
) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({ where: { token } })
    return passwordResetToken;
  } catch (error) {
    return null;
  }
}


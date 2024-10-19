"use server"
/**
  * Verifies a user's email by checking the provided verification 'token'.
 */
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token'
import { db } from '@/lib/db'

// This function is called in the auth/verify-email page mount using useEffect.
export const verifyEmail = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: "Missing Token!" }
  }

  const isExpired = new Date(existingToken.expires_at) < new Date();
  if (isExpired) {
    return { error: "Token has expired!" }
  }

  // Find the user and check if their email exists in the database.
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email not found!" }
  }

  //? Update the user's emailVerified field to indicate that the email has been verified
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      //! Update the user's email to the verified email (this case is useful when the user changes their email)
      email: existingToken.email
    }
  })

  /**
  * Deletes the verification token from the database after successful email verification
  * to prevent misuse of the same token after a successful verification.
  */
  await db.verificationToken.delete({ where: { id: existingToken.id } })

  // Return a success message
  return { success: "Email Verified Successfully!" }
}
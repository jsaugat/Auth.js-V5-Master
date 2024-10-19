import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

// Generarte a verification token for a given email address.
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours from now

  // Check if a token already exists for the email.
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  // Create a new verification token if one does not exist.
  const newVerificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires_at
    }
  })
  return newVerificationToken;
} 
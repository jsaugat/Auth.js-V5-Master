"use server";

import bcrypt from 'bcryptjs';
import { NewPasswordSchema } from "@/schemas";
import { z } from "zod";
import { db } from '@/lib/db';
import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';

export const setNewPassword = async (
  credentials: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  // If the token is missing in the arguments of this server action.
  if (!token) {
    return {
      error: "Missing token!",
    };
  }

  // Validation
  const validationResult = NewPasswordSchema.safeParse(credentials);
  if (!validationResult.success) {
    return {
      error: "Invalid password!",
    };
  }

  // Now, get the password from the validated data
  const { password } = validationResult.data;

  // Get the existing password reset token from the database
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return {
      error: "Invalid token!",
    };
  }
  // Check expiry of the token  
  const hasExpired = new Date() > new Date(existingToken.expires_at);
  if (hasExpired) {
    return {
      error: "Token has expired!",
    };
  }

  // 
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email address does not exist!"}
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  // Update the user's password in the database
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: encryptedPassword }
  })

  await db.passwordResetToken.delete({
    where: { id: existingToken.id}
  })

  return {
    success: "Password updated successfully!",
  }
}
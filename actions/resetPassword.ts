"use server"

import { sendPasswordResetEmail } from "@/app/api/send/route";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas"
import { z } from "zod"

export const resetPassword = async (credentials: z.infer<typeof ResetSchema>) => {
  const validationResult = ResetSchema.safeParse(credentials);
  console.log("validationResult", validationResult)
  if (!validationResult.success) {
    return {
      error: "Invalid email",
    }
  }

  const { email } = validationResult.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return {
      error: "Unregistered email address.",
    }
  }

  // Generate a password reset token
  const passwordResetToken = await generatePasswordResetToken(email);

  // Send the password reset email
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token // token will be sent to search param of the resetLink and used to verify the password reset request 
  )

  return {
    success: "Password reset link sent to your email."
  }
}
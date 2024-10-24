"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/app/api/send/route";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (credentials: z.infer<typeof LoginSchema>) => {
  console.log(credentials);

  //? VALIDATION //
  const validationResult = LoginSchema.safeParse(credentials); // returns an object with success and data keys
  if (!validationResult.success) {
    return { error: "Invalid fields!" }
  }

  //? PROCEED WITH THE LOGIN, IF FIELDS ARE VALIDATED SUCCESSFULLY //
  const { email, password, code } = validationResult.data;
  const existingUser = await getUserByEmail(email);

  // Check if user exists
  if (!existingUser) {
    return { error: "Unregistered email address!" }
  }

  // Check if user has a password (not OAuth signup)
  if (!existingUser.password) {
    // If the user has no password, they must have signed up with a OAuth provider
    return { error: "Invalid login method for this email! Please use the OAuth provider you signed up with." }
  }

  //? HANDLE EMAIL VERIFICATION //
  if (!existingUser.emailVerified) {
    const newVerificationToken = await generateVerificationToken(existingUser.email ?? "");
    // Send verification token email -> (recipient email, token)
    await sendVerificationEmail(newVerificationToken.email, newVerificationToken.token)
    return { success: "Confirmation Email Sent!" }
  }

  //? HANDLE TWO-FACTOR AUTHENTICATION //
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    //? CASE: CODE PROVIDED
    if (code) {
      // Retrive the twoFactorToken from db.
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "2FA token not found!" }
      }
      //? Check if the 'code' matches the token
      if (code !== twoFactorToken?.token) {
        return { error: "Invalid 2FA code!" }
      }
      //? Proceed if the 'code' if valid and matches the token
      const hasExpired = new Date() > new Date(twoFactorToken.expires_at);
      if (hasExpired) {
        return { error: "2FA code has expired!" }
      }

      // Delete the 2FA token from the db because user successfully verified the 'code' at this point
      await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });
      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      if (existingConfirmation) {
        // Delete the 2FA confirmation record
        await db.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id } });
      }

      // Create a new 2FA confirmation record
      await db.twoFactorConfirmation.create({ data: { userId: existingUser.id } });
    }
    //? CASE: NO CODE PROVIDED
    else {
      // Generate a 2FA token and send it to the user's email
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      // The 'twoFactor' value can be used to create a state that toggles between the form and the code field to end 2FA code
      return { twoFactor: true }
    }
  }

  //? SIGN IN THE USER //
  try {
    /**
     * Here's the docs link on how the signIn() works : https://authjs.dev/getting-started/session-management/login 
     * signIn() syntax: signIn(provider: string, credentials: any, options?: SignInOptions): Promise<SignInResponse>
    */
    await signIn("credentials", { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT });
    return { success: "Logged in successfully!" }
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "An error occurred!" }
      }
    }
    throw err; // handle unexpected errors
    // Without this line, any error that's not an AuthError would be silently caught and the function would implicitly return undefined. This could lead to confusing behavior where login failures due to unexpected errors might not be properly reported or logged.
  }
}
"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/app/api/send/route";

export const login = async (credentials: z.infer<typeof LoginSchema>) => {
  console.log(credentials);

  //? VALIDATION //
  const validationResult = LoginSchema.safeParse(credentials); // returns an object with success and data keys
  if (!validationResult.success) {
    return { error: "Invalid fields!" }
  }

  //? PROCEED WITH THE LOGIN, IF FIELDS ARE VALIDATED SUCCESSFULLY //
  const { email, password } = validationResult.data;
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

  // Handle unverified email
  if (!existingUser.emailVerified) {
    const newVerificationToken = await generateVerificationToken(existingUser.email ?? "");
    // Send verification token email
    await sendVerificationEmail(newVerificationToken.email, newVerificationToken.token)
    return { success: "Confirmation Email Sent!" }
  }

  /**
   * Here's the docs link on how the signIn() works : https://authjs.dev/getting-started/session-management/login 
   * signIn() syntax: signIn(provider: string, credentials: any, options?: SignInOptions): Promise<SignInResponse>
  */
  try {
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
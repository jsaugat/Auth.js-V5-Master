"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (credentials: z.infer<typeof LoginSchema>) => {
  console.log(credentials);

  //***** VALIDATION *****//
  const validationResult = LoginSchema.safeParse(credentials);
  console.log(validationResult)
  // check if validation failed, return message if the schema is invalid
  if (!validationResult.success) {
    return { error: "Invalid fields!" }
  }

  //**************** IF FIELDS ARE VALIDATED SUCCESSFULLY, PROCEED WITH THE LOGIN ****************//
  // Destructure email and password from the credentials object
  const { email, password } = validationResult.data;
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
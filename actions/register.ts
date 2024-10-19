"use server"

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/app/api/send/route";

export const register = async (credentials: z.infer<typeof RegisterSchema>) => {
  console.log("Register Credentials --> ", credentials)

  //? Validate the credentials against the RegisterSchema using Zod's safeParse method
  const validationDetails = RegisterSchema.safeParse(credentials);
  if (!validationDetails.success) {
    return { error: "Invalid fields!" } // return error is validation fails
  }
  const { name, email, password } = validationDetails.data;
  const passwordHash = await bcrypt.hash(password, 10);

  //? getUserByEmail util from data/user.ts
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already in use!" }
  }

  //? Create a new user in the database
  await db.user.create({
    data: {
      name,
      email,
      password: passwordHash
    }
  })

  // Create a verification token in the database for the new user (using email)
  const newVerificationToken = await generateVerificationToken(email);

  // Send verification token email
  await sendVerificationEmail(newVerificationToken.email, newVerificationToken.token);

  // Return success message if registration passed
  return { success: "Confirmation Email Sent!" }
}

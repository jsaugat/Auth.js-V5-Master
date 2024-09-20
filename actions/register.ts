"use server"

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (credentials: z.infer<typeof RegisterSchema>) => {
  // Log the incoming credentials (for debugging purposes, remove in production)
  console.log(credentials)

  // Validate the credentials against the RegisterSchema using Zod's safeParse method
  const validationDetails = RegisterSchema.safeParse(credentials);

  // Check if the validation failed, return an error message if the schema is invalid
  if (!validationDetails.success) {
    return { error: "Invalid fields!" }
  }

  const { name, email, password } = validationDetails.data;
  const passwordHash = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" }
  }

  await db.user.create({
    data: {
      name,
      email,
      password: passwordHash
    }
  })

  //TODO: send verification token email

  // Return success message if validation passed
  return { success: "User registered successfully!" }
}

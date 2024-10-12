"use server"

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

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

  //TODO: send verification token email

  // Return success message if validation passed
  return { success: "User registered successfully!" }
}

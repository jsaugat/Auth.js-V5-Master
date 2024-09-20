"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";

export const login = async (credentials: z.infer<typeof LoginSchema>) => {
  console.log(credentials);

  const validationResult = LoginSchema.safeParse(credentials);
  console.log(validationResult)
  // check if validation failed, return message if the schema is invalid
  if (!validationResult.success) {
    return { error: "Invalid fields!" }
  }

  // message if the schema is valid
  return { success: 'Logged in successfully!' }
}
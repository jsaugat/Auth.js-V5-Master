import { auth } from "@/auth";

export const getCurrentUser = async () => {
  // Get the current user from the session
  const session = await auth();
  console.log({ userSession: session })
  return session?.user;
}

"use client"

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const handleClick = async (provider: "google" | "github") => {
    // use the signIn function to sign in with a specific provider
    // callbackUrl sets the post-authentication redirect destination for users signing in via social providers.
    await signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  }
  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-2">
      <Button
        size="lg"
        variant="outline"
        onClick={() => handleClick("google")}
        className="w-full text-xl"
      >
        <FcGoogle />
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={() => handleClick("github")}

        className="w-full text-xl"
      >
        <FaGithub />
      </Button >
    </div >
  )
}
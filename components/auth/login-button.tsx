"use client"

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild: boolean;
}

export const LoginButton = ({ children, mode = "redirect", asChild }: LoginButtonProps) => {
  const router = useRouter();
  return (
    <span onClick={() => {
      console.log("LOGIN BUTTON CLICKED!!")
      router.push("/auth/login")
    }}>{children}</span>
  )
}
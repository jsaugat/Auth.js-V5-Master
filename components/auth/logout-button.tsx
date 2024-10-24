"use client"

import { useRouter } from "next/navigation";
import { handleLogout } from "@/actions/logout"; // Import the handleLogout function
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export const LogoutButton = ({ className }: { className: string }) => {
  const router = useRouter();

  const handleClick = async () => {
    console.log("LOGOUT BUTTON CLICKED!!");
    await handleLogout(); // Call the handleLogout function
    router.push("/auth/login"); // Redirect to the login page after logout
  };

  return (
    <div
      onClick={handleClick}
      className={cn("cursor-pointer flex items-center justify-start gap-2 p-0", className)}
    >
      <LogOut className="size-4" />
      Logout
    </div>
  );
};
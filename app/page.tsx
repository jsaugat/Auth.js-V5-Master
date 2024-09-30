import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { GlobeLock } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex items-center gap-3">
        <GlobeLock className="size-12" />
        <h1 className="font-semibold text-6xl">Auth V5</h1>
      </div>
      <p className="text-2xl">Authentication, simplified for efficiency.</p>
      
      <LoginButton asChild>
        <Button variant="secondary">
          Sign in
        </Button>
      </LoginButton>
    </div>
  );
}

"use client"

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export const Social = () => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-2">
      <Button
        size="lg"
        variant="outline"
        onClick={() => console.log("social button clicked")}
        className="w-full text-xl"
      >
        <FcGoogle />
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={() => console.log("social button clicked")}
        className="w-full text-xl"
      >
        <FaGithub />
      </Button >
    </div >
  )
}
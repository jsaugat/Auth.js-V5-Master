"use client"

import React, { use } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useCurrentUser } from '@/hooks/use-current-user'
import { LogoutButton } from './logout-button'

export default function UserAvatarButton() {
  const currentUser = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={currentUser?.image || undefined} alt="@shadcn" />
          <AvatarFallback className='bg-neutral-500 text-white font-medium text-xl'>
            {currentUser?.name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 font-medium">
        <DropdownMenuLabel>{currentUser?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className=''>
          <LogoutButton className='w-full' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client";

import UserAvatarButton from '@/components/auth/user-avatar-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const navItems = [
  { href: "/client", label: "Client" },
  { href: "/server", label: "Server" },
  { href: "/admin", label: "Admin" },
  { href: "/settings", label: "Settings" },
];

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className='bg-secondary text-secondary-foreground p-3 rounded-md w-full md:w-[600px] shadow-sm flex justify-between items-center'>
      <div className="flex gap-x-2">
        {navItems.map(({ href, label }, idx) =>
          <Button
            key={idx}
            variant={pathname === href ? "default" : "outline"}
            className='shadow-md'
            asChild
          >
            <Link href={href}>
              {label}
            </Link>
          </Button>
        )}
      </div>
      <UserAvatarButton />
    </nav>
  )
}

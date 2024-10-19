"use client"

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function VerifyEmail() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  return (
    <div className='flex flex-col items-center gap-4'>
      <p>FYI, your account verification token is : <span className="text-neutral-400">{token}</span></p>
      <Button className="border border-border/10 hover:border-border/50 flex gap-2">
        <Check className='size-4' />
        Confirm email
      </Button>
    </div>
  )
}

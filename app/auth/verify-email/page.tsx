"use client"

import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function VerifyEmail() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  return (
    <div>Verify email {token}</div>
  )
}

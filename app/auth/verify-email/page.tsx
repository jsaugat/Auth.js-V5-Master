"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import VerifyEmailContent from './content'
import { verifyEmail } from '@/actions/verifyEmail'

export default function VerifyEmail() {
  const [success, setSuccess] = useState<string | undefined>("")
  const [error, setError] = useState<string | undefined>("")
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const autoVerifyUser = useCallback(() => {
    if (!token) {
      setError('Missing token!');
      return;
    }
    console.log('Verifying user...', token)
    verifyEmail(token)
      .then(data => {
        setSuccess(data.success)
        setError(data.error)
      })
      .catch(error => {
        console.error('Error verifying user, something went wrong in verifyEmail server action:', error)
        setError('Error verifying user')
      })
  }, [token])

  useEffect(() => {
    autoVerifyUser()
  }, [autoVerifyUser])

  return <VerifyEmailContent token={token} success={success} error={error} />
}
import React from 'react'
import { auth } from '@/auth'

export default function page() {
  const session = auth()
  return (
    <div>{JSON.stringify(session)}</div>
  )
}

import { UserInfo } from '@/components/user-info';
import { getCurrentUser } from '@/lib/user';
import React from 'react'

export default async function ServerPage() {
  const user = await getCurrentUser();
  return (
    <div>
      <UserInfo
        label='Server Component'
        user={user}
      />
    </div>
  )
}

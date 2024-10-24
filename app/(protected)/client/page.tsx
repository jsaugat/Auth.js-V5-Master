import { UserInfo } from '@/components/user-info';
import { useCurrentUser } from '@/hooks/use-current-user';
import React from 'react'

export default function ServerPage() {
  const user = useCurrentUser();
  return (
    <div>
      <UserInfo
        label='Client Component'
        user={user}
      />
    </div>
  )
}

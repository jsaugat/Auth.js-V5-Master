"use client";

import React from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function Page() {
  const currentUserData = useCurrentUser()
  if (!currentUserData) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      {JSON.stringify(currentUserData)}
      {/* Signs out and redirects the user to the login page */}
    </div>
  )
}

import React from 'react'
import { auth, signOut } from '@/auth' //? signOut from auth.ts only works in server components
import { Button } from '@/components/ui/button';

export default function Page() {
  const session = auth();
  return (
    <div>
      {JSON.stringify(session)}
      <form action={async () => {
        "use server"
        await signOut();
      }}>
        {/* Signs out and redirects the user to the login page */}
        <Button type='submit' variant="secondary">
          Sign Out
        </Button>
      </form>
    </div>
  )
}

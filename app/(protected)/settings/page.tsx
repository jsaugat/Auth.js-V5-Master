import React from 'react'
import { auth, signOut } from '@/auth' //? signOut from auth.ts only works in server components
import { Button } from '@/components/ui/button';

export default async function Page() {
  const session = await auth();
  if (!session || !session.user) {
    return <div>Not authenticated</div>;
  }
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

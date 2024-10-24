import { useSession } from 'next-auth/react';

export const useCurrentUser = () => {
  //? useSession() returns a session object as passed to the SessionProvider in app/layout.tsx
  const session = useSession();

  return session.data?.user;
}
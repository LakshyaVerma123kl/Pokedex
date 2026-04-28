"use client";

import { SessionProvider } from "next-auth/react";

// Wraps the app in NextAuth's SessionProvider so client components
// can use useSession() to check login status.
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

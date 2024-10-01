"use client";
import { SessionProvider } from "next-auth/react";

export default function RedirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}

"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Logout() {
  const { data: session, status } = useSession();
  // useEffect(() => {
  //   signOut({ redirect: true, callbackUrl: "/" });
  // }, []);

  return null;
}

"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const { data: session, status }: any = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/cp");
    } else if (status === "authenticated") {
      signOut({ redirect: true, callbackUrl: "/cp" });
      handleLogout(session?.user?.accessToken);
    }
  }, [status]);

  const handleLogout = async (accessToken: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
  };

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">Please Wait ...</div>
      </div>
    );
  }

  return null;
}

"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Redirect() {
  const { data: session, status }: any = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    } else if (status === "authenticated") {
      switch (session.user.role_name) {
        case "ADMINISTRATOR":
          redirect("/console/dashboard/cabang");
      }
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">Please Wait ...</div>
      </div>
    );
  }

  return null;
}

import { authOptions } from "@/libs/AuthOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

type Session = {
  user: UserSession;
};
type UserSession = {
  name: string;
  id: number;
  username: string;
  role_id: number;
  role_name: string;
  accessToken: string;
  refreshToken: string;
};

export default async function Redirect() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  switch (session.user.role_name) {
    case "ADMINISTRATOR":
      redirect("/dashboard/cabang");
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center"> Please Wait ...</div>
    </div>
  );
}

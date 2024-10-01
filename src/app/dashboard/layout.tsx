import FooterAdmin from "@/components/Footer";
import HeaderAdmin from "@/components/Header";
import SidebarAdmin from "@/components/Sidebar";
import { authOptions } from "@/libs/AuthOptions";
import { getServerSession } from "next-auth";

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
  userBranch: UserBranch[];
};

type UserBranch = {
  branch: {
    id: number;
    name: string;
  };
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return (
    <>
      <title> Dashboard - Applenesia</title>
      <div id="layout-wrapper">
        <HeaderAdmin session={session} />
        <SidebarAdmin />
        <div className="main-content">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}

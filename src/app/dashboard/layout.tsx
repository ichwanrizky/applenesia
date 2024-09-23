import FooterAdmin from "@/components/Footer";
import HeaderAdmin from "@/components/Header";
import SidebarAdmin from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <title> Dashboard - Applenesia</title>
      <div id="layout-wrapper">
        <HeaderAdmin />
        <SidebarAdmin />
        <div className="main-content">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}

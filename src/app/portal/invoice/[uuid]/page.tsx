import CpLayout from "@/app/cp/layout";
import DetailInvoicePortal from "@/components/portal/DetailInvoicePortal";

export default async function ServiceDetail({
  params,
}: {
  params: { uuid: string };
}) {
  return (
    <CpLayout>
      <div className="page-content">
        <div className="container-fluid">
          <DetailInvoicePortal uuid={params.uuid} />
        </div>
      </div>
    </CpLayout>
  );
}

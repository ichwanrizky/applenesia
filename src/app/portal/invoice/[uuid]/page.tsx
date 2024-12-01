"use client";
import CpLayout from "@/app/cp/layout";
import DetailInvoicePortal from "@/components/portal/DetailInvoicePortal";
import Script from "next/script";
import { Suspense } from "react";

export default function ServiceDetail({
  params,
}: {
  params: { uuid: string };
}) {
  return (
    <CpLayout>
      <div className="page-content">
        <div className="container-fluid">
          <Suspense fallback={<p>Loading invoice details...</p>}>
            <DetailInvoicePortal uuid={params.uuid} />
          </Suspense>
        </div>
      </div>
    </CpLayout>
  );
}

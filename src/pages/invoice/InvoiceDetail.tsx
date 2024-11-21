"use client";

import CustomAlert from "@/components/CustomAlert";
import invoiceService from "@/services/invoiceService";
import { Fragment, useEffect, useState } from "react";

type Session = {
  name: string;
  id: number;
  username: string;
  role_id: number;
  role_name: string;
  accessToken: string;
  userBranch: any;
};

type InvoiceDetail = {
  id: number;
  uuid: string;
  invoice_number: string;
  year: number;
  month: number;
  created_at: Date;
  created_by: number;
  notes: null;
  amount: number;
  payment_status: string;
  branch_id: number;
  is_deleted: boolean;
  customer_id: number;
  invoice_payment: any[];
  invoice_item: {
    id: number;
    name: string;
    sub_name: string;
    qty: number;
    price: number;
    warranty: number;
    invoice_id: number;
  }[];
  invoice_service: {
    service: {
      id: number;
      service_number: string;
    };
  }[];
  customer: {
    id: number;
    name: string;
    telp: string;
    email: string;
  };
  user_created: {
    id: number;
    name: string;
  };
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const DetailInvoicePage = ({
  session,
  invoice_id,
}: {
  session: Session;
  invoice_id: string;
}) => {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [alertPage, setAlertPage] = useState<AlertProps | null>(null);
  const [invoicData, setInvoiceData] = useState({} as InvoiceDetail);

  useEffect(() => {
    const getDetailInvoice = async () => {
      try {
        const response = await invoiceService.getInvoiceById(
          session.accessToken!,
          invoice_id
        );

        if (!response.status) {
          setAlertPage({
            status: true,
            color: "danger",
            message: response.message,
          });
        } else {
          setInvoiceData(response.data);
        }
      } catch (error) {
        setAlertPage({
          status: true,
          color: "danger",
          message: "Something went wrong, please refresh and try again",
        });
      } finally {
        setIsLoadingPage(false);
      }
    };

    getDetailInvoice();
  }, []);

  if (isLoadingPage) {
    return (
      <div className="text-center">
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        />{" "}
        Loading...
      </div>
    );
  }

  if (alertPage?.status) {
    return <CustomAlert message={alertPage.message} color={alertPage.color} />;
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <div className="clearfix">
              <div className="float-left">{/* IMG LOGO */}</div>
              <div className="float-right">
                <h4>
                  <b>INVOICE</b>
                </h4>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-6">
                <h6 className="font-weight-bold">TO:</h6>
                <address className="line-h-24">
                  <b>{invoicData.customer.name?.toUpperCase()}</b>
                  <br />
                  <abbr title="Phone">P:</abbr> {invoicData.customer.telp}
                  <br />
                  {invoicData.customer.email}
                </address>
              </div>
              {/* end col */}
              <div className="col-6">
                <div className="mt-3 float-right">
                  <table width="100%" border={0}>
                    <tbody>
                      <tr key={0}>
                        <td width="150px">
                          <strong>Invoice Date</strong>
                        </td>
                        <td width="10px" align="center">
                          :
                        </td>
                        <td>
                          {new Date(invoicData.created_at)
                            .toLocaleString("id-ID", {
                              timeZone: "UTC",
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            })
                            .replace(/\./g, ":")}
                        </td>
                      </tr>
                      <tr key={1}>
                        <td>
                          <strong>Payment Status</strong>
                        </td>
                        <td>:</td>
                        <td>
                          {/* : <span className="badge badge--success">Paid</span> */}
                          {invoicData.payment_status}
                        </td>
                      </tr>
                      <tr style={{ verticalAlign: "top" }} key={2}>
                        <td>
                          <strong>Service ID</strong>
                        </td>
                        <td>:</td>
                        <td>
                          {invoicData.invoice_service?.map(
                            (e: any, index: number) => (
                              <Fragment key={index}>
                                #{e.service.service_number}
                                <br />
                              </Fragment>
                            )
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* end col */}
            </div>
            {/* end row */}
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <table className="table table-bordered mt-4" width="100%">
                    <thead>
                      <tr>
                        <th style={{ width: "1%" }}>#</th>
                        <th>Item</th>
                        <th style={{ width: "5%", textAlign: "center" }}>
                          QTY
                        </th>
                        <th style={{ width: "15%", textAlign: "right" }}>
                          Price
                        </th>
                        <th style={{ width: "15%", textAlign: "right" }}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoicData.invoice_item.length === 0 ? (
                        <tr>
                          <td colSpan={5} align="center">
                            Tidak ada item
                          </td>
                        </tr>
                      ) : (
                        invoicData.invoice_item?.map((item, index: number) => (
                          <tr key={index}>
                            <td align="center">{index + 1}</td>
                            <td>{item.name?.toUpperCase()}</td>
                            <td align="center">{item.qty}</td>
                            <td align="right">
                              {`Rp. ${item.price?.toLocaleString("id-ID")}`}
                            </td>
                            <td align="right">
                              {`Rp. ${(item.qty * item.price)?.toLocaleString(
                                "id-ID"
                              )}`}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="clearfix pt-5">
                  <h6 className="text-muted">Notes:</h6>
                  <small>
                    All accounts are to be paid within 7 days from receipt of
                    invoice. To be paid by cheque or credit card or direct
                    payment online. If account is not paid within 7 days the
                    credits details supplied as confirmation of work undertaken
                    will be charged the agreed quoted fee noted above.
                  </small>
                </div>
              </div>
              <div className="col-6">
                <div className="float-right">
                  <p>
                    <b>Sub-total:</b> $4120.00
                  </p>
                  <p>
                    <b>VAT (12.5):</b> $515
                  </p>
                  <h3>$4635.00 USD</h3>
                </div>
                <div className="clearfix" />
              </div>
            </div>
            <div className="d-print-none my-4">
              <div className="text-right">
                <a
                  href="javascript:window.print()"
                  className="btn btn-primary waves-effect waves-light"
                >
                  <i className="fa fa-print m-r-5" /> Print
                </a>
                <a href="#" className="btn btn-info waves-effect waves-light">
                  Submit
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailInvoicePage;

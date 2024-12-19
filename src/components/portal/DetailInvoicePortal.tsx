"use client";
import InvoiceDocument from "@/libs/InvoicePdf";
import invoiceService from "@/services/invoiceService";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Fragment, useEffect, useState } from "react";
import { WarrantyDisplay } from "@/libs/WarrantyDisplay";
import { redirect } from "next/navigation";

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
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
  invoice_payment: {
    id: number;
    invoice_id: number;
    payment_id: number;
    nominal: number;
    created_at: Date;
    created_by: number;
    payment: {
      id: number;
      name: string;
    };
  }[];
  invoice_item: {
    id: number;
    name: string;
    sub_name: string;
    qty: number;
    price: number;
    warranty: number;
    invoice_id: number;
    discount_percent: number;
    discount_price: number;
    product_id: number;
    product: any;
    device: any;
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
  branch: {
    id: number;
    name: string;
    address: string;
    telp: string;
    email: string;
  };
};

const DetailInvoicePortal = ({ uuid }: { uuid: string }) => {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [alertPage, setAlertPage] = useState<AlertProps | null>(null);
  const [invoicData, setInvoiceData] = useState({} as InvoiceDetail);

  useEffect(() => {
    getDetailInvoice();
  }, []);

  const getDetailInvoice = async () => {
    setIsLoadingPage(true);
    try {
      const response = await invoiceService.getInvoiceByUuid(uuid);

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
    redirect("/");
  }

  let subTotal = 0;
  let subTotalDiscount = 0;

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="clearfix">
                <div className="float-left">
                  <PDFDownloadLink
                    document={<InvoiceDocument invoicData={invoicData} />}
                    fileName={`INV-${invoicData.invoice_number}`}
                  >
                    {({ loading }) =>
                      loading ? (
                        <button
                          type="button"
                          className="btn btn-info waves-effect waves-light mr-2"
                          disabled
                        >
                          <span
                            className="spinner-border spinner-border-sm mr-2"
                            role="status"
                            aria-hidden="true"
                          />
                          Loading...
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-info waves-effect waves-light mr-2"
                        >
                          <i className="fa fa-print m-r-5" /> Print
                        </button>
                      )
                    }
                  </PDFDownloadLink>
                </div>
                <div className="float-right">
                  <h4>
                    <b>INVOICE #{invoicData.invoice_number}</b>
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
                        <tr style={{ verticalAlign: "top" }}>
                          <td width="150px">
                            <strong>Service ID</strong>
                          </td>
                          <td width="10px" align="center">
                            :
                          </td>
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
                        <tr>
                          <td>
                            <strong>Invoice Date</strong>
                          </td>
                          <td align="center">:</td>
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
                        <tr>
                          <td>
                            <strong>Payment Status</strong>
                          </td>
                          <td align="center">:</td>
                          <td>
                            {invoicData.payment_status === "UNPAID" && (
                              <span className="badge badge-soft-danger">
                                UNPAID
                              </span>
                            )}
                            {invoicData.payment_status === "PARTIAL" && (
                              <span className="badge badge-soft-warning">
                                PARTIAL
                              </span>
                            )}
                            {invoicData.payment_status === "PAID" && (
                              <span className="badge badge-soft-success">
                                PAID
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Payment Amount</strong>
                          </td>
                          <td align="center">:</td>
                          <td>
                            {`Rp. ${invoicData.amount.toLocaleString("id-ID")}`}
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
                  <div className="table-responsive mt-4">
                    <table className="table table-bordered" width="100%">
                      <thead>
                        <tr>
                          <th style={{ width: "1%" }}>#</th>
                          <th>Item</th>
                          <th style={{ width: "8%", textAlign: "center" }}>
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
                            <td colSpan={8} align="center">
                              Tidak ada item
                            </td>
                          </tr>
                        ) : (
                          invoicData.invoice_item?.map(
                            (item, index: number) => {
                              const totalPrice = item.price * item.qty;
                              const totalDiscountPrice =
                                item.price *
                                  item.qty *
                                  (1 - item.discount_percent / 100) -
                                item.discount_price;

                              subTotal += totalPrice;
                              subTotalDiscount +=
                                totalPrice - totalDiscountPrice;

                              return (
                                <tr key={index}>
                                  <td className="align-middle text-center">
                                    {index + 1}
                                  </td>
                                  <td className="align-middle">
                                    {item.name?.toUpperCase()}
                                    {item.warranty > 0 && (
                                      <>
                                        <br />
                                        <small className="font-italic">
                                          * Garansi{" "}
                                          {WarrantyDisplay(item.warranty)}
                                        </small>
                                      </>
                                    )}
                                    <br />
                                  </td>
                                  <td className="align-middle text-center">
                                    {item.qty}
                                  </td>
                                  <td className="align-middle text-right">
                                    {`Rp. ${item.price?.toLocaleString(
                                      "id-ID"
                                    )}`}
                                  </td>
                                  <td className="align-middle text-right">
                                    {`Rp. ${totalPrice.toLocaleString(
                                      "id-ID"
                                    )}`}
                                  </td>
                                </tr>
                              );
                            }
                          )
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
                      credits details supplied as confirmation of work
                      undertaken will be charged the agreed quoted fee noted
                      above.
                    </small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="float-right">
                    <table width="100%" border={0}>
                      <tbody>
                        <tr>
                          <td width="100px">
                            <b>Sub-total</b>
                          </td>
                          <td width="10%">:</td>
                          <td
                            align="right"
                            style={{ whiteSpace: "nowrap" }}
                          >{`Rp. ${subTotal.toLocaleString("id-ID")}`}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Discount</b>
                          </td>
                          <td>:</td>
                          <td
                            align="right"
                            style={{ whiteSpace: "nowrap" }}
                          >{`- Rp. ${subTotalDiscount.toLocaleString(
                            "id-ID"
                          )}`}</td>
                        </tr>
                      </tbody>
                    </table>
                    <hr />
                    <h3 className="text-right">
                      {`Rp. ${(subTotal - subTotalDiscount).toLocaleString(
                        "id-ID"
                      )}`}
                    </h3>
                  </div>
                  <div className="clearfix" />
                </div>
              </div>

              {invoicData.invoice_payment.length > 0 && (
                <>
                  <hr />
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-responsive ">
                        <table className="table table-bordered" width="100%">
                          <thead>
                            <tr>
                              <th style={{ width: "1%" }}>#</th>
                              <th style={{ width: "30%" }}>Payment Date</th>
                              <th style={{ width: "30%" }}>Payment Method</th>
                              <th style={{ width: "30%" }}>Payment Nominal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoicData.invoice_payment?.map(
                              (item, index: number) => (
                                <tr key={index}>
                                  <td align="center">{index + 1}</td>
                                  <td align="center">
                                    {new Date(item.created_at)
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
                                  <td align="center">
                                    {item.payment.name?.toUpperCase()}
                                  </td>
                                  <td align="center">
                                    {`Rp. ${item.nominal.toLocaleString(
                                      "id-ID"
                                    )}`}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailInvoicePortal;

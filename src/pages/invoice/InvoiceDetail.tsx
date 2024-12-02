"use client";

import CustomAlert from "@/components/CustomAlert";
import invoiceService from "@/services/invoiceService";
import { Fragment, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import ServiceProductList from "../service/ServiceProductList";
import libServices from "@/services/libServices";
import InvoicePaymentUpdate from "./InvoicePaymentUpdate";
import { WarrantyDisplay } from "@/libs/WarrantyDisplay";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceDocument from "@/libs/InvoicePdf";
import sendWhatsappMessage from "@/libs/WhatsappService";

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
  };
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

type DeviceType = {
  id: number;
  name: string;
};

type PaymentMethod = {
  id: number;
  name: string;
};

const DetailInvoicePage = ({
  session,
  invoice_id,
  deviceTypeData,
}: {
  session: Session;
  invoice_id: string;
  deviceTypeData: DeviceType[];
}) => {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLoadingSubmit, setIsloadingSubmit] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isUpdatePaymentOpen, setIsUpdatePaymentOpen] = useState(false);
  const [alertPage, setAlertPage] = useState<AlertProps | null>(null);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [invoicData, setInvoiceData] = useState({} as InvoiceDetail);
  const [paymentMethodData, setPaymentMethodData] = useState(
    [] as PaymentMethod[]
  );

  useEffect(() => {
    const getPaymentMethod = async () => {
      try {
        const response = await libServices.getPaymentMethod(
          session.accessToken!,
          "all"
        );

        if (!response.status) {
          setAlertPage({
            status: true,
            color: "danger",
            message: response.message,
          });
        } else {
          setPaymentMethodData(response.data);
        }
      } catch (error) {
        setAlertPage({
          status: true,
          color: "danger",
          message: "Something went wrong, please refresh and try again",
        });
      }
    };

    getDetailInvoice();
    getPaymentMethod();
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null); // Set alert back to null after 2 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [alert]);

  const getDetailInvoice = async () => {
    setIsLoadingPage(true);
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

  const handleRemoveSelectedProduct = (id: number) => {
    setInvoiceData({
      ...invoicData,
      invoice_item: invoicData.invoice_item.filter(
        (_: any, index: number) => index !== id
      ),
    });
  };

  const handleUpdateQtySelectedProduct = (id: number, qty: number) => {
    setInvoiceData({
      ...invoicData,
      invoice_item: invoicData.invoice_item.map((item: any, index: number) => {
        if (index === id) {
          return {
            ...item,
            qty: qty,
          };
        }
        return item;
      }),
    });
  };

  const closeProductList = (selectedProduct: any) => {
    setIsProductOpen(false);
    setInvoiceData({
      ...invoicData,
      invoice_item: [
        ...invoicData.invoice_item,
        ...selectedProduct.flatMap((e: any) => ({
          id: new Date().getTime(),
          name: e.name,
          sub_name: e.sub_name,
          qty: e.qty,
          price: e.price,
          warranty: e.price,
          invoice_id: invoicData.id,
          discount_percent: 0,
          discount_price: 0,
          product_id: e.product_id,
        })),
      ],
    });
  };

  const handleDiscount = (discountType: string, id: number, value: number) => {
    setInvoiceData({
      ...invoicData,
      invoice_item: invoicData.invoice_item.map((item: any, index: number) => {
        if (index === id) {
          return {
            ...item,
            ...(discountType === "%"
              ? { discount_percent: value }
              : { discount_price: value }),
          };
        }
        return item;
      }),
    });
  };

  const handleSubmit = async () => {
    if (confirm("Update this data?")) {
      setIsloadingSubmit(true);
      try {
        const resultUpdate = await invoiceService.updateInvoice(
          session?.accessToken,
          invoicData.invoice_number,
          JSON.stringify({
            branch: invoicData.branch_id,
            invoice_item: invoicData.invoice_item,
          })
        );

        if (!resultUpdate.status) {
          setAlert({
            status: true,
            color: "danger",
            message: resultUpdate.message,
          });
          return;
        }
        setAlert({
          status: true,
          color: "success",
          message: resultUpdate.message,
        });

        getDetailInvoice();
      } catch (error) {
        setAlert({
          status: true,
          color: "danger",
          message: "something went wrong, please refresh and try again",
        });
      } finally {
        setIsloadingSubmit(false);
      }
    }
  };

  const sendMessage = async () => {
    try {
      const response = await sendWa();
      if (response) {
        setAlert({
          status: true,
          color: "success",
          message: "Pesan berhasil dikirim",
        });
      } else {
        setAlert({
          status: true,
          color: "danger",
          message: "Pesan gagal dikirim",
        });
      }
    } catch (error) {
      setAlert({
        status: true,
        color: "danger",
        message: "something went wrong, please refresh and try again",
      });
    }
  };

  const sendWa = async () => {
    let totalPaymentLeft = 0;
    invoicData.invoice_item.forEach((item: any) => {
      const totalPrice = item.price * item.qty;
      const totalDiscountPrice = totalPrice * (item.discount_percent / 100);
      totalPaymentLeft +=
        totalPrice - totalDiscountPrice - -item.discount_price;
    });

    const phoneNumber = invoicData.customer.telp;
    const message =
      `*Notifikasi | Applenesia* \n\n` +
      `Halo, *${invoicData.customer.name?.toUpperCase()}*,\n\n` +
      `Kami ingin menginformasikan bahwa invoice Anda telah diterbitkan dengan detail sebagai berikut:\n\n` +
      `💳 *Total Tagihan*: *Rp. ${totalPaymentLeft.toLocaleString(
        "id-ID"
      )}*\n` +
      `📅 *Status Pembayaran*: *${invoicData.payment_status}*\n\n` +
      `Untuk melihat detail invoice Anda, silakan klik tautan di bawah ini:\n` +
      `🔗 *${process.env.INVOICE_URL}/${invoicData.invoice_number}*\n\n` +
      `Mohon segera melakukan pembayaran sebelum tanggal jatuh tempo. Jika Anda sudah melakukan pembayaran, abaikan pesan ini.\n\n` +
      `Terima kasih atas kepercayaan Anda kepada kami.\n\n` +
      `Salam,\n` +
      `Applenesia Team\n\n`;

    const response = await sendWhatsappMessage(phoneNumber, message);
    return response;
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
    return <CustomAlert message={alertPage.message} color={alertPage.color} />;
  }

  let subTotal = 0;
  let subTotalDiscount = 0;

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            {alert?.status && (
              <div className="card-header">
                <CustomAlert message={alert.message} color={alert.color} />
              </div>
            )}
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
                  <button
                    type="button"
                    className="btn btn-info waves-effect waves-light"
                    onClick={() => sendMessage()}
                  >
                    <i className="fa fa-envelope m-r-5" /> Send Email/WA
                  </button>
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
                    {invoicData.payment_status !== "PAID" && (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm mb-2"
                        onClick={() => {
                          setIsProductOpen(true);
                        }}
                      >
                        Tambah Produk
                      </button>
                    )}

                    <table className="table table-bordered" width="100%">
                      <thead>
                        <tr>
                          <th style={{ width: "1%", textAlign: "center" }}></th>
                          <th style={{ width: "1%" }}>#</th>
                          <th>Item</th>
                          <th style={{ width: "8%", textAlign: "center" }}>
                            Disc (%)
                          </th>
                          <th style={{ width: "8%", textAlign: "center" }}>
                            Disc (Rp)
                          </th>
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
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() =>
                                        handleRemoveSelectedProduct(index)
                                      }
                                      disabled={
                                        invoicData.payment_status === "PAID"
                                      }
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </td>
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
                                  <td className="align-middle">
                                    <NumericFormat
                                      className="form-control form-control-sm text-center"
                                      value={item.discount_percent || 0}
                                      thousandSeparator=","
                                      displayType="input"
                                      onValueChange={(values: any) => {
                                        if (
                                          values.floatValue !== undefined &&
                                          values.floatValue >= 0 &&
                                          values.floatValue <= 100
                                        ) {
                                          handleDiscount(
                                            "%",
                                            index,
                                            values.floatValue
                                          );
                                        }
                                      }}
                                      allowLeadingZeros={false}
                                      allowNegative={false}
                                      required
                                      isAllowed={(values) =>
                                        values.floatValue === undefined ||
                                        (values.floatValue <= 100 &&
                                          values.floatValue >= 0)
                                      }
                                      disabled={
                                        invoicData.payment_status === "PAID"
                                      }
                                    />
                                  </td>
                                  <td className="align-middle">
                                    <NumericFormat
                                      className="form-control form-control-sm text-center"
                                      value={item.discount_price || 0}
                                      thousandSeparator=","
                                      displayType="input"
                                      onValueChange={(values: any) => {
                                        if (
                                          values.floatValue !== undefined &&
                                          values.floatValue >= 0 &&
                                          values.floatValue <= item.price
                                        ) {
                                          handleDiscount(
                                            "rp",
                                            index,
                                            values.floatValue
                                          );
                                        }
                                      }}
                                      allowLeadingZeros={false}
                                      allowNegative={false}
                                      required
                                      isAllowed={(values) =>
                                        values.floatValue === undefined ||
                                        (values.floatValue <= item.price &&
                                          values.floatValue >= 0)
                                      }
                                      disabled={
                                        invoicData.payment_status === "PAID"
                                      }
                                    />
                                  </td>
                                  <td className="align-middle">
                                    {
                                      <NumericFormat
                                        className="form-control form-control-sm text-center"
                                        value={item.qty}
                                        thousandSeparator=","
                                        displayType="input"
                                        onValueChange={(values: any) => {
                                          if (
                                            values.floatValue !== undefined &&
                                            values.floatValue > 0
                                          ) {
                                            handleUpdateQtySelectedProduct(
                                              index,
                                              values.floatValue
                                            );
                                          }
                                        }}
                                        allowLeadingZeros={false}
                                        allowNegative={false}
                                        required
                                        isAllowed={(values) =>
                                          values.floatValue === undefined ||
                                          values.floatValue > 0
                                        }
                                        disabled={
                                          invoicData.payment_status === "PAID"
                                        }
                                      />
                                    }
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
              {invoicData.payment_status !== "PAID" && (
                <div className="d-print-none my-4">
                  <div className="text-right">
                    <button
                      type="button"
                      className="btn btn-success mr-2"
                      onClick={() => setIsUpdatePaymentOpen(true)}
                    >
                      Update Payment
                    </button>

                    {isLoadingSubmit ? (
                      <button
                        type="button"
                        className="btn btn-primary"
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
                        className="btn btn-primary"
                        onClick={handleSubmit}
                      >
                        Save Changes
                      </button>
                    )}
                  </div>
                </div>
              )}

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

      {isProductOpen && (
        <ServiceProductList
          isOpen={isProductOpen}
          onClose={closeProductList}
          accessToken={session.accessToken!}
          branch={invoicData.branch_id?.toString() || ""}
          productList={[]}
          deviceTypeData={deviceTypeData}
        />
      )}

      {isUpdatePaymentOpen && (
        <InvoicePaymentUpdate
          isOpen={isUpdatePaymentOpen}
          onClose={() => {
            setIsUpdatePaymentOpen(false);
            getDetailInvoice();
          }}
          accessToken={session.accessToken!}
          paymentMethodData={paymentMethodData}
          invoiceNumber={invoicData.invoice_number}
          invoiceAmount={subTotal - subTotalDiscount}
          invoicePayment={invoicData.amount}
        />
      )}
    </>
  );
};

export default DetailInvoicePage;

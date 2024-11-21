"use client";

import CustomAlert from "@/components/CustomAlert";
import invoiceService from "@/services/invoiceService";
import { Fragment, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import ServiceProductList from "../service/ServiceProductList";

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
  const [isProductOpen, setIsProductOpen] = useState(false);
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
                <div className="table-responsive mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm mb-2"
                    onClick={() => {
                      setIsProductOpen(true);
                    }}
                  >
                    Tambah Produk
                  </button>

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
                          <td colSpan={6} align="center">
                            Tidak ada item
                          </td>
                        </tr>
                      ) : (
                        invoicData.invoice_item?.map((item, index: number) => {
                          const totalPrice = item.price * item.qty;
                          const totalDiscountPrice =
                            item.price *
                              item.qty *
                              (1 - item.discount_percent / 100) -
                            item.discount_price;

                          subTotal += totalPrice;
                          subTotalDiscount += totalPrice - totalDiscountPrice;

                          return (
                            <tr key={index}>
                              <td className="align-middle text-center">
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    handleRemoveSelectedProduct(index)
                                  }
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </td>
                              <td align="center">{index + 1}</td>
                              <td>{item.name?.toUpperCase()}</td>
                              <td>
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
                                />
                              </td>
                              <td>
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
                                />
                              </td>
                              <td align="center">
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
                                    // disabled={
                                    //   formData.invoice_number !== ""
                                    //     ? true
                                    //     : false
                                    // }
                                  />
                                }
                              </td>
                              <td align="right">
                                {`Rp. ${item.price?.toLocaleString("id-ID")}`}
                              </td>
                              <td align="right">
                                {`Rp. ${totalPrice.toLocaleString("id-ID")}`}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>

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
            <div className="d-print-none my-4">
              <div className="text-right">
                <a
                  href="#"
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

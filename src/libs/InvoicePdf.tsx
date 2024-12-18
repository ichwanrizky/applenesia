"use client";

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { WarrantyDisplay } from "@/libs/WarrantyDisplay";

Font.register({
  family: "OpenSans",
  fonts: [
    { src: "/fonts/OpenSans-Regular.ttf", fontWeight: "normal" },
    {
      src: "/fonts/OpenSans-SemiBold.ttf",
      fontWeight: "semibold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    flexDirection: "column",
    backgroundColor: "#FFF",
    fontFamily: "OpenSans",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftHeader: {
    width: "50%",
  },
  rightHeader: {
    width: "50%",
    textAlign: "right",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailRow: {
    fontSize: 10,
    marginBottom: 2,
  },
  table: {
    width: "100%",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "solid",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableCell: {
    fontSize: 10,
    flex: 1,
    padding: 5,
    borderWidth: 1, // Border untuk setiap cell
    borderColor: "#ccc",
    borderStyle: "solid",
  },
  totalSection: {
    marginTop: 2,
    fontSize: 12,
    textAlign: "right", // Rata kanan
    color: "#333",
    lineHeight: 1.5,
    paddingRight: 20,
  },
  notes: {
    fontSize: 10,
    marginTop: 20,
    textAlign: "left",
  },
  companyDetails: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  logoContainer: {
    width: 80,
    height: 60,
    marginRight: 10,
  },
  companyInfo: {
    fontSize: 10,
    color: "#555",
    lineHeight: 1.5,
  },
  rightHeaderTable: {
    borderColor: "#ccc",
    width: "30%",
    alignSelf: "flex-end",
  },
  tableCellHeader: {
    fontWeight: "bold",
    flex: 1,
    padding: 1,
    fontSize: 10,
    textAlign: "left",
  },
  tableRowHeader: {
    flexDirection: "row",
  },
});

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

const InvoiceDocument = ({ invoicData }: { invoicData: InvoiceDetail }) => {
  let subTotal = 0;
  let subTotalDiscount = 0;
  const MyDocument = () => (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header Section */}
        <View style={[styles.header, { marginBottom: 20 }]}>
          <View style={styles.leftHeader}>
            <View style={styles.companyDetails}>
              <Image src="/img/logoapn.png" style={styles.logoContainer} />
              <View>
                <Text style={styles.companyInfo}>APPLENESIA</Text>
                <Text
                  style={styles.companyInfo}
                >{`${invoicData.branch.name?.toUpperCase()} - ${invoicData.branch.address?.toUpperCase()}`}</Text>
                <Text
                  style={styles.companyInfo}
                >{`Phone: ${invoicData.branch.telp}`}</Text>
                <Text style={styles.companyInfo}>
                  Email: {invoicData.branch.email}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.rightHeader}>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
              {`INVOICE: # ${invoicData.invoice_number}`}
            </Text>
          </View>
        </View>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <Text style={styles.detailRow}>
              To: {invoicData.customer.name?.toUpperCase()}
            </Text>
            <Text
              style={styles.detailRow}
            >{`Phone: ${invoicData.customer.telp}`}</Text>
            <Text
              style={styles.detailRow}
            >{`Email: ${invoicData.customer.email}`}</Text>
          </View>
          <View style={styles.rightHeaderTable}>
            <View style={styles.tableRowHeader}>
              <Text style={styles.tableCellHeader}>Service ID</Text>
              <Text style={styles.tableCellHeader}>
                :{" "}
                {invoicData.invoice_service?.map((e: any, index: number) => (
                  <Text key={index}>
                    {index > 0 ? "\n  " : ""}#{e.service.service_number}
                  </Text>
                ))}
              </Text>
            </View>
            <View style={styles.tableRowHeader}>
              <Text style={styles.tableCellHeader}>Invoice Date</Text>
              <Text style={styles.tableCellHeader}>
                :{" "}
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
              </Text>
            </View>
            <View style={[styles.tableRowHeader]}>
              <Text style={styles.tableCellHeader}>Payment Status</Text>
              <Text style={styles.tableCellHeader}>
                :{" "}
                <Text
                  style={[
                    {
                      color:
                        invoicData.payment_status === "UNPAID"
                          ? "red"
                          : invoicData.payment_status === "PARTIAL"
                          ? "orange"
                          : "green",
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {invoicData.payment_status}
                </Text>
              </Text>
            </View>
            <View style={styles.tableRowHeader}>
              <Text style={styles.tableCellHeader}>Payment Amount</Text>
              <Text style={styles.tableCellHeader}>
                {`: Rp. ${invoicData.amount.toLocaleString("id-ID")}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Table Section */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text
              style={[styles.tableCell, { flex: 0.1, textAlign: "center" }]}
            >
              #
            </Text>
            <Text style={[styles.tableCell, { flex: 2, textAlign: "center" }]}>
              ITEM
            </Text>
            <Text
              style={[styles.tableCell, { flex: 0.5, textAlign: "center" }]}
            >
              QTY
            </Text>
            <Text style={[styles.tableCell, { textAlign: "center" }]}>
              PRICE
            </Text>
            <Text style={[styles.tableCell, { textAlign: "center" }]}>
              TOTAL
            </Text>
          </View>
          {invoicData.invoice_item?.map((item, index: number) => {
            const totalPrice = item.price * item.qty;
            const totalDiscountPrice =
              item.price * item.qty * (1 - item.discount_percent / 100) -
              item.discount_price;

            subTotal += totalPrice;
            subTotalDiscount += totalPrice - totalDiscountPrice;

            return (
              <View key={index} style={styles.tableRow}>
                <Text
                  style={[styles.tableCell, { textAlign: "center", flex: 0.1 }]}
                >
                  {index + 1}
                </Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>
                  {`${item.name?.toUpperCase()} \n`}

                  <Text style={[{ fontSize: 7 }]}>
                    {item.product.product_device
                      ?.map((e: any) => e.device.name?.toUpperCase())
                      .join(", ")}
                  </Text>

                  {item.warranty > 0 && (
                    <Text style={{ fontSize: 7 }}>
                      {`\n\n* Garansi ${WarrantyDisplay(item.warranty)}`}
                    </Text>
                  )}
                </Text>
                <Text
                  style={[styles.tableCell, { textAlign: "center", flex: 0.5 }]}
                >
                  {item.qty}
                </Text>
                <Text style={[styles.tableCell, { textAlign: "right" }]}>
                  {`Rp. ${item.price.toLocaleString("id-ID")}`}
                </Text>
                <Text style={[styles.tableCell, { textAlign: "right" }]}>
                  {`Rp. ${(item.price * item.qty).toLocaleString("id-ID")}`}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={[styles.header, { marginTop: 0 }]}>
          <View style={styles.leftHeader}>
            <Text style={styles.notes}>
              Notes: All accounts are to be paid within 7 days from receipt of
              invoice. Failure to pay may result in additional charges.
            </Text>
          </View>
          <View style={[styles.rightHeaderTable]}>
            <View style={styles.tableRowHeader}>
              <Text style={styles.tableCellHeader}>Sub Total</Text>
              <Text style={[styles.tableCellHeader, { flex: 0.1 }]}>:</Text>
              <Text style={[styles.tableCellHeader, { textAlign: "right" }]}>
                {`Rp. ${subTotal.toLocaleString("id-ID")}`}
              </Text>
            </View>
            <View style={[styles.tableRowHeader, { paddingBottom: 5 }]}>
              <Text style={styles.tableCellHeader}>Discount</Text>
              <Text style={[styles.tableCellHeader, { flex: 0.1 }]}>:</Text>
              <Text style={[styles.tableCellHeader, { textAlign: "right" }]}>
                {`- Rp. ${subTotalDiscount.toLocaleString("id-ID")}`}
              </Text>
            </View>
            <View
              style={[
                styles.tableRowHeader,
                { borderTopWidth: 1, paddingTop: 5 },
              ]}
            >
              <Text style={[styles.tableCellHeader, { fontSize: 14 }]}>
                Total
              </Text>
              <Text
                style={[
                  styles.tableCellHeader,
                  { textAlign: "right", fontSize: 14 },
                ]}
              >
                {`Rp. ${(subTotal - subTotalDiscount).toLocaleString("id-ID")}`}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  return <MyDocument />;
};

export default InvoiceDocument;

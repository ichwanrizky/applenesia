"use client";
import Modal from "@/components/Modal";
import { useState } from "react";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import productPurchaseServices from "@/services/productPurchaseServices";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  branch: number;
  productData: ProductInventory[];
  paymentData: PaymentMethod[];
};

type ProductInventory = {
  id: number;
  name: string;
  sub_name: string;
  stock: number;
};

type PaymentMethod = {
  id: number;
  name: string;
};
type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const CreateProductPurchase = (props: Props) => {
  const { isOpen, onClose, accessToken, branch, productData, paymentData } =
    props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [product, setProduct] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [payment, setPayment] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const data = {
          product_id: Number(product),
          qty: Number(qty),
          price: Number(price),
          payment_id: Number(payment),
          branch: Number(branch),
        };

        const result = await productPurchaseServices.createProductPurchase(
          accessToken,
          data
        );

        if (!result.status) {
          setAlert({
            status: true,
            color: "danger",
            message: result.message,
          });
          setIsLoading(false);
        } else {
          setAlert({
            status: true,
            color: "success",
            message: result.message,
          });
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } catch (error) {
        setAlert({
          status: true,
          color: "danger",
          message: "Something went wrong, please refresh and try again",
        });
        setIsLoading(false);
      }
    }
  };

  const optionsProduct = productData?.map((e) => ({
    value: e.id,
    label: `${e.name?.toUpperCase()}${
      e.sub_name && ` - ${e.sub_name?.toUpperCase()}`
    }`,
  }));

  const optionsPayment = paymentData?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  return (
    isOpen && (
      <Modal
        modalTitle="Tambah Data"
        onClose={onClose}
        onSubmit={handleSubmit}
        alert={alert}
        isLoading={isLoading}
      >
        <div className="form-group">
          <label htmlFor="product">Produk</label>
          <Select
            placeholder="Pilih Product"
            isClearable
            options={optionsProduct}
            required
            onChange={(e: any) => setProduct(e ? e.value : "")}
            value={
              product
                ? optionsProduct.find((option: any) => option.value === product)
                : null
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="qty">QTY Pembelian</label>
          <NumericFormat
            className="form-control"
            defaultValue={qty}
            thousandSeparator=","
            displayType="input"
            onValueChange={(values: any) => {
              setQty(values.floatValue);
            }}
            allowLeadingZeros={false}
            allowNegative={false}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Total Harga</label>
          <NumericFormat
            className="form-control"
            defaultValue={price}
            thousandSeparator=","
            displayType="input"
            onValueChange={(values: any) => {
              setPrice(values.floatValue);
            }}
            allowLeadingZeros={false}
            allowNegative={false}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="payment">Jenis Payment</label>
          <Select
            placeholder="Pilih Payment"
            isClearable
            options={optionsPayment}
            required
            onChange={(e: any) => setPayment(e ? e.value : "")}
            value={
              payment
                ? optionsPayment.find((option: any) => option.value === payment)
                : null
            }
          />
        </div>
      </Modal>
    )
  );
};

export default CreateProductPurchase;

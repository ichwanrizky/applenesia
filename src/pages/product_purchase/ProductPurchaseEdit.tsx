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
  paymentData: PaymentMethod[];
  editData: ProductPurchase;
};

type ProductPurchase = {
  number: number;
  id: number;
  product_id: number;
  qty: number;
  price: number;
  created_at: Date;
  created_by: number;
  payment_id: number;
  product: {
    id: number;
    name: string;
    sub_name: string;
    branch_id: number;
  };
  payment: {
    id: number;
    name: string;
  };
  user_created: {
    id: number;
    name: string;
  };
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

const EditProductPurchase = (props: Props) => {
  const { isOpen, onClose, accessToken, paymentData, editData } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [qty, setQty] = useState(editData.qty || "");
  const [price, setPrice] = useState(editData.price || "");
  const [payment, setPayment] = useState(editData.payment_id || "");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Edit this data?")) {
      setIsLoading(true);
      try {
        const data = {
          qty: Number(qty),
          price: Number(price),
          payment_id: Number(payment),
          branch: Number(editData.product.branch_id),
        };

        const result = await productPurchaseServices.editProductPurchase(
          accessToken,
          editData.id,
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

  const optionsPayment = paymentData?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  return (
    isOpen && (
      <Modal
        modalTitle="Edit Data"
        onClose={onClose}
        onSubmit={handleSubmit}
        alert={alert}
        isLoading={isLoading}
      >
        <div className="form-group">
          <label htmlFor="product">Produk</label>
          <input
            type="text"
            className="form-control"
            value={`${editData.product.name?.toUpperCase()}${
              editData.product.sub_name &&
              ` - ${editData.product.sub_name?.toUpperCase()}`
            }`}
            disabled
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

export default EditProductPurchase;

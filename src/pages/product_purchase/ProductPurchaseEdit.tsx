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

  const [formData, setFormData] = useState({
    qty: editData?.qty || 0,
    price: editData?.price || 0,
    payment_id: editData?.payment_id || "",
    branch: editData?.product.branch_id,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Edit this data?")) {
      setIsLoading(true);
      try {
        const resultEdit = await productPurchaseServices.editProductPurchase(
          accessToken,
          editData?.id,
          JSON.stringify(formData)
        );

        if (!resultEdit.status) {
          setAlert({
            status: true,
            color: "danger",
            message: resultEdit.message,
          });
          setIsLoading(false);
        } else {
          setAlert({
            status: true,
            color: "success",
            message: resultEdit.message,
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

  if (!isOpen) return null;

  return (
    <Modal
      modalTitle="Edit Data"
      onClose={onClose}
      onSubmit={handleSubmit}
      alert={alert}
      isLoading={isLoading}
    >
      <div className="form-group">
        <label htmlFor="product_purchase_product">Produk</label>
        <input
          id="product_purchase_product"
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
        <label htmlFor="product_purchase_qty">QTY Pembelian</label>
        <NumericFormat
          id="product_purchase_qty"
          className="form-control"
          defaultValue={formData.qty === 0 ? "" : formData.qty}
          thousandSeparator=","
          displayType="input"
          onValueChange={(values: any) => {
            setFormData({ ...formData, qty: values.floatValue });
          }}
          allowLeadingZeros={false}
          allowNegative={false}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product_purchase_price">Total Harga</label>
        <NumericFormat
          id="product_purchase_price"
          className="form-control"
          defaultValue={formData.price === 0 ? "" : formData.price}
          thousandSeparator=","
          displayType="input"
          onValueChange={(values: any) => {
            setFormData({ ...formData, price: values.floatValue });
          }}
          allowLeadingZeros={false}
          allowNegative={false}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product_purchase_payment">Jenis Payment</label>
        <Select
          instanceId={"product_purchase_payment"}
          placeholder="Pilih Payment"
          isClearable
          options={optionsPayment}
          required
          onChange={(e: any) =>
            setFormData({ ...formData, payment_id: e ? e.value : "" })
          }
          value={
            formData.payment_id
              ? optionsPayment.find(
                  (option: any) => option.value === formData.payment_id
                )
              : null
          }
        />
      </div>
    </Modal>
  );
};

export default EditProductPurchase;

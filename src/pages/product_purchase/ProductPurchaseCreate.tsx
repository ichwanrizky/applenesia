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

  const [formData, setFormData] = useState({
    product_id: "",
    qty: 0,
    price: 0,
    payment_id: "",
    branch: branch,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const resultCreate =
          await productPurchaseServices.createProductPurchase(
            accessToken,
            JSON.stringify(formData)
          );

        if (!resultCreate.status) {
          setAlert({
            status: true,
            color: "danger",
            message: resultCreate.message,
          });
          setIsLoading(false);
        } else {
          setAlert({
            status: true,
            color: "success",
            message: resultCreate.message,
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

  if (!isOpen) return null;

  return (
    <Modal
      modalTitle="Tambah Data"
      onClose={onClose}
      onSubmit={handleSubmit}
      alert={alert}
      isLoading={isLoading}
    >
      <div className="form-group">
        <label htmlFor="product_purchase_product">Produk</label>
        <Select
          instanceId={"product_purchase_product"}
          placeholder="Pilih Product"
          isClearable
          options={optionsProduct}
          required
          onChange={(e: any) =>
            setFormData({ ...formData, product_id: e ? e.value : "" })
          }
          value={
            formData.product_id
              ? optionsProduct.find(
                  (option: any) => option.value === formData.product_id
                )
              : null
          }
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

export default CreateProductPurchase;

"use client";
import Modal from "@/components/Modal";
import productServices from "@/services/productServices";
import { useState } from "react";
import { NumericFormat } from "react-number-format";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  editData: ProductInventory;
  editType: string;
};

type ProductInventory = {
  id: number;
  name: string;
  sub_name: string;
  stock: number;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const EditProductInventory = (props: Props) => {
  const { isOpen, onClose, accessToken, editData, editType } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [formData, setFormData] = useState({
    qty: 0,
    desc: "",
    type: editType,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Edit this data?")) {
      setIsLoading(true);
      try {
        const resultEdit = await productServices.editProductInventory(
          accessToken,
          editData.id,
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

  if (!isOpen) return null;

  return (
    <Modal
      modalTitle={
        editType === "IN" ? "Tambah Stock Produk" : "Kurang Stock Produk"
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      alert={alert}
      isLoading={isLoading}
    >
      <div className="form-group">
        <label htmlFor="product_inventroy_product_name">Produk</label>
        <input
          type="text"
          id="product_inventroy_product_name"
          className="form-control"
          style={{ textTransform: "uppercase" }}
          value={`${editData.name?.toUpperCase()}${
            editData.sub_name && ` - ${editData.sub_name?.toUpperCase()}`
          }`}
          disabled
        />
      </div>
      <div className="form-group">
        <label htmlFor="product_inventroy_stock">JUMLAH STOCK</label>
        <input
          id="product_inventroy_stock"
          type="text"
          className="form-control"
          value={editData.stock}
          disabled
        />
      </div>

      <hr />
      <div className="form-group">
        <label htmlFor="product_inventroy_qty">
          JUMLAH {editType === "IN" ? "TAMBAH" : "KURANG"}
        </label>
        <NumericFormat
          id="product_inventroy_qty"
          className="form-control"
          defaultValue={formData.qty == 0 ? "" : formData.qty}
          thousandSeparator=","
          displayType="input"
          onValueChange={(values: any) => {
            setFormData({ ...formData, qty: values.floatValue });
          }}
          allowLeadingZeros={false}
          allowNegative={false}
          required={true}
        />
      </div>
      <div className="form-group">
        <label htmlFor="product_inventroy_desc">KETERANGAN</label>
        <textarea
          id="product_inventroy_desc"
          className="form-control"
          style={{ textTransform: "uppercase" }}
          required
          rows={3}
          value={formData.desc}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
        ></textarea>
      </div>
    </Modal>
  );
};

export default EditProductInventory;

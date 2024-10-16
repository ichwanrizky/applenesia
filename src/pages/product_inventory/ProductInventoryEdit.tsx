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

  const [qty, setQty] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Edit this data?")) {
      setIsLoading(true);
      try {
        const data = {
          qty: Number(qty),
          desc,
          type: editType,
        };

        const result = await productServices.editProductInventory(
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

  return (
    isOpen && (
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
          <label htmlFor="product_name">Produk</label>
          <input
            type="text"
            id="product_name"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            value={`${editData.name?.toUpperCase()}${
              editData.sub_name && ` - ${editData.sub_name?.toUpperCase()}`
            }`}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">JUMLAH STOCK</label>
          <input
            type="text"
            id="stock"
            className="form-control"
            value={editData.stock}
            disabled
          />
        </div>

        <hr />
        <div className="form-group">
          <label htmlFor="qty">
            JUMLAH {editType === "IN" ? "TAMBAH" : "KURANG"}
          </label>
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
            required={true}
          />
        </div>
        <div className="form-group">
          <label htmlFor="desc">KETERANGAN</label>
          <textarea
            className="form-control"
            style={{ textTransform: "uppercase" }}
            id="desc"
            required
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
      </Modal>
    )
  );
};

export default EditProductInventory;

"use client";
import Modal from "@/components/Modal";
import categoryServices from "@/services/categoryServices";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const CreateProduct = (props: Props) => {
  const { isOpen, onClose, accessToken } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [name, setName] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // if (confirm("Add this data?")) {
    //   setIsLoading(true);
    //   try {
    //     const data = {
    //       name,
    //     };

    //     const result = await categoryServices.createCategory(accessToken, data);

    //     if (!result.status) {
    //       setAlert({
    //         status: true,
    //         color: "danger",
    //         message: result.message,
    //       });
    //       setIsLoading(false);
    //     } else {
    //       setAlert({
    //         status: true,
    //         color: "success",
    //         message: result.message,
    //       });
    //       setTimeout(() => {
    //         onClose();
    //       }, 1000);
    //     }
    //   } catch (error) {
    //     setAlert({
    //       status: true,
    //       color: "danger",
    //       message: "Something went wrong, please refresh and try again",
    //     });
    //     setIsLoading(false);
    //   }
    // }
  };

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
          <label htmlFor="product_name">Nama Product</label>
          <input
            type="text"
            id="product_name"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="product_sub_name">Sub Nama Product</label>
          <input
            type="text"
            id="product_sub_name"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="product_type">Tipe</label>
          <input
            type="text"
            id="product_type"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="product_category">Kategori</label>
          <input
            type="text"
            id="product_category"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="product_device_type">Device Tipe</label>
          <input
            type="text"
            id="product_device_type"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="product_device">Device</label>
          <input
            type="text"
            id="product_device"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="purchase_price">Harga Beli</label>
          <input
            type="text"
            id="purchase_price"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sell_price">Harga Jual</label>
          <input
            type="text"
            id="sell_price"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="product_warranty">Garansi</label>
          <input
            type="text"
            id="product_warranty"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            required
          />
        </div>
      </Modal>
    )
  );
};

export default CreateProduct;

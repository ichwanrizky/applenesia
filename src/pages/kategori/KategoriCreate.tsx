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

const CreateKategori = (props: Props) => {
  const { isOpen, onClose, accessToken } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [formData, setFormData] = useState({ name: "" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const resultCreate = await categoryServices.createCategory(
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
        <label htmlFor="category_name">Nama Kategori</label>
        <input
          type="text"
          id="category_name"
          className="form-control"
          style={{ textTransform: "uppercase" }}
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          value={formData.name}
        />
      </div>
    </Modal>
  );
};

export default CreateKategori;

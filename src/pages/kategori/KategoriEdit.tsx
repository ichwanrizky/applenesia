"use client";
import Modal from "@/components/Modal";
import categoryServices from "@/services/categoryServices";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  editData: Catgory;
};

type Catgory = {
  number: number;
  id: number;
  name: string;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const EditKategori = (props: Props) => {
  const { isOpen, onClose, accessToken, editData } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [name, setName] = useState(editData?.name || "");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const data = {
          name,
        };

        const result = await categoryServices.editCategory(
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
        modalTitle="Edit Data"
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
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
      </Modal>
    )
  );
};

export default EditKategori;

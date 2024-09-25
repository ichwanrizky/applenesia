"use client";
import Modal from "@/components/Modal";
import cabangServices from "@/services/cabangServices";
import { useState } from "react";

type CreateProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const CreateCabang = (props: CreateProps) => {
  const { isOpen, onClose } = props;

  const [name, setName] = useState("");
  const [telp, setTelp] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const data = {
          name,
          telp,
          address,
        };

        const result = await cabangServices.createCabang(data);

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
          }, 1500);
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
        modalTitle="Tambah Data"
        onClose={onClose}
        onSubmit={handleSubmit}
        alert={alert}
        isLoading={isLoading}
      >
        <div className="form-group">
          <label htmlFor="name">Nama Cabang</label>
          <input
            type="text"
            id="name"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            autoComplete="off"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="telp">Telp</label>
          <input
            type="number"
            id="telp"
            className="form-control"
            inputMode="numeric"
            autoComplete="off"
            required
            onChange={(e) => setTelp(e.target.value)}
            value={telp}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Alamat</label>
          <textarea
            id="address"
            className="form-control"
            autoComplete="off"
            required
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          />
        </div>
      </Modal>
    )
  );
};

export default CreateCabang;

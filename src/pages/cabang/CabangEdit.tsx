"use client";
import Modal from "@/components/Modal";
import cabangServices from "@/services/cabangServices";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  editData: Branch;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

type Branch = {
  number: number;
  id: number;
  uuid: string;
  name: string;
  address: string;
  alias: string;
  telp: string;
  latitude: null;
  longitude: null;
  is_deleted: boolean;
};

const EditCabang = (props: Props) => {
  const { isOpen, onClose, accessToken, editData } = props;

  const [name, setName] = useState(editData?.name || "");
  const [telp, setTelp] = useState(editData?.telp || "");
  const [address, setAddress] = useState(editData?.address || "");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Edit this data?")) {
      setIsLoading(true);
      try {
        const data = {
          name,
          telp,
          address,
        };

        const result = await cabangServices.editCabang(
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

export default EditCabang;

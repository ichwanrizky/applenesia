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
  email: string;
  is_deleted: boolean;
};

const EditCabang = (props: Props) => {
  const { isOpen, onClose, accessToken, editData } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [formData, setFormData] = useState({
    name: editData?.name || "",
    telp: editData?.telp || "",
    address: editData?.address || "",
    email: editData?.email || "",
    alias: editData?.alias || "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Edit this data?")) {
      setIsLoading(true);
      try {
        const resultEdit = await cabangServices.editCabang(
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
      modalTitle="Edit Data"
      onClose={onClose}
      onSubmit={handleSubmit}
      alert={alert}
      isLoading={isLoading}
    >
      <div className="form-group">
        <label htmlFor="branch_name">Nama Cabang</label>
        <input
          type="text"
          id="branch_name"
          className="form-control"
          style={{ textTransform: "uppercase" }}
          autoComplete="off"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          value={formData.name}
        />
      </div>

      <div className="form-group">
        <label htmlFor="branch_alias">Alias</label>
        <input
          type="text"
          id="branch_name"
          className="form-control"
          style={{ textTransform: "uppercase" }}
          autoComplete="off"
          required
          onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
          value={formData.alias}
        />
      </div>

      <div className="form-group">
        <label htmlFor="branch_telp">Telp</label>
        <input
          type="number"
          id="branch_telp"
          className="form-control"
          inputMode="numeric"
          autoComplete="off"
          required
          onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
          value={formData.telp}
        />
      </div>

      <div className="form-group">
        <label htmlFor="branch_email">Email</label>
        <input
          type="email"
          id="branch_email"
          className="form-control"
          autoComplete="off"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          value={formData.email}
        />
      </div>

      <div className="form-group">
        <label htmlFor="branch_address">Alamat</label>
        <textarea
          id="branch_address"
          className="form-control"
          autoComplete="off"
          required
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          value={formData.address}
        />
      </div>
    </Modal>
  );
};

export default EditCabang;

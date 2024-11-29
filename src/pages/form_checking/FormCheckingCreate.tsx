"use client";
import Modal from "@/components/Modal";
import formCheckingServices from "@/services/formCheckingServices";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  deviceTypeData: {
    id: number;
    name: string;
  }[];
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const CreateFormChecking = (props: Props) => {
  const { isOpen, onClose, accessToken, deviceTypeData } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const result = await formCheckingServices.createFormChecking(
          accessToken,
          JSON.stringify(formData)
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
        <label htmlFor="device_type">Tipe Device</label>
        <select
          className="custom-select"
          id="device_type"
          required
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          value={formData.type}
        >
          <option value="">Pilih Tipe Device</option>
          {deviceTypeData?.map((item, index) => (
            <option value={item.id} key={index}>
              {item.name?.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="list_checking">List Checking</label>
        <input
          type="text"
          id="list_checking"
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

export default CreateFormChecking;

"use client";
import Modal from "@/components/Modal";
import formCheckingServices from "@/services/formCheckingServices";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  deviceType: {
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
  const { isOpen, onClose, accessToken, deviceType } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const data = {
          name,
          type: Number(type),
        };

        const result = await formCheckingServices.createFormChecking(
          accessToken,
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
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option value="">Pilih Tipe Device</option>
            {deviceType?.map((item, index) => (
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
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
      </Modal>
    )
  );
};

export default CreateFormChecking;

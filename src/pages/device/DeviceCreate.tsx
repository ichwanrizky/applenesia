"use client";
import Modal from "@/components/Modal";
import deviceServices from "@/services/deviceServices";
import { useState } from "react";
import Select from "react-select";

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

const CreateDevice = (props: Props) => {
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

        const result = await deviceServices.createDevice(accessToken, data);

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

  const optionsDeviceType = deviceType?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

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
          <Select
            placeholder="Pilih Tipe Device"
            isClearable
            options={optionsDeviceType}
            required
            onChange={(e: any) => setType(e ? e.value : "")}
            value={
              type
                ? optionsDeviceType.find((option: any) => option.value === type)
                : null
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="device_name">Nama Device</label>
          <input
            type="text"
            id="device_name"
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

export default CreateDevice;

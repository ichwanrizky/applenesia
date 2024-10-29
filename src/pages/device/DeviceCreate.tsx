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

  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const resultCreate = await deviceServices.createDevice(
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

  const optionsDeviceType = deviceType?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

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
        <label htmlFor="device_device_type">Tipe Device</label>
        <Select
          instanceId={"device_device_type"}
          placeholder="Pilih Tipe Device"
          isClearable
          options={optionsDeviceType}
          required
          onChange={(e: any) =>
            setFormData({ ...formData, type: e ? e.value : "" })
          }
          value={
            formData.type
              ? optionsDeviceType.find(
                  (option: any) => option.value === formData.type
                )
              : null
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="device_device_name">Nama Device</label>
        <input
          type="text"
          id="device_device_name"
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

export default CreateDevice;

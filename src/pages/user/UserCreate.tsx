"use client";
import Modal from "@/components/Modal";
import userServices from "@/services/userServices";
import { useState } from "react";
import Select from "react-select";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  dataCabang: Branch[];
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
type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const CreateUser = (props: Props) => {
  const { isOpen, onClose, accessToken, dataCabang } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    repeatPassword: "",
    telp: "",
    role: "",
    manageBranch: [] as Branch[],
  });

  const optionsRole = [
    { value: "2", label: "ADMIN CABANG" },
    { value: "3", label: "KASIR CABANG" },
    { value: "4", label: "TEKNISI CABANG" },
    { value: "5", label: "SUPERVISOR" },
  ];

  const optionsBranch = dataCabang?.map((item) => ({
    value: item.id,
    label: item.name?.toUpperCase(),
  }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const data = {
          name: formData.name,
          username: formData.username,
          password: formData.password,
          telp: formData.telp,
          role: Number(formData.role),
          manageBranch: formData.manageBranch,
        };

        const resultCreate = await userServices.createUser(
          accessToken,
          JSON.stringify(data)
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
        <label htmlFor="user_name">Nama</label>
        <input
          type="text"
          id="user_name"
          className="form-control"
          style={{ textTransform: "uppercase" }}
          autoComplete="off"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          value={formData.name}
        />
      </div>

      <div className="form-group">
        <label htmlFor="user_username">Username</label>
        <input
          type="text"
          id="user_username"
          className="form-control"
          autoComplete="off"
          required
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          value={formData.username}
        />
      </div>

      <div className="form-group">
        <label htmlFor="user_password">Password</label>
        <input
          type="password"
          id="user_password"
          className="form-control"
          autoComplete="off"
          required
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          value={formData.password}
        />
      </div>

      <div className="form-group">
        <label htmlFor="user_repassword">Ulangi Password</label>
        <input
          type="password"
          id="user_repassword"
          className="form-control"
          autoComplete="off"
          required
          onChange={(e) =>
            setFormData({ ...formData, repeatPassword: e.target.value })
          }
          value={formData.repeatPassword}
        />
      </div>

      <div className="form-group">
        <label htmlFor="user_telp">Telp</label>
        <input
          type="number"
          id="user_telp"
          className="form-control"
          autoComplete="off"
          required
          onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
          value={formData.telp}
        />
      </div>

      <div className="form-group">
        <label htmlFor="user_role">Role</label>
        <Select
          instanceId="user_role"
          placeholder="Pilih Role"
          isClearable
          options={optionsRole}
          required
          onChange={(e) => setFormData({ ...formData, role: e ? e.value : "" })}
          value={
            formData.role
              ? optionsRole.find(
                  (option: any) => option.value === formData.role
                )
              : null
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="user_branch">Manage Cabang</label>
        <Select
          instanceId="user_branch"
          placeholder="Pilih Cabang"
          isClearable
          isMulti
          options={optionsBranch}
          onChange={(e: any) => setFormData({ ...formData, manageBranch: e })}
          required
        />
      </div>
    </Modal>
  );
};

export default CreateUser;

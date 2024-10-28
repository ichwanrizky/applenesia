"use client";
import Modal from "@/components/Modal";
import userServices from "@/services/userServices";
import { useState } from "react";
import Select from "react-select";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  dataCabang: UserBranch[];
};

type UserBranch = {
  branch: {
    id: number;
    name: string;
  };
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
    manageBranch: [] as UserBranch[],
  });

  const optionsRole = [
    { value: "1", label: "ADMINISTRATOR" },
    { value: "2", label: "ADMIN CABANG" },
    { value: "3", label: "KASIR CABANG" },
    { value: "4", label: "TEKNISI CABANG" },
  ];

  const optionsBranch = dataCabang?.map((item) => ({
    value: item.branch.id,
    label: item.branch.name?.toUpperCase(),
  }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const result = await userServices.createUser(
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
        <label htmlFor="name">Nama</label>
        <input
          type="text"
          id="name"
          className="form-control"
          style={{ textTransform: "uppercase" }}
          autoComplete="off"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          value={formData.name}
        />
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
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
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
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
        <label htmlFor="re-password">Ulangi Password</label>
        <input
          type="password"
          id="re-password"
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
        <label htmlFor="telp">Telp</label>
        <input
          type="number"
          id="telp"
          className="form-control"
          autoComplete="off"
          required
          onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
          value={formData.telp}
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Role</label>
        <Select
          id="role"
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
        <label htmlFor="cabang">Manage Cabang</label>
        <Select
          id="cabang"
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

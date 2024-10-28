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
  editData: Users;
};

type Users = {
  number: number;
  id: number;
  username: string;
  password: string;
  name: string;
  telp: string;
  created_at: Date;
  is_deleted: boolean;
  role_id: number;
  user_branch: {
    branch: Branch;
    branch_id: number;
    user_id: number;
  }[];
  role: Role;
};

type Role = {
  id: number;
  name: string;
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

const EditUser = (props: Props) => {
  const { isOpen, onClose, accessToken, dataCabang, editData } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [formData, setFormData] = useState({
    name: editData?.name || "",
    username: editData?.username || "",
    telp: editData?.telp || "",
    role: editData?.role?.id?.toString() || "",
    manageBranch:
      editData?.user_branch?.map((item) => ({
        value: item.branch.id,
        label: item.branch.name?.toUpperCase(),
      })) || [],
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
        const result = await userServices.editUser(
          accessToken,
          editData.id,
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
      modalTitle="Edit Data"
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
          value={formData.manageBranch}
          required
        />
      </div>
    </Modal>
  );
};

export default EditUser;

"use client";
import Modal from "@/components/Modal";
import userServices from "@/services/userServices";
import { useState } from "react";
import Select from "react-select";

type CreateProps = {
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

const CreateUser = (props: CreateProps) => {
  const { isOpen, onClose, accessToken, dataCabang } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [telp, setTelp] = useState("");
  const [role, setRole] = useState("");
  const [manageBranch, setManageBranch] = useState<Branch | []>([]);

  const optionsRole = [
    { value: "1", label: "ADMINISTRATOR" },
    { value: "2", label: "ADMIN CABANG" },
    { value: "3", label: "KASIR CABANG" },
    { value: "4", label: "TEKNISI CABANG" },
  ];

  const optionsBranch = dataCabang.map((item) => ({
    value: item.id,
    label: item.name?.toUpperCase(),
  }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const data = {
          name,
          username,
          password,
          telp,
          role,
          manageBranch: JSON.stringify(manageBranch),
        };

        const result = await userServices.createUser(accessToken, data);

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
          <label htmlFor="name">Nama</label>
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
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            autoComplete="off"
            required
            onChange={(e) => setUsername(e.target.value)}
            value={username}
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
            onChange={(e) => setPassword(e.target.value)}
            value={password}
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
            onChange={(e) => setRepeatPassword(e.target.value)}
            value={repeatPassword}
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
            onChange={(e) => setTelp(e.target.value)}
            value={telp}
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
            onChange={(e: any) => setRole(e ? e.value : "")}
            value={
              role
                ? optionsRole.find((option: any) => option.value === role)
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
            onChange={(e: any) => setManageBranch(e)}
            required
          />
        </div>
      </Modal>
    )
  );
};

export default CreateUser;

"use client";

import Modal from "@/components/Modal";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: (selectedProduct?: any) => void;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const InvoicePaymentUpdate = (props: Props) => {
  const { isOpen, onClose } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  if (!isOpen) return null;

  return (
    <Modal
      modalTitle="Tambah Data"
      onClose={onClose}
      onSubmit={() => {}}
      alert={alert}
      isLoading={isLoading}
    >
      <div className="form-group">
        <label htmlFor="user_name">Nama</label>
      </div>
    </Modal>
  );
};

export default InvoicePaymentUpdate;

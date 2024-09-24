import Modal from "@/components/Modal";

type CreateProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateCabang = (props: CreateProps) => {
  const { isOpen, onClose } = props;
  return (
    isOpen && (
      <Modal modalTitle="test" onClose={onClose}>
        awd
      </Modal>
    )
  );
};

export default CreateCabang;

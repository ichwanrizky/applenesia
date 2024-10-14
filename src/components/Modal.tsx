import CustomAlert from "./CustomAlert";
import CustomButton from "./CustomButton";

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

type ModalProps = {
  modalTitle: string;
  children: React.ReactNode;
  onClose: () => void;
  isLoading?: boolean;
  onSubmit: any;
  alert?: AlertProps | null;
  isLoadingHeader?: boolean;
};

const Modal = (props: ModalProps) => {
  const {
    modalTitle,
    children,
    onClose,
    isLoading,
    onSubmit,
    alert,
    isLoadingHeader,
  } = props;
  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalScrollableTitle"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form onSubmit={onSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalScrollableTitle">
                  {modalTitle}
                  {isLoadingHeader && (
                    <span className="spinner-border spinner-border-sm ml-2"></span>
                  )}
                </h5>
                <button
                  type="button"
                  className="close waves-effect waves-light"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={onClose}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "80vh", overflowY: "auto" }}
              >
                {alert?.status && (
                  <CustomAlert message={alert.message} color={alert.color} />
                )}

                {children}
              </div>
              <div className="modal-footer">
                <CustomButton buttonType="close" onClick={onClose}>
                  Close
                </CustomButton>

                <CustomButton buttonType="submit" isLoading={isLoading}>
                  Save changes
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;

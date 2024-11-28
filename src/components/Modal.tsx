import { useEffect, useState } from "react";
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

  const [alertModal, setAlertModal] = useState<AlertProps | null>(
    alert || null
  );

  useEffect(() => {
    if (alert) {
      setAlertModal(alert);
    }
  }, [alert]);

  useEffect(() => {
    if (alertModal) {
      const timer = setTimeout(() => {
        setAlertModal(null); // Set alert back to null after 2 seconds
      }, 2000);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [alertModal]);

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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <h5 className="modal-title" id="exampleModalScrollableTitle">
                    {modalTitle}
                    {isLoadingHeader && (
                      <span className="spinner-border spinner-border-sm ml-2"></span>
                    )}
                  </h5>

                  {/* Add the alert below the title inside the modal-header */}
                  {alertModal?.status && (
                    <div className="mt-2">
                      <CustomAlert
                        message={alertModal.message}
                        color={alertModal.color}
                      />
                    </div>
                  )}
                </div>

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

              <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
                <div className="modal-body">{children}</div>
                <div className="modal-footer">
                  <CustomButton buttonType="close" onClick={onClose}>
                    Close
                  </CustomButton>

                  <CustomButton buttonType="submit" isLoading={isLoading}>
                    Save changes
                  </CustomButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;

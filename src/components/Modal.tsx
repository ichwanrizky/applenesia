import CustomButton from "./CustomButton";

type ModalProps = {
  modalTitle: string;
  children: React.ReactNode;
  onClose: () => void;
  isLoading?: boolean;
};

const Modal = (props: ModalProps) => {
  const { modalTitle, children, onClose, isLoading } = props;
  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ display: "block" }}
      ></div>
      <div
        className="modal fade show"
        id="exampleModalScrollable"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalScrollableTitle"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-dialog-scrollable" role="document">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalScrollableTitle">
                  {modalTitle}
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
              <div className="modal-body">{children}</div>
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

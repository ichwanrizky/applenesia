type CustomButtonProps = {
  buttonType: string;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  indexData?: number;
  onEdit?: () => void;
  onDelete?: () => void;
};

const CustomButton = (props: CustomButtonProps) => {
  const {
    buttonType,
    disabled,
    isLoading,
    onClick,
    children,
    indexData,
    onEdit,
    onDelete,
  } = props;
  switch (buttonType) {
    case "add":
      return (
        <button
          className="btn btn-primary"
          type="button"
          disabled={disabled || isLoading}
          onClick={onClick}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>{" "}
              Loading...
            </>
          ) : (
            <>
              <i className="mdi mdi mdi mdi-plus"></i> {children}
            </>
          )}
        </button>
      );
    case "submit":
      return (
        <button
          className="btn btn-primary"
          type="submit"
          disabled={disabled || isLoading}
          onClick={onClick}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>{" "}
              Loading...
            </>
          ) : (
            children
          )}
        </button>
      );
    case "close":
      return (
        <button
          className="btn btn-light"
          type="button"
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </button>
      );
    case "login":
      return (
        <button
          className="btn btn-success btn-block waves-effect waves-light"
          type="submit"
          disabled={disabled || isLoading}
          onClick={onClick}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>{" "}
              Loading...
            </>
          ) : (
            children
          )}
        </button>
      );
    case "action":
      return isLoading ? (
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle waves-effect waves-light"
            type="button"
            disabled
          >
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          </button>
        </div>
      ) : (
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle waves-effect waves-light"
            type="button"
            id={`dropdownMenuButton${indexData}`}
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {children}
          </button>
          <div
            className="dropdown-menu"
            aria-labelledby={`dropdownMenuButton${indexData}`}
          >
            <a className="dropdown-item d-flex align-items-center" href="#">
              <i className="mdi mdi-file-document-edit-outline mr-2" />
              Edit
            </a>
            <a
              className="dropdown-item text-danger"
              href="#"
              onClick={onDelete}
            >
              <i className="mdi mdi-trash-can-outline mr-2" />
              Delete
            </a>
          </div>
        </div>
      );
  }
};

export default CustomButton;

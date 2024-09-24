type CustomButtonProps = {
  buttonType: string;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

const CustomButton = (props: CustomButtonProps) => {
  const { buttonType, disabled, isLoading, onClick, children } = props;
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
  }
};

export default CustomButton;

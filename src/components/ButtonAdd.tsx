type ButtonAddProps = {
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
};

const ButtonAdd = (props: ButtonAddProps) => {
  const { disabled, isLoading, children } = props;
  return (
    <button className="btn btn-primary" type="button" disabled={disabled}>
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
};

export default ButtonAdd;

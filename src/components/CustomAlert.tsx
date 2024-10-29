import { useEffect, useState } from "react";

type CustomAlertProps = {
  color: string;
  message: string;
  isDismissable?: boolean;
};

const CustomAlert = (props: CustomAlertProps) => {
  const { color, message, isDismissable = false } = props;
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isDismissable) {
      const timer = setTimeout(() => {
        setIsVisible(false); // Hide the alert after 5 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`alert alert-${color} d-flex align-items-center`}
      role="alert"
    >
      <i
        className={`mdi mdi ${
          color === "success" ? "mdi mdi-check-bold" : "mdi-progress-alert"
        }  mr-2`}
        style={{ fontSize: "1.5rem" }}
      ></i>
      <div className="font-weight-bold">{`${message}`}</div>
    </div>
  );
};

export default CustomAlert;

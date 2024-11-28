import { useEffect, useState } from "react";

type CustomAlertProps = {
  color: string;
  message: string;
};

const CustomAlert = (props: CustomAlertProps) => {
  const { color, message } = props;

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

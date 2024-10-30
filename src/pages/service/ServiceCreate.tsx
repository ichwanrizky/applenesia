"use client";

import { useState } from "react";
import ServiceCreateStep1 from "./create/ServiceCreateStep1";
import CustomAlert from "@/components/CustomAlert";
import libServices from "@/services/libServices";
import ServiceCreateStep2 from "./create/ServiceCreateStep2";
import ServiceCreateStep3 from "./create/ServiceCreateStep3";

type Session = {
  name: string;
  id: number;
  username: string;
  role_id: number;
  role_name: string;
  accessToken: string;
  userBranch: any;
};

type DeviceType = {
  id: number;
  name: string;
};

type Customer = {
  id: number;
  name: string;
  telp: string;
  email: string;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

type FormChecking = {
  id: number;
  name: string;
  in_check: boolean;
  out_check: boolean;
  notes: string;
};

type Branch = {
  id: number;
  name: string;
};

const CreateServicePage = ({
  session,
  deviceTypeData,
  customerData,
}: {
  session: Session;
  deviceTypeData: DeviceType[];
  customerData: Customer[];
}) => {
  const [step, setStep] = useState(1);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [isLoadingHeader, setIsLoadingHeader] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [listFormCheck, setListFormCheck] = useState([] as FormChecking[]);
  const [branchData, setBranchData] = useState([] as Branch[]);

  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    customer_telp: "",
    customer_email: "",
    device_type: "",
    device_type_label: "",
    device: "",
    device_label: "",
    imei: "",
    service_desc: "",
    service_form_checking: [],
    branch: "",
    technician: "",
    service_status: "1",
  });

  const nextStep = async () => {
    const form1 = document.getElementById("step1Form") as HTMLFormElement;
    if (step === 1 && form1) {
      if (!form1.reportValidity()) {
        return;
      }

      if (listFormCheck.length === 0) {
        setIsLoadingHeader(true);
        try {
          const result = await libServices.getFormCheck(
            session!.accessToken,
            Number(formData.device_type)
          );

          if (!result.status) {
            setAlert({
              status: true,
              color: "danger",
              message: result.message,
            });
            return;
          }

          setListFormCheck(
            result.data?.map((e: FormChecking) => ({
              id: e.id,
              name: e.name?.toUpperCase(),
              in_check: false,
              out_check: false,
              notes: "",
            }))
          );
        } catch (error) {
          setAlert({
            status: true,
            color: "danger",
            message: "Something went wrong, please refresh and try again",
          });
          return;
        } finally {
          setIsLoadingHeader(false);
        }
      }
    }

    if (step === 2) {
      if (branchData.length === 0) {
        setIsLoadingHeader(true);
        try {
          const result = await libServices.getCabang(session!.accessToken);

          if (!result.status) {
            setAlert({
              status: true,
              color: "danger",
              message: result.message,
            });
            return;
          }

          setBranchData(result.data);
        } catch (error) {
          setAlert({
            status: true,
            color: "danger",
            message: "Something went wrong, please refresh and try again",
          });
          return;
        } finally {
          setIsLoadingHeader(false);
        }
      }
    }

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFormChange = (updatedFormData: any) => {
    setFormData({ ...formData, ...updatedFormData });
  };

  const handleLoadingHeader = (status: boolean) => {
    setIsLoadingHeader(status);
  };

  const handleAlert = (status: boolean, color: string, message: string) => {
    setAlert({ status, color, message });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ServiceCreateStep1
            accessToken={session!.accessToken}
            handleLoadingHeader={handleLoadingHeader}
            handleAlert={handleAlert}
            handleFormChange={handleFormChange}
            deviceTypeData={deviceTypeData}
            customerData={customerData}
          />
        );

      case 2:
        return (
          <ServiceCreateStep2
            accessToken={session!.accessToken}
            handleLoadingHeader={handleLoadingHeader}
            handleAlert={handleAlert}
            handleFormChange={handleFormChange}
            listFormCheckData={listFormCheck}
          />
        );

      case 3:
        return (
          <ServiceCreateStep3
            accessToken={session!.accessToken}
            handleLoadingHeader={handleLoadingHeader}
            handleAlert={handleAlert}
            handleFormChange={handleFormChange}
            parentFormData={formData}
            branchData={branchData}
          />
        );
    }
  };

  return (
    <div className="row">
      <div className="col-md-10 offset-md-1">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Tambah Service</h4>
            <p className="card-subtitle mb-4">Silahkan isi data di bawah.</p>
            {alert?.status && (
              <CustomAlert color={alert.color} message={alert.message} />
            )}
            {isLoadingHeader && (
              <div className="mb-2">
                Please Wait ...
                <span className="spinner-border spinner-border-sm " />
              </div>
            )}
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <a
                  className={`nav-link ${step === 1 ? "active" : ""}`}
                  href="#"
                >
                  Step 1
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${step === 2 ? "active" : ""}`}
                  href="#"
                >
                  Step 2
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${step === 3 ? "active" : ""}`}
                  href="#"
                >
                  Step 3
                </a>
              </li>
            </ul>
            <div
              className="tab-content p-2"
              style={{ maxHeight: "500px", overflow: "auto" }}
            >
              {renderStepContent()}
            </div>
          </div>
          <div className="card-footer text-end">
            <button
              className="btn btn-dark mr-2"
              onClick={prevStep}
              disabled={step === 1}
            >
              Previous
            </button>
            <button
              className="btn btn-primary"
              onClick={step === 3 ? () => nextStep() : nextStep}
              // onClick={step === 3 ? () => handleSubmit() : nextStep}
              // disabled={
              //   step === 3
              //     ? technician === "" || branch === "" || isLoadingSubmit
              //     : false
              // }
            >
              {step === 3 ? (
                isLoadingSubmit ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Loading...
                  </>
                ) : (
                  "Submit"
                )
              ) : (
                "Next"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateServicePage;

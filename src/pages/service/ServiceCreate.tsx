"use client";
import React, { useState } from "react";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import deviceServices from "@/services/deviceServices";
import CustomAlert from "@/components/CustomAlert";
import libServices from "@/services/libServices";
import BranchOptions from "@/components/BranchOptions";

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

type Device = {
  id: number;
  name: string;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

type FormChecking = {
  id: number;
  name: string;
  inCheck: boolean;
  outCheck: boolean;
  desc: string;
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
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [isLoadingHeader, setIsLoadingHeader] = useState(false);
  const [deviceData, setDeviceData] = useState([] as Device[]);
  const [listFormCheck, setListFormCheck] = useState([] as FormChecking[]);

  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerTelp, setCustomerTelp] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [device, setDevice] = useState("");
  const [imei, setImei] = useState("");
  const [description, setDescription] = useState("");
  const [branchAccess, setBranchAccess] = useState(
    session?.role_name === "ADMINISTRATOR"
      ? "all"
      : session?.userBranch.length > 0
      ? session?.userBranch[0].branch.id?.toString()
      : ""
  );

  const nextStep = async () => {
    const form1 = document.getElementById("step1Form") as HTMLFormElement;

    if (step === 1 && form1) {
      if (!form1.reportValidity()) {
        return; // Stop if validation fails
      }

      if (listFormCheck.length === 0) {
        setIsLoadingHeader(true);
        try {
          const result = await libServices.getFormCheck(
            session!.accessToken,
            Number(deviceType)
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
              inCheck: false,
              outCheck: false,
              desc: "",
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

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCustomer = (customerId: string) => {
    setCustomer(customerId);
    setCustomerName("");
    setCustomerTelp("");
    setCustomerEmail("");
    if (customerId !== "") {
      const customer = customerData?.find((e) => e.id === Number(customerId));
      setCustomerName(customer?.name || "");
      setCustomerTelp(customer?.telp || "");
      setCustomerEmail(customer?.email || "");
    }
  };

  const handleGetDevice = async (deviceType: string) => {
    setIsLoadingHeader(true);
    try {
      const result = await deviceServices.getDeviceByType(
        session!.accessToken,
        Number(deviceType)
      );

      if (!result.status) {
        setAlert({
          status: true,
          color: "danger",
          message: result.message,
        });
      }

      setDeviceData(result.data);
    } catch (error) {
      setAlert({
        status: true,
        color: "danger",
        message: "Something went wrong, please refresh and try again",
      });
    } finally {
      setIsLoadingHeader(false);
    }
  };

  const handleCheck = (id: number, field: "inCheck" | "outCheck") => {
    setListFormCheck(
      listFormCheck?.map((e) =>
        e.id === id
          ? {
              ...e,
              [field]: !e[field],
            }
          : e
      )
    );
  };

  const handleDescCheck = (id: number, desc: string) => {
    setListFormCheck(
      listFormCheck?.map((e) => (e.id === id ? { ...e, desc: desc } : e))
    );
  };

  const handleCheckAll = (field: "inCheck" | "outCheck") => {
    const checking = listFormCheck.every((e) => e[field]);
    setListFormCheck(
      listFormCheck?.map((e) => ({
        ...e,
        [field]: !checking,
      }))
    );
  };

  const optionsCustomer = customerData?.map((e) => ({
    label: `${e.name?.toUpperCase()} - ${e.telp}`,
    value: e.id,
  }));

  const optionsDeviceType = deviceTypeData?.map((e) => ({
    label: e.name?.toUpperCase(),
    value: e.id,
  }));

  const optionsDevice = deviceData?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form id="step1Form">
            <h5>Step 1: Informasi Customer</h5>
            <div className="form-group mb-3">
              <label htmlFor="customerList">List Customer</label>
              <Select
                instanceId="customerList"
                placeholder="Pilih Customer"
                isClearable
                required={customerName !== "" ? false : true}
                options={optionsCustomer}
                onChange={(e: any) => handleCustomer(e ? e.value : "")}
                value={
                  customer
                    ? optionsCustomer.find(
                        (option: any) => option.value === customer
                      )
                    : null
                }
              />
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-sm-6">
                  <label htmlFor="customerName">Nama</label>
                  <input
                    type="text"
                    className="form-control"
                    id="customerName"
                    value={customerName}
                    style={{ textTransform: "uppercase" }}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-sm-3">
                  <label htmlFor="customerTelp">Telp</label>
                  <input
                    type="number"
                    className="form-control"
                    id="customerTelp"
                    value={customerTelp}
                    onChange={(e) => setCustomerTelp(e.target.value)}
                  />
                </div>
                <div className="col-sm-3">
                  <label htmlFor="customerEmail">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="customerEmail"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-sm-3">
                  <label htmlFor="deviceType">Tipe Device</label>
                  <Select
                    instanceId="deviceType"
                    placeholder="Pilih Tipe Device"
                    isClearable
                    required
                    options={optionsDeviceType}
                    onChange={(e: any) => {
                      setDeviceType(e ? e.value : "");
                      setDevice("");
                      if (e) {
                        handleGetDevice(e.value);
                      }
                    }}
                    value={
                      deviceType
                        ? optionsDeviceType.find(
                            (option: any) => option.value === deviceType
                          )
                        : null
                    }
                  />
                </div>
                <div className="col-sm-3">
                  <label htmlFor="device">Device</label>
                  <Select
                    instanceId="device"
                    placeholder="Pilih Device"
                    isClearable
                    required
                    options={optionsDevice}
                    onChange={(e: any) => setDevice(e ? e.value : "")}
                    value={
                      device
                        ? optionsDevice.find(
                            (option: any) => option.value === device
                          )
                        : null
                    }
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="imei">IMEI</label>
                  <input
                    type="text"
                    className="form-control"
                    id="imei"
                    style={{ textTransform: "uppercase" }}
                    required
                    value={imei}
                    onChange={(e) => setImei(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Deskripsi Kerusakan</label>
              <textarea
                className="form-control"
                rows={4}
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </form>
        );

      case 2:
        return (
          <form id="step2Form">
            <h5>Step 2: Form Checking</h5>
            <div
              className="table-responsive"
              style={{ maxHeight: "300px", overflow: "auto" }}
            >
              <table className="table table-sm table-striped table-bordered nowrap mb-5">
                <thead>
                  <tr>
                    <th
                      style={{
                        width: "1%",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      NO
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      SPAREPART
                    </th>
                    <th style={{ width: "8%", textAlign: "center" }}>
                      IN <br />
                      <input
                        type="checkbox"
                        onChange={() => handleCheckAll("inCheck")}
                      />
                    </th>
                    <th style={{ width: "8%", textAlign: "center" }}>
                      OUT <br />
                      <input
                        type="checkbox"
                        onChange={() => handleCheckAll("outCheck")}
                        disabled
                      />
                    </th>
                    <th
                      style={{
                        width: "30%",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      KET
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listFormCheck.length === 0 ? (
                    <tr>
                      <td colSpan={5} align="center">
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    listFormCheck?.map((item, index: number) => (
                      <tr key={index}>
                        <td align="center">{index + 1}</td>
                        <td>{item.name}</td>
                        <td align="center">
                          <input
                            type="checkbox"
                            checked={item.inCheck}
                            onChange={() => handleCheck(item.id, "inCheck")}
                          />
                        </td>
                        <td align="center">
                          <input
                            type="checkbox"
                            checked={item.outCheck}
                            onChange={() => handleCheck(item.id, "outCheck")}
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{ width: "100%" }}
                            value={item.desc}
                            onChange={(e) =>
                              handleDescCheck(item.id, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </form>
        );

      case 3:
        return (
          <form id="step3Form">
            <h5>Step 3: Confirmation</h5>

            <div className="card p-3 shadow-lg mt-3">
              <div className="form-group">
                <div className="row">
                  <div className="col-sm-6">
                    <label htmlFor="customerName">Nama</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ textTransform: "uppercase" }}
                      id="customerName"
                      value={customerName}
                      disabled
                    />
                  </div>
                  <div className="col-sm-3">
                    <label htmlFor="customerTelp">Telp</label>
                    <input
                      type="number"
                      className="form-control"
                      id="customerTelp"
                      value={customerTelp}
                      disabled
                    />
                  </div>
                  <div className="col-sm-3">
                    <label htmlFor="customerEmail">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="customerEmail"
                      value={customerEmail}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-sm-3">
                    <label htmlFor="deviceType">Tipe Device</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ textTransform: "uppercase" }}
                      id="deviceType"
                      value={
                        deviceType
                          ? optionsDeviceType.find(
                              (option: any) => option.value === deviceType
                            )?.label
                          : ""
                      }
                      disabled
                    />
                  </div>
                  <div className="col-sm-3">
                    <label htmlFor="device">Device</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ textTransform: "uppercase" }}
                      id="device"
                      value={
                        device
                          ? optionsDevice.find(
                              (option: any) => option.value === device
                            )?.label
                          : ""
                      }
                      disabled
                    />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="imei">IMEI</label>
                    <input
                      type="text"
                      className="form-control"
                      id="imei"
                      style={{ textTransform: "uppercase" }}
                      value={imei}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Deskripsi Kerusakan</label>
                <textarea
                  className="form-control"
                  rows={4}
                  id="description"
                  value={description}
                  disabled
                />
              </div>
            </div>

            <div className="card p-3 shadow-lg mt-3">
              <div
                className="table-responsive"
                style={{ maxHeight: "450px", overflow: "auto" }}
              >
                <table className="table table-sm table-striped table-bordered nowrap mb-5">
                  <thead>
                    <tr>
                      <th
                        style={{
                          width: "1%",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        NO
                      </th>
                      <th
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        SPAREPART
                      </th>
                      <th style={{ width: "8%", textAlign: "center" }}>IN</th>
                      <th style={{ width: "8%", textAlign: "center" }}>OUT</th>
                      <th
                        style={{
                          width: "30%",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        KET
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listFormCheck.length === 0 ? (
                      <tr>
                        <td colSpan={5} align="center">
                          Tidak ada data
                        </td>
                      </tr>
                    ) : (
                      listFormCheck?.map((item, index: number) => (
                        <tr key={index}>
                          <td align="center">{index + 1}</td>
                          <td>{item.name}</td>
                          <td align="center">
                            <input
                              type="checkbox"
                              checked={item.inCheck}
                              disabled
                            />
                          </td>
                          <td align="center">
                            <input
                              type="checkbox"
                              checked={item.outCheck}
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ width: "100%" }}
                              value={item.desc}
                              disabled
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card p-3 shadow-lg mt-3">
              <div className="form-group mb-3">
                <label htmlFor="branch">Pilih Cabang</label>
                <BranchOptions
                  userBranch={session?.userBranch}
                  role={session?.role_name}
                  setBranchAccess={setBranchAccess}
                />
              </div>

              <div className="form-group ">
                <label htmlFor="techncian">Teknisi</label>
                <Select
                  instanceId="techncian"
                  placeholder="Pilih Teknisi"
                  isClearable
                  options={optionsDevice}
                />
              </div>

              <div className="form-group ">
                <label htmlFor="serviceStatus">Status Service</label>
                <select className="custom-select">
                  <option value="">SERVICE MASUK</option>
                </select>
              </div>
            </div>
          </form>
        );

      default:
        return null;
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
            <div className="tab-content p-2">{renderStepContent()}</div>
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
              onClick={nextStep}
              disabled={step === 3}
            >
              {step === 3 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateServicePage;

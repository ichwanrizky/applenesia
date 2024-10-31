"use client";
import React, { useState } from "react";
import Select from "react-select";
import deviceServices from "@/services/deviceServices";
import CustomAlert from "@/components/CustomAlert";
import libServices from "@/services/libServices";
import serviceServices from "@/services/serviceServices";
import { useRouter } from "next/navigation";
import ServiceProductList from "./ServiceProductList";
import ServiceCreateStep1 from "./create/ServiceCreateStep1";

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
  in_check: boolean;
  out_check: boolean;
  notes: string;
};

type Branch = {
  id: number;
  name: string;
};

type Technician = {
  id: number;
  name: string;
};

type SelectedProduct = {
  id: number;
  name: string;
  sub_name?: string;
  price: number;
  qty: number;
  warranty: number;
  is_product: boolean;
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
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [deviceData, setDeviceData] = useState([] as Device[]);
  const [listFormCheck, setListFormCheck] = useState([] as FormChecking[]);
  const [branchData, setBranchData] = useState([] as Branch[]);
  const [techncianData, setTechncianData] = useState([] as Technician[]);
  const [isProductOpen, setIsProductOpen] = useState(false);

  const { push } = useRouter();

  const [step, setStep] = useState(1);

  const [branch, setBranch] = useState("");
  const [technician, setTechnician] = useState("");
  const [serviceStatus, setServiceStatus] = useState("");
  const [serviceFinish, setServiceFinish] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([] as any);

  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    customer_telp: "",
    customer_email: "",
    device_type: "",
    device: "",
    imei: "",
    service_desc: "",
  });

  const closeProductList = (selectedProduct: any) => {
    setIsProductOpen(false);
    setSelectedProduct(selectedProduct);
  };

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

  const handleCheck = (id: number, field: "in_check" | "out_check") => {
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

  const handleDescCheck = (id: number, notes: string) => {
    setListFormCheck(
      listFormCheck?.map((e) => (e.id === id ? { ...e, notes: notes } : e))
    );
  };

  const handleCheckAll = (field: "in_check" | "out_check") => {
    const checking = listFormCheck.every((e) => e[field]);
    setListFormCheck(
      listFormCheck?.map((e) => ({
        ...e,
        [field]: !checking,
      }))
    );
  };

  const handleGetTechnician = async (branch: number) => {
    setIsLoadingHeader(true);
    try {
      const result = await libServices.getTechnician(
        session!.accessToken,
        Number(branch)
      );

      if (!result.status) {
        setAlert({
          status: true,
          color: "danger",
          message: result.message,
        });
      }

      setTechncianData(result.data);
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

  const handleSubmit = async () => {
    const form3 = document.getElementById("step3Form") as HTMLFormElement;

    if (step === 3 && form3) {
      if (!form3.reportValidity()) {
        return;
      }
    }

    if (confirm("Add this data?")) {
      setIsLoadingSubmit(true);
      try {
        const data = {
          customer_id: customer,
          customer_name: customerName?.toUpperCase(),
          customer_telp: customerTelp,
          customer_email: customerEmail,
          device_type: deviceType,
          device: device,
          imei: imei,
          service_desc: description,
          service_form_checking: listFormCheck,
          branch: branch,
          techncian: technician,
          service_status: serviceStatus,
        };

        const result = await serviceServices.createService(
          session!.accessToken,
          data
        );

        if (!result.status) {
          setAlert({
            status: true,
            color: "danger",
            message: result.message,
          });
          setIsLoadingSubmit(false);
        } else {
          setAlert({
            status: true,
            color: "success",
            message: result.message,
          });

          push("/dashboard/service");
        }
      } catch (error) {
        setAlert({
          status: true,
          color: "danger",
          message: "Something went wrong, please refresh and try again",
        });
        setIsLoadingSubmit(false);
      }
    }
  };

  const optionsDevice = deviceData?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  const optionsBranch = branchData?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  const optionsTechnician = techncianData?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ServiceCreateStep1
            accessToken={session!.accessToken}
            formData={formData}
            setFormData={setFormData}
            customerData={customerData}
            deviceTypeData={deviceTypeData}
          />
        );

      case 2:
        return (
          <form id="step2Form">
            <h5>Step 2: Form Checking</h5>
            <div className="table-responsive">
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
                        onChange={() => handleCheckAll("in_check")}
                      />
                    </th>
                    <th style={{ width: "8%", textAlign: "center" }}>
                      OUT <br />
                      <input
                        type="checkbox"
                        onChange={() => handleCheckAll("out_check")}
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
                            checked={item.in_check}
                            onChange={() => handleCheck(item.id, "in_check")}
                          />
                        </td>
                        <td align="center">
                          <input
                            type="checkbox"
                            checked={item.out_check}
                            onChange={() => handleCheck(item.id, "out_check")}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              width: "100%",
                              textTransform: "uppercase",
                            }}
                            value={item.notes}
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
              <div className="table-responsive">
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
                              checked={item.in_check}
                              disabled
                            />
                          </td>
                          <td align="center">
                            <input
                              type="checkbox"
                              checked={item.out_check}
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ width: "100%" }}
                              value={item.notes}
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
                <Select
                  instanceId="branch"
                  placeholder="Pilih Cabang"
                  isClearable
                  required
                  options={optionsBranch}
                  onChange={(e: any) => {
                    setTechncianData([]);
                    setBranch(e ? e.value : "");
                    if (e) {
                      handleGetTechnician(e.value);
                    }
                  }}
                  value={
                    branch
                      ? optionsBranch.find(
                          (option: any) => option.value === branch
                        )
                      : null
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="techncian">Teknisi</label>
                <Select
                  instanceId="techncian"
                  placeholder="Pilih Teknisi"
                  isClearable
                  required
                  options={optionsTechnician}
                  onChange={(e: any) => setTechnician(e ? e.value : "")}
                  value={
                    technician
                      ? optionsTechnician.find(
                          (option: any) => option.value === technician
                        )
                      : null
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="serviceStatus">Status Service</label>
                <Select
                  instanceId="serviceStatus"
                  placeholder="Pilih Status Service"
                  isClearable
                  required
                  options={[
                    { value: "1", label: "SERVICE MASUK - BARANG DITINGGAL" },
                    { value: "2", label: "SERVICE MASUK - LANGSUNG" },
                  ]}
                  onChange={(e: any) => setServiceStatus(e ? e.value : "")}
                  value={
                    serviceStatus
                      ? [
                          {
                            value: "1",
                            label: "SERVICE MASUK - BARANG DITINGGAL",
                          },
                          { value: "2", label: "SERVICE MASUK - LANGSUNG" },
                        ].find((option) => option.value === serviceStatus)
                      : null
                  }
                />
              </div>

              <div className="form-group">
                <input
                  type="checkbox"
                  checked={serviceFinish}
                  onChange={() => setServiceFinish(!serviceFinish)}
                />
                <span className="ml-2 text-danger">
                  Tandai Service Ini Sebagai Selesai dan Tampilkan Form
                  Sparepart / Product / Jasa
                </span>
              </div>
            </div>

            {serviceFinish && (
              <>
                <hr />

                <div className="card p-3 shadow-lg mt-3">
                  <div className="table-responsive mt-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm mb-2"
                      onClick={() => {
                        if (branch !== "" && serviceFinish) {
                          setIsProductOpen(true);
                        } else {
                          setAlert({
                            status: true,
                            color: "danger",
                            message: "Pilih cabang terlebih dahulu",
                          });
                        }
                      }}
                    >
                      Tambah Produk
                    </button>

                    <table className="table table-sm table-striped table-bordered nowrap mb-5">
                      <thead>
                        <tr>
                          <th style={{ width: "1%", textAlign: "center" }}>
                            {" "}
                            NO{" "}
                          </th>
                          <th style={{ textAlign: "center" }}>
                            {" "}
                            PRODUK / JASA{" "}
                          </th>
                          <th style={{ width: "10%", textAlign: "center" }}>
                            QTY
                          </th>
                          <th style={{ width: "20%", textAlign: "center" }}>
                            PRICE
                          </th>
                          <th style={{ width: "25%", textAlign: "center" }}>
                            AMOUNT
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProduct.length === 0 ? (
                          <tr>
                            <td></td>
                          </tr>
                        ) : (
                          selectedProduct?.map(
                            (item: SelectedProduct, index: number) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name?.toUpperCase()}</td>
                                <td>{item.qty}</td>
                                <td>{item.price}</td>
                                <td>{item.price * item.qty}</td>
                              </tr>
                            )
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {isProductOpen && (
                  <ServiceProductList
                    isOpen={isProductOpen}
                    onClose={closeProductList}
                    accessToken={session!.accessToken}
                    branch={branch}
                    productList={selectedProduct}
                    deviceTypeData={deviceTypeData}
                  />
                )}
              </>
            )}
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
              onClick={step === 3 ? () => handleSubmit() : nextStep}
              disabled={
                step === 3
                  ? technician === "" || branch === "" || isLoadingSubmit
                  : false
              }
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

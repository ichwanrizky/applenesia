"use client";
import deviceServices from "@/services/deviceServices";
import libServices from "@/services/libServices";
import serviceServices from "@/services/serviceServices";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import Select from "react-select";
import ServiceProductList from "./ServiceProductList";

type Session = {
  name: string;
  id: number;
  username: string;
  role_id: number;
  role_name: string;
  accessToken: string;
  userBranch: any;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

type DeviceType = {
  id: number;
  name: string;
};

type Device = {
  id: number;
  name: string;
};

type ServiceDetail = {
  id: number;
  uuid: string;
  service_number: string;
  unique_code: string;
  customer_id: number;
  device_id: number;
  imei: string;
  service_desc: string;
  technician_id: number;
  branch_id: number;
  is_deleted: boolean;
  created_at: Date;
  created_by: number;
  month: number;
  year: number;
  service_status_id: number;
  customer: {
    id: number;
    name: string;
    telp: string;
    email: string;
  };
  device: {
    id: number;
    name: string;
    device_type: {
      id: number;
      name: string;
    };
  };
  service_status: {
    id: number;
    name: string;
    label_color: string;
  };
  user_created: {
    id: number;
    name: string;
  };
  user_technician: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    name: string;
  };
  service_product: any[];
  service_form_checking: {
    id: number;
    name: string;
    in_check: boolean;
    out_check: boolean;
    notes?: string;
    service_id: number;
  }[];
};

type FormChecking = {
  id: number;
  name: string;
  in_check: boolean;
  out_check: boolean;
  notes: string;
};

type Technician = {
  id: number;
  name: string;
};
const DetailServicePage = ({
  session,
  service_id,
  deviceTypeData,
}: {
  session: Session;
  service_id: string;
  deviceTypeData: DeviceType[];
}) => {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    customer_telp: "",
    customer_email: "",
    device_type_id: "",
    device_type_label: "",
    device_data: [],
    device_id: "",
    device_label: "",
    imei: "",
    service_desc: "",
    service_form_checking: [],
    branch: "",
    branch_name: "",
    technician_data: [],
    technician: "",
    service_status: "",
    products: [],
  });

  useEffect(() => {
    const getDetailService = async () => {
      try {
        const response = await serviceServices.getServiceById(
          session.accessToken!,
          service_id
        );

        if (!response.status) {
          setAlert({
            status: true,
            color: "danger",
            message: response.message,
          });
        } else {
          const data = response.data as ServiceDetail;

          await handleGetDevice({
            value: data.device.device_type.id,
            label: data.device.device_type.name || "",
          });

          await handleGetTechnician(data.branch_id);

          setFormData((prevFormData) => ({
            ...prevFormData,
            customer_id: data.customer.id.toString() || "",
            customer_name: data.customer.name?.toUpperCase() || "",
            customer_telp: data.customer.telp || "",
            customer_email: data.customer.email || "",
            device_type_id: data.device.device_type.id.toString() || "",
            device_type_label:
              data.device.device_type.name?.toUpperCase() || "",
            device_id: data.device.id.toString() || "",
            device_label: data.device.name?.toUpperCase() || "",
            imei: data.imei || "",
            service_desc: data.service_desc || "",
            service_form_checking: (data.service_form_checking as any) || [],
            branch: data.branch_id.toString() || "",
            branch_name: data.branch.name?.toUpperCase() || "",
            technician: data.technician_id.toString() || "",
            service_status: data.service_status.id.toString() || "",
            products: (data.service_product as any) || [],
          }));
        }
      } catch (error) {
        setAlert({
          status: true,
          color: "danger",
          message: "Something went wrong, please refresh and try again",
        });
      } finally {
        setIsLoadingPage(false);
      }
    };

    getDetailService();
  }, []);

  const handleGetDevice = async (deviceType: {
    value: number;
    label: string;
  }) => {
    if (!deviceType) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        device_type_id: "",
        device_type_label: "",
        device_data: [],
        device_id: "",
        device_label: "",
      }));
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      device_type_id: deviceType.value?.toString(),
      device_type_label: deviceType.label,
      device_data: [],
      device_id: "",
      device_label: "",
    }));
    try {
      const result = await deviceServices.getDeviceByType(
        session.accessToken!,
        Number(deviceType.value)
      );
      if (!result.status) {
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          device_type_id: deviceType.value?.toString(),
          device_type_label: deviceType.label,
          device_data: result.data,
          device_id: "",
          device_label: "",
        }));
      }
    } catch (error) {}
  };

  const handleGetTechnician = async (branch: number) => {
    const result = await libServices.getTechnician(
      session.accessToken!,
      Number(branch)
    );

    if (result.status) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        technician_data: result.data,
      }));
    }
  };

  const handleCheck = (id: number, field: "in_check" | "out_check") => {
    setFormData({
      ...formData,
      service_form_checking: formData.service_form_checking?.map(
        (e: FormChecking) =>
          e.id === id
            ? {
                ...e,
                [field]: !e[field],
              }
            : e
      ) as any,
    });
  };

  const handleDescCheck = (id: number, notes: string) => {
    setFormData({
      ...formData,
      service_form_checking: formData.service_form_checking?.map(
        (e: FormChecking) =>
          e.id === id
            ? {
                ...e,
                notes: notes,
              }
            : e
      ) as any,
    });
  };

  const handleCheckAll = (field: "in_check" | "out_check") => {
    setFormData({
      ...formData,
      service_form_checking: formData.service_form_checking?.map(
        (e: FormChecking) => ({
          ...e,
          [field]: !e[field],
        })
      ) as any,
    });
  };

  const closeProductList = (selectedProduct: any) => {
    setIsProductOpen(false);
    setFormData({ ...formData, products: selectedProduct });
  };

  const handleUpdateQtySelectedProduct = (id: number, qty: number) => {
    setFormData({
      ...formData,
      products: formData.products?.map((item: any) => {
        if (item.id === id) {
          return {
            ...item,
            qty: qty,
          };
        }
        return item;
      }) as any,
    });
  };

  const handleRemoveSelectedProduct = (id: number) => {
    setFormData({
      ...formData,
      products: formData.products?.filter((item: any) => item.id !== id) as any,
    });
  };

  if (isLoadingPage) {
    return (
      <div className="text-center">
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        />{" "}
        Loading...
      </div>
    );
  }

  if (alert?.status) {
    return (
      <div className={`alert alert-${alert.color}`} role="alert">
        {alert.message}
      </div>
    );
  }

  const optionsDeviceType = deviceTypeData?.map((e) => ({
    label: e.name?.toUpperCase(),
    value: e.id,
  }));

  const optionsDevice = formData.device_data?.map((e: Device) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  const optionsTechnician = formData.technician_data?.map((e: Technician) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  return (
    <div className="row">
      <div className="col-md-10 offset-md-1">
        <div className="card">
          <div className="card-body">
            <h3>
              ID: <span className="text-primary fw-bold">{service_id}</span>
            </h3>
            <hr />

            <div className="tab-content p-2">
              <form id="step3Form">
                <div className="card p-3 shadow-lg mt-3">
                  <div className="form-group">
                    <div className="row">
                      <div className="col-sm-6">
                        <label htmlFor="service_customer_name">Nama</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ textTransform: "uppercase" }}
                          id="service_customer_name"
                          value={formData.customer_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customer_name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-sm-3">
                        <label htmlFor="service_customer_telp">Telp</label>
                        <input
                          type="number"
                          className="form-control"
                          id="service_customer_telp"
                          value={formData.customer_telp}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customer_telp: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-sm-3">
                        <label htmlFor="service_customer_email">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="service_customer_email"
                          value={formData.customer_email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customer_email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="row">
                      <div className="col-sm-3">
                        <label htmlFor="service_device_type">Tipe Device</label>
                        <Select
                          instanceId="service_device_type"
                          placeholder="Pilih Tipe Device"
                          isClearable
                          required
                          options={optionsDeviceType}
                          onChange={(e: any) => {
                            handleGetDevice(e);
                          }}
                          value={
                            formData.device_type_id
                              ? optionsDeviceType.find(
                                  (option: any) =>
                                    option.value ===
                                    Number(formData.device_type_id)
                                )
                              : null
                          }
                        />
                      </div>
                      <div className="col-sm-3">
                        <label htmlFor="service_device">Device</label>
                        <Select
                          instanceId="service_device"
                          placeholder="Pilih Device"
                          isClearable
                          required
                          options={optionsDevice}
                          onChange={(e: any) =>
                            setFormData({
                              ...formData,
                              device_id: e ? e.value : "",
                              device_label: e ? e.label : "",
                            })
                          }
                          value={
                            formData.device_id
                              ? optionsDevice.find(
                                  (option: any) =>
                                    option.value === Number(formData.device_id)
                                )
                              : null
                          }
                        />
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="service_imei">IMEI</label>
                        <input
                          type="text"
                          className="form-control"
                          id="service_imei"
                          style={{ textTransform: "uppercase" }}
                          value={formData.imei}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              imei: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="service_desc">Deskripsi Kerusakan</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      id="service_desc"
                      style={{ textTransform: "uppercase" }}
                      value={formData.service_desc}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          service_desc: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/*  */}
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
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            SPAREPART
                          </th>
                          <th style={{ width: "8%", textAlign: "center" }}>
                            IN
                            <br />
                            <input
                              type="checkbox"
                              onChange={() => handleCheckAll("in_check")}
                              checked={formData.service_form_checking.every(
                                (e: FormChecking) => e.in_check
                              )}
                            />
                          </th>
                          <th style={{ width: "8%", textAlign: "center" }}>
                            OUT <br />
                            <input
                              type="checkbox"
                              onChange={() => handleCheckAll("out_check")}
                              checked={formData.service_form_checking.every(
                                (e: FormChecking) => e.out_check
                              )}
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
                        {formData.service_form_checking.length === 0 ? (
                          <tr>
                            <td colSpan={5} align="center">
                              Tidak ada data
                            </td>
                          </tr>
                        ) : (
                          formData.service_form_checking?.map(
                            (item: FormChecking, index: number) => (
                              <tr key={index}>
                                <td align="center">{index + 1}</td>
                                <td>{item.name}</td>
                                <td align="center">
                                  <input
                                    type="checkbox"
                                    checked={item.in_check}
                                    onChange={() =>
                                      handleCheck(item.id, "in_check")
                                    }
                                  />
                                </td>
                                <td align="center">
                                  <input
                                    type="checkbox"
                                    checked={item.out_check}
                                    onChange={() =>
                                      handleCheck(item.id, "out_check")
                                    }
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
                            )
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/*  */}
                <div className="card p-3 shadow-lg mt-3">
                  <div className="form-group mb-3">
                    <label htmlFor="service_branch">Cabang</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.branch_name}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="service_technician">Teknisi</label>
                    <Select
                      instanceId="service_technician"
                      placeholder="Pilih Teknisi"
                      isClearable
                      required
                      options={optionsTechnician}
                      onChange={(e: any) =>
                        setFormData({
                          ...formData,
                          technician: e ? e.value : "",
                        })
                      }
                      value={
                        formData.technician
                          ? optionsTechnician.find(
                              (option: any) =>
                                option.value === Number(formData.technician)
                            )
                          : null
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="service_status">Status Service</label>
                    <Select
                      instanceId="service_status"
                      placeholder="Pilih Status Service"
                      isClearable
                      required
                      options={[
                        {
                          value: "1",
                          label: "SERVICE MASUK - BARANG DITINGGAL",
                        },
                        { value: "2", label: "SERVICE MASUK - LANGSUNG" },
                        {
                          value: "3",
                          label: "SERVICE SELESAI - BARANG SUDAH DIAMBIL",
                        },
                        {
                          value: "4",
                          label: "SERVICE SELESAI - BARANG BELUM DIAMBIL",
                        },
                        { value: "5", label: "SERVICE BATAL/CANCEL" },
                      ]}
                      onChange={(e: any) =>
                        setFormData({
                          ...formData,
                          service_status: e ? e.value : "",
                        })
                      }
                      value={
                        formData.service_status
                          ? [
                              {
                                value: "1",
                                label: "SERVICE MASUK - BARANG DITINGGAL",
                              },
                              { value: "2", label: "SERVICE MASUK - LANGSUNG" },
                              {
                                value: "3",
                                label: "SERVICE SELESAI - BARANG SUDAH DIAMBIL",
                              },
                              {
                                value: "4",
                                label: "SERVICE SELESAI - BARANG BELUM DIAMBIL",
                              },
                              { value: "5", label: "SERVICE BATAL/CANCEL" },
                            ].find(
                              (option) =>
                                option.value === formData.service_status
                            )
                          : null
                      }
                    />
                  </div>

                  <hr />

                  <div className="card p-3 shadow-lg mt-3">
                    <div className="table-responsive mt-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm mb-2"
                        onClick={() => {
                          setIsProductOpen(true);
                        }}
                      >
                        Tambah Produk
                      </button>
                      <table className="table table-sm table-striped table-bordered nowrap mb-5">
                        <thead>
                          <tr>
                            <th
                              style={{ width: "1%", textAlign: "center" }}
                            ></th>
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
                          {formData.products.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center">
                                Tidak Ada Data
                              </td>
                            </tr>
                          ) : (
                            formData.products?.map(
                              (item: any, index: number) => (
                                <tr key={index}>
                                  <td className="align-middle text-center">
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() =>
                                        handleRemoveSelectedProduct(item.id)
                                      }
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </td>
                                  <td className="align-middle text-center">
                                    {index + 1}
                                  </td>
                                  <td className="align-middle">
                                    {item.name?.toUpperCase()}
                                  </td>
                                  <td className="align-middle text-center">
                                    {item.is_product ? (
                                      <NumericFormat
                                        className="form-control form-control-sm text-center"
                                        value={item.qty}
                                        thousandSeparator=","
                                        displayType="input"
                                        onValueChange={(values: any) => {
                                          if (values.floatValue !== undefined) {
                                            handleUpdateQtySelectedProduct(
                                              item.id,
                                              values.floatValue
                                            );
                                          }
                                        }}
                                        allowLeadingZeros={false}
                                        allowNegative={false}
                                        required
                                      />
                                    ) : (
                                      item.qty
                                    )}
                                  </td>
                                  <td className="align-middle" align="right">
                                    {`Rp. ${item.price?.toLocaleString(
                                      "id-ID"
                                    )}`}
                                  </td>
                                  <td className="align-middle" align="right">
                                    {`Rp. ${(
                                      item.price * item.qty
                                    )?.toLocaleString("id-ID")}`}
                                  </td>
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
                      accessToken={session.accessToken!}
                      branch={formData.branch}
                      productList={formData.products}
                      deviceTypeData={deviceTypeData}
                    />
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="card-footer text-end">
            <button className="btn btn-primary" type="button">
              Save Changes
            </button>

            <button className="btn btn-success ml-2" type="button">
              Create Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailServicePage;

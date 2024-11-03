"use client";
import deviceServices from "@/services/deviceServices";
import { useEffect, useState } from "react";
import Select from "react-select";

type ServiceCreateStep1Props = {
  accessToken: string;
  handleLoadingHeader: (status: boolean) => void;
  handleAlert: (status: boolean, color: string, message: string) => void;
  handleFormChange: (updatedFormData: any) => void;
  deviceTypeData: DeviceType[];
  customerData: Customer[];
};

type Customer = {
  id: number;
  name: string;
  telp: string;
  email: string;
};

type DeviceType = {
  id: number;
  name: string;
};

type Device = {
  id: number;
  name: string;
};

const ServiceCreateStep1 = (props: ServiceCreateStep1Props) => {
  const {
    accessToken,
    handleLoadingHeader,
    handleAlert,
    handleFormChange,
    deviceTypeData,
    customerData,
  } = props;

  const [deviceData, setDeviceData] = useState([] as Device[]);

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
  });

  useEffect(() => {
    handleFormChange(formData);
  }, [formData]);

  const handleGetDevice = async (deviceType: string) => {
    handleLoadingHeader(true);
    try {
      const result = await deviceServices.getDeviceByType(
        accessToken,
        Number(deviceType)
      );

      if (!result.status) {
        handleAlert(
          true,
          "danger",
          result.message ? result.message : "Something went wrong"
        );
      }

      setDeviceData(result.data);
    } catch (error) {
      handleAlert(
        true,
        "danger",
        "Something went wrong, please refresh and try again"
      );
    } finally {
      handleLoadingHeader(false);
    }
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
  return (
    <form id="step1Form">
      <h5>Step 1: Informasi Customer</h5>

      <div className="form-group mb-3">
        <label htmlFor="service_customer_id">List Customer</label>
        <Select
          instanceId="service_customer_id"
          placeholder="Pilih Customer"
          isClearable
          required={formData.customer_name !== "" ? false : true}
          options={optionsCustomer}
          onChange={(e: any) =>
            setFormData({ ...formData, customer_id: e ? e.value : "" })
          }
          value={
            formData.customer_id
              ? optionsCustomer.find(
                  (option: any) => option.value === formData.customer_id
                )
              : null
          }
        />
      </div>

      <div className="form-group">
        <div className="row">
          <div className="col-sm-6">
            <label htmlFor="service_customer_name">Nama</label>
            <input
              type="text"
              className="form-control"
              id="service_customer_name"
              value={formData.customer_name}
              style={{ textTransform: "uppercase" }}
              onChange={(e) =>
                setFormData({ ...formData, customer_name: e.target.value })
              }
              required
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
                setFormData({ ...formData, customer_telp: e.target.value })
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
                setFormData({ ...formData, customer_email: e.target.value })
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
                setFormData({
                  ...formData,
                  device_type: e ? e.value : "",
                  device_type_label: e ? e.label : "",
                  device: "",
                  device_label: "",
                });

                if (e) {
                  handleGetDevice(e.value);
                }
              }}
              value={
                formData.device_type
                  ? optionsDeviceType.find(
                      (option: any) => option.value === formData.device_type
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
                  device: e ? e.value : "",
                  device_label: e ? e.label : "",
                })
              }
              value={
                formData.device
                  ? optionsDevice.find(
                      (option: any) => option.value === formData.device
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
              required
              onChange={(e) =>
                setFormData({ ...formData, imei: e.target.value })
              }
              value={formData.imei}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="service_description">Deskripsi Kerusakan</label>
        <textarea
          className="form-control"
          rows={4}
          id="service_description"
          style={{ textTransform: "uppercase" }}
          required
          value={formData.service_desc}
          onChange={(e) =>
            setFormData({ ...formData, service_desc: e.target.value })
          }
        />
      </div>
    </form>
  );
};

export default ServiceCreateStep1;

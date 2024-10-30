"use client";
import libServices from "@/services/libServices";
import { useEffect, useState } from "react";
import Select from "react-select";

type ServiceCreateStep3Props = {
  accessToken: string;
  handleLoadingHeader: (status: boolean) => void;
  handleAlert: (status: boolean, color: string, message: string) => void;
  handleFormChange: (updatedFormData: any) => void;
  parentFormData: any;
  branchData: Branch[];
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

const ServiceCreateStep3 = (props: ServiceCreateStep3Props) => {
  const {
    accessToken,
    handleLoadingHeader,
    handleAlert,
    handleFormChange,
    parentFormData,
    branchData,
  } = props;

  const [techncianData, setTechncianData] = useState([] as Technician[]);
  const [formData, setFormData] = useState({
    branch: "",
    technician: "",
    service_status: "1",
  });

  useEffect(() => {
    handleFormChange(formData);
  }, [formData]);

  const handleGetTechnician = async (branch: number) => {
    handleLoadingHeader(true);
    try {
      const result = await libServices.getTechnician(
        accessToken,
        Number(branch)
      );

      if (!result.status) {
        handleAlert(true, "danger", result.message);
      }

      setTechncianData(result.data);
    } catch (error) {
      handleAlert(true, "danger", "Something went wrong");
    } finally {
      handleLoadingHeader(false);
    }
  };

  const optionsBranch = branchData?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  const optionsTechnician = techncianData?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  return (
    <form id="step3Form">
      <h5>Step 3: Confirmation</h5>
      {/*  */}
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
                value={parentFormData.customer_name}
                disabled
              />
            </div>
            <div className="col-sm-3">
              <label htmlFor="service_customer_telp">Telp</label>
              <input
                type="number"
                className="form-control"
                id="service_customer_telp"
                value={parentFormData.customer_telp}
                disabled
              />
            </div>
            <div className="col-sm-3">
              <label htmlFor="service_customer_email">Email</label>
              <input
                type="email"
                className="form-control"
                id="service_customer_email"
                value={parentFormData.customer_email}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="row">
            <div className="col-sm-3">
              <label htmlFor="service_device_type">Tipe Device</label>
              <input
                type="text"
                className="form-control"
                style={{ textTransform: "uppercase" }}
                id="service_device_type"
                value={parentFormData.device_type_label}
                disabled
              />
            </div>
            <div className="col-sm-3">
              <label htmlFor="service_device">Device</label>
              <input
                type="text"
                className="form-control"
                style={{ textTransform: "uppercase" }}
                id="service_device"
                value={parentFormData.device_label}
                disabled
              />
            </div>
            <div className="col-sm-6">
              <label htmlFor="service_imei">IMEI</label>
              <input
                type="text"
                className="form-control"
                id="service_imei"
                style={{ textTransform: "uppercase" }}
                value={parentFormData.imei}
                disabled
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
            value={parentFormData.service_desc}
            disabled
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
                <th style={{ textAlign: "center", verticalAlign: "middle" }}>
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
              {parentFormData.service_form_checking.length === 0 ? (
                <tr>
                  <td colSpan={5} align="center">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                parentFormData.service_form_checking?.map(
                  (item: FormChecking, index: number) => (
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
          <label htmlFor="service_branch">Pilih Cabang</label>
          <Select
            instanceId="service_branch"
            placeholder="Pilih Cabang"
            isClearable
            required
            options={optionsBranch}
            onChange={(e: any) => {
              setTechncianData([]);
              setFormData({ ...formData, branch: e ? e.value : "" });
              if (e) {
                handleGetTechnician(e.value);
              }
            }}
            value={
              formData.branch
                ? optionsBranch.find(
                    (option: any) => option.value === formData.branch
                  )
                : null
            }
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
              setFormData({ ...formData, technician: e ? e.value : "" })
            }
            value={
              formData.technician
                ? optionsTechnician.find(
                    (option: any) => option.value === formData.technician
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
              { value: "1", label: "SERVICE MASUK - BARANG DITINGGAL" },
              { value: "2", label: "SERVICE MASUK - LANGSUNG" },
            ]}
            onChange={(e: any) =>
              setFormData({ ...formData, service_status: e ? e.value : "" })
            }
            value={
              formData.service_status
                ? [
                    {
                      value: "1",
                      label: "SERVICE MASUK - BARANG DITINGGAL",
                    },
                    { value: "2", label: "SERVICE MASUK - LANGSUNG" },
                  ].find((option) => option.value === formData.service_status)
                : null
            }
          />
        </div>

        {/* <div className="form-group">
          <input
            type="checkbox"
            checked={serviceFinish}
            onChange={() => setServiceFinish(!serviceFinish)}
          />
          <span className="ml-2 text-danger">
            Tandai Service Ini Sebagai Selesai dan Tampilkan Form Sparepart /
            Product / Jasa
          </span>
        </div> */}
      </div>
    </form>
  );
};

export default ServiceCreateStep3;

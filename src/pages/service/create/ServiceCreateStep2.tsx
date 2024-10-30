"use client";

import { useEffect, useState } from "react";

type ServiceCreateStep2Props = {
  accessToken: string;
  handleLoadingHeader: (status: boolean) => void;
  handleAlert: (status: boolean, color: string, message: string) => void;
  handleFormChange: (updatedFormData: any) => void;
  listFormCheckData: FormChecking[];
};

type FormChecking = {
  id: number;
  name: string;
  in_check: boolean;
  out_check: boolean;
  notes: string;
};
const ServiceCreateStep2 = (props: ServiceCreateStep2Props) => {
  const {
    accessToken,
    handleLoadingHeader,
    handleAlert,
    handleFormChange,
    listFormCheckData,
  } = props;

  const [listFormCheck, setListFormCheck] = useState(
    listFormCheckData as FormChecking[]
  );

  const formData = {
    service_form_checking: listFormCheck,
  };

  useEffect(() => {
    handleFormChange(formData);
  }, [listFormCheck]);

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
              <th style={{ textAlign: "center", verticalAlign: "middle" }}>
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
                      onChange={(e) => handleDescCheck(item.id, e.target.value)}
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
};

export default ServiceCreateStep2;

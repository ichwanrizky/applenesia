"use client";
import CustomButton from "@/components/CustomButton";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import CustomAlert from "@/components/CustomAlert";
import Pagination from "@/components/Pagination";
import React from "react";
import SearchInput from "@/components/SearchInput";
import BranchOptions from "@/components/BranchOptions";
import { useRouter } from "next/navigation";
import serviceServices from "@/services/serviceServices";
import invoiceService from "@/services/invoiceService";
import sendWhatsappMessage from "@/libs/WhatsappService";

type Session = {
  name: string;
  id: number;
  username: string;
  role_id: number;
  role_name: string;
  accessToken: string;
  userBranch: any;
};

type isLoadingProps = {
  [key: number]: boolean;
};

type Service = {
  number: number;
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
    name: string;
  };
  user_technician: {
    name: string;
  };
  invoice_service: {
    invoice: {
      invoice_number: string;
    };
  }[];
};
type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const ServicePage = ({ session }: { session: Session | null }) => {
  const { push } = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [isLoadingAction, setIsLoadingAction] = useState<isLoadingProps>({});
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [branchAccess, setBranchAccess] = useState(
    session?.role_name === "ADMINISTRATOR"
      ? "all"
      : session?.userBranch.length > 0
      ? session?.userBranch[0].branch.id?.toString()
      : ""
  );
  const [listCreateInvoice, setListCreateInvoice] = useState([] as string[]);
  const accessToken = session?.accessToken;

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null); // Set alert back to null after 2 seconds
      }, 2000);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [alert]);

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingAction({ ...isLoadingAction, [id]: true });
      try {
        const result = await serviceServices.deleteService(accessToken!, id);
        if (!result.status) {
          setAlert({
            status: true,
            color: "danger",
            message: result.message,
          });
        } else {
          setAlert({
            status: true,
            color: "success",
            message: result.message,
          });
          setCurrentPage(1);
          setSearch("");
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/service?branchaccess=${branchAccess}&page=1`
          );
        }
      } catch (error) {
        setAlert({
          status: true,
          color: "danger",
          message: "Something went wrong, please refresh and try again",
        });
      } finally {
        setIsLoadingAction({ ...isLoadingAction, [id]: false });
      }
    }
  };

  const handleCreateInvoice = (id: string) => {
    if (listCreateInvoice.includes(id)) {
      setListCreateInvoice(listCreateInvoice.filter((item) => item !== id));
    } else {
      setListCreateInvoice([...listCreateInvoice, id]);
    }
  };

  const handleSubmitInvoice = async () => {
    if (branchAccess === "all") {
      setAlert({
        status: true,
        color: "warning",
        message: "Please select cabang",
      });
      return;
    }

    if (confirm("Create invoice?")) {
      setIsLoadingAction({ ...isLoadingAction, [0]: true });
      try {
        const result = await invoiceService.createInvoiceBulk(
          accessToken!,
          JSON.stringify({
            branch: branchAccess,
            list_service_id: listCreateInvoice,
          })
        );

        if (!result.status) {
          setAlert({
            status: true,
            color: "danger",
            message: result.message,
          });

          return;
        }
        setAlert({
          status: true,
          color: "success",
          message: result.message,
        });
        setCurrentPage(1);
        setSearch("");
        mutate(
          `${process.env.NEXT_PUBLIC_API_URL}/api/service?branchaccess=${branchAccess}&page=1`
        );
        push(`invoice/${result.data.invoice_number}`);
      } catch (error) {
        setAlert({
          status: true,
          color: "danger",
          message: "something went wrong, please refresh and try again",
        });
      } finally {
        setIsLoadingAction({ ...isLoadingAction, [0]: false });
      }
    }
  };

  const sendMessage = async (service: Service) => {
    try {
      const response = await sendWa(service);
      if (response) {
        setAlert({
          status: true,
          color: "success",
          message: "Pesan berhasil dikirim",
        });
      } else {
        setAlert({
          status: true,
          color: "danger",
          message: "Pesan gagal dikirim",
        });
      }
    } catch (error) {
      setAlert({
        status: true,
        color: "danger",
        message: "something went wrong, please refresh and try again",
      });
    }
  };

  const sendWa = async (service: Service) => {
    const message =
      `*Notifikasi | Applenesia* \n\n` +
      `Halo, *${service.customer.name?.toUpperCase()}*,\n\n` +
      `Kami ingin menginformasikan bahwa layanan servis Anda telah diterbitkan dengan detail sebagai berikut:\n\n` +
      `🔧 *Service No*: *${service.service_number}*\n` +
      `🔐 *Service Code*: *${service.unique_code}*\n\n` +
      `📱 *Perangkat*: *${service.device.name}*\n` +
      `📝 *Deskripsi Kerusakan*: *${service.service_desc}*\n` +
      `📌 *Status*: *${service.service_status.name?.toUpperCase()}*\n\n` +
      `Untuk memtracking status servis Anda, silakan klik tautan di bawah ini:\n` +
      `🔗 *${process.env.NEXT_PUBLIC_API_URL}/portal/tracking?service_number=${service.service_number}&service_code=${service.unique_code}*\n\n` +
      `Terima kasih atas kepercayaan Anda kepada kami.\n\n` +
      `Salam,\n` +
      `Applenesia Team\n\n`;

    const response = await sendWhatsappMessage(service.customer.telp, message);
    return response;
  };

  const fetcher = (url: RequestInfo) => {
    return fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 60,
      },
    }).then((res) => res.json());
  };

  const { data, error, isLoading } = useSWR(
    debouncedSearch === ""
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/service?branchaccess=${branchAccess}&page=${currentPage}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/service?branchaccess=${branchAccess}&page=${currentPage}&search=${debouncedSearch}`,
    fetcher
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    setListCreateInvoice([]);
  }, [branchAccess]);

  return (
    <>
      <div className="row">
        <BranchOptions
          userBranch={session?.userBranch}
          role={session?.role_name}
          setBranchAccess={setBranchAccess}
        />
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {alert?.status && (
                <CustomAlert message={alert.message} color={alert.color} />
              )}

              {!error && data?.status && (
                <div className="row flex-between-center mb-4">
                  <div className="col-sm-8 col-sm-auto d-flex align-items-center pe-0">
                    <SearchInput search={search} setSearch={setSearch} />
                  </div>
                  <div className="col-sm-4 col-sm-auto d-flex justify-content-end">
                    {listCreateInvoice.length > 0 && (
                      <>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleSubmitInvoice}
                        >
                          Create Invoice
                        </button>
                        <span className="ml-2" />
                      </>
                    )}
                    <CustomButton
                      buttonType="add"
                      isLoading={false}
                      disabled={false}
                      children="Tambah Data"
                      onClick={() => push("service/create")}
                    />
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="text-center">
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Loading...
                </div>
              ) : error || !data.status ? (
                <div className="text-center">
                  <CustomAlert
                    message={
                      data?.message &&
                      `Error (): ${data?.message} - please refresh the page or login again`
                    }
                    color="danger"
                  />
                </div>
              ) : (
                (() => {
                  const ITEMS_PER_PAGE = data?.itemsPerPage;
                  const MAX_PAGINATION = 5;
                  const TOTAL_PAGES = Math.ceil(data?.total / ITEMS_PER_PAGE);

                  const items = data?.data;

                  return (
                    <>
                      <div className="table-responsive">
                        <table className="table table-sm table-striped table-bordered nowrap mb-5">
                          <thead>
                            <tr>
                              <th style={{ width: "1%", textAlign: "center" }}>
                                AKSI
                              </th>
                              <th style={{ width: "1%", textAlign: "center" }}>
                                AKSI
                              </th>
                              <th style={{ width: "1%", textAlign: "center" }}>
                                NO
                              </th>
                              <th style={{ width: "1%", textAlign: "center" }}>
                                SERVICEID
                              </th>
                              <th style={{ width: "1%", textAlign: "center" }}>
                                INVOICE
                              </th>
                              <th style={{ width: "12%", textAlign: "center" }}>
                                CUSTOMER
                              </th>
                              <th style={{ width: "10%", textAlign: "center" }}>
                                IMEI
                              </th>
                              <th style={{ textAlign: "center" }}>DESC</th>
                              <th style={{ width: "10%", textAlign: "center" }}>
                                DEVICE
                              </th>
                              <th style={{ width: "10%", textAlign: "center" }}>
                                STATUS
                              </th>
                              <th style={{ width: "5%", textAlign: "center" }}>
                                TEKNISI
                              </th>
                              <th style={{ width: "5%", textAlign: "center" }}>
                                CREATED
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan={12} align="center">
                                  Tidak ada data
                                </td>
                              </tr>
                            ) : (
                              items.map((item: Service, index: number) => (
                                <tr key={index}>
                                  <td align="center" className="align-middle">
                                    {item.invoice_service.length === 0 && (
                                      <CustomButton
                                        buttonType="delete"
                                        indexData={index}
                                        isLoading={isLoadingAction[item.id]}
                                        onDelete={() => handleDelete(item.id)}
                                      >
                                        <i className="mdi mdi-trash-can-outline" />
                                      </CustomButton>
                                    )}
                                  </td>
                                  <td align="center" className="align-middle">
                                    <button
                                      type="button"
                                      className="btn btn-outline-success btn-sm"
                                      onClick={() => sendMessage(item)}
                                    >
                                      NOTIF
                                    </button>
                                  </td>
                                  <td align="center" className="align-middle">
                                    {item.number}
                                  </td>
                                  <td
                                    align="center"
                                    className="align-middle"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    <span
                                      role="button"
                                      onClick={() => {
                                        push(`service/${item.service_number}`);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        color: "#007bff",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      {item.service_number}
                                    </span>
                                  </td>
                                  <td
                                    align="center"
                                    className="align-middle"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    {item.invoice_service.length > 0 ? (
                                      <span
                                        role="button"
                                        onClick={() => {
                                          push(
                                            `invoice/${item.invoice_service[0].invoice.invoice_number}`
                                          );
                                        }}
                                        style={{
                                          cursor: "pointer",
                                          color: "#007bff",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        {item.invoice_service[0].invoice.invoice_number?.toUpperCase()}
                                      </span>
                                    ) : (
                                      (item.service_status_id === 2 ||
                                        item.service_status_id === 3 ||
                                        item.service_status_id === 4) && (
                                        <input
                                          type="checkbox"
                                          onChange={() =>
                                            handleCreateInvoice(
                                              item.service_number
                                            )
                                          }
                                        />
                                      )
                                    )}
                                  </td>
                                  <td align="left" className="align-middle">
                                    {item.customer.name?.toUpperCase()} <br />
                                    {item.customer.telp}
                                  </td>
                                  <td align="center" className="align-middle">
                                    {item.imei?.toUpperCase()}
                                  </td>
                                  <td align="left" className="align-middle">
                                    {item.service_desc?.toUpperCase()}
                                  </td>
                                  <td align="center" className="align-middle">
                                    {item.device.name?.toUpperCase()}
                                  </td>
                                  <td align="center" className="align-middle">
                                    <span
                                      className={`text-${item.service_status.label_color}`}
                                      dangerouslySetInnerHTML={{
                                        __html: item.service_status.name
                                          ?.toUpperCase()
                                          .split(" - ")
                                          .map(
                                            (line) =>
                                              `<div style="line-height: 1.5;">${line}</div>`
                                          )
                                          .join(""),
                                      }}
                                    />
                                  </td>
                                  <td align="center" className="align-middle">
                                    {item.user_technician.name?.toUpperCase()}
                                  </td>
                                  <td align="center" className="align-middle">
                                    <span>
                                      {item.user_created.name?.toUpperCase()}
                                    </span>
                                    <br />
                                    <span style={{ whiteSpace: "nowrap" }}>
                                      {new Date(item.created_at)
                                        .toLocaleString("id-ID", {
                                          timeZone: "UTC",
                                          day: "numeric",
                                          month: "numeric",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          second: "2-digit",
                                          hour12: false,
                                        })
                                        .replace(/\./g, ":")}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {TOTAL_PAGES > 0 && (
                        <div className="d-flex align-items-center justify-content-center">
                          <Pagination
                            currentPage={currentPage}
                            TOTAL_PAGES={TOTAL_PAGES}
                            MAX_PAGINATION={MAX_PAGINATION}
                            setCurrentPage={setCurrentPage}
                          />
                        </div>
                      )}
                    </>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicePage;

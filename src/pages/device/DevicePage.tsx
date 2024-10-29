"use client";
import CustomButton from "@/components/CustomButton";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import CustomAlert from "@/components/CustomAlert";
import Pagination from "@/components/Pagination";
import React from "react";
import CreateDevice from "./DeviceCreate";
import EditDevice from "./DeviceEdit";
import deviceServices from "@/services/deviceServices";
import SearchInput from "@/components/SearchInput";

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

type Device = {
  number: number;
  id: number;
  name: string;
  device_type_id: number;
  device_type: DeviceType;
};

type DeviceType = {
  id: number;
  name: string;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const DevicePage = ({
  session,
  deviceTypeData,
}: {
  session: Session | null;
  deviceTypeData: DeviceType[];
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({} as Device);
  const [isLoadingAction, setIsLoadingAction] = useState<isLoadingProps>({});
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deviceType, setDeviceType] = useState("all");
  const accessToken = session?.accessToken;

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingAction({ ...isLoadingAction, [id]: true });
      try {
        const resultDelete = await deviceServices.deleteDevice(
          accessToken!,
          id
        );

        if (!resultDelete.status) {
          setAlert({
            status: true,
            color: "danger",
            message: resultDelete.message,
          });
        } else {
          setAlert({
            status: true,
            color: "success",
            message: resultDelete.message,
          });
          setCurrentPage(1);
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/device?device_type=${deviceType}&page=1`
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

  const handleEdit = async (id: number) => {
    setIsLoadingAction({ ...isLoadingAction, [id]: true });
    try {
      const resultGetById = await deviceServices.getDeviceById(
        accessToken!,
        id
      );
      if (!resultGetById.status) {
        setAlert({
          status: true,
          color: "danger",
          message: resultGetById.message,
        });
      } else {
        setIsEditOpen(true);
        setEditData(resultGetById.data);
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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/device?device_type=${deviceType}&page=${currentPage}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/device?device_type=${deviceType}&page=${currentPage}&search=${debouncedSearch}`,
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
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {alert?.status && (
                <CustomAlert message={alert.message} color={alert.color} />
              )}

              {!error && data?.status && (
                <div className="row flex-between-center mb-4">
                  <div className="col-sm-8 col-sm-auto d-flex align-items-center pe-0">
                    <select
                      className="custom-select custom-select-sm w-auto mr-2"
                      onChange={(e) => setDeviceType(e.target.value)}
                      value={deviceType === "all" ? "all" : deviceType}
                    >
                      <option value="all">SEMUA</option>
                      {deviceTypeData?.map((item, index: number) => (
                        <option value={item.id} key={index}>
                          {item.name?.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <SearchInput search={search} setSearch={setSearch} />
                  </div>
                  <div className="col-sm-4 col-sm-auto d-flex justify-content-end">
                    <CustomButton
                      buttonType="add"
                      isLoading={false}
                      disabled={false}
                      children="Tambah Data"
                      onClick={() => setIsCreateOpen(true)}
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
                    isDismissable={true}
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
                                NO
                              </th>
                              <th style={{ textAlign: "center" }}>DEVICE</th>
                              <th style={{ textAlign: "center", width: "20%" }}>
                                TIPE DEVICE
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan={4} align="center">
                                  Tidak ada data
                                </td>
                              </tr>
                            ) : (
                              items.map((item: Device, index: number) => (
                                <tr key={index}>
                                  <td align="center" className="align-middle">
                                    <CustomButton
                                      buttonType="action"
                                      indexData={index}
                                      isLoading={isLoadingAction[item.id]}
                                      onDelete={() => handleDelete(item.id)}
                                      onEdit={() => handleEdit(item.id)}
                                    >
                                      <i className="mdi mdi-chevron-down" />
                                    </CustomButton>
                                  </td>
                                  <td align="center" className="align-middle">
                                    {item.number}
                                  </td>
                                  <td align="left" className="align-middle">
                                    {item.name}
                                  </td>
                                  <td align="center" className="align-middle">
                                    {item.device_type.name?.toUpperCase()}
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

                      {isCreateOpen && (
                        <CreateDevice
                          isOpen={isCreateOpen}
                          onClose={() => {
                            setIsCreateOpen(false);
                            mutate(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/device?device_type=${deviceType}&page=1`
                            );
                          }}
                          accessToken={accessToken!}
                          deviceType={deviceTypeData}
                        />
                      )}
                      {isEditOpen && (
                        <EditDevice
                          isOpen={isEditOpen}
                          onClose={() => {
                            setIsEditOpen(false);
                            mutate(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/device?device_type=${deviceType}&page=1`
                            );
                          }}
                          accessToken={accessToken!}
                          deviceType={deviceTypeData}
                          editData={editData}
                        />
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

export default DevicePage;

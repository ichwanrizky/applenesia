"use client";
import CustomButton from "@/components/CustomButton";
import { useEffect, useState } from "react";
import CreateCabang from "./CabangCreate";
import useSWR, { mutate } from "swr";
import CustomAlert from "@/components/CustomAlert";
import Pagination from "@/components/Pagination";
import cabangServices from "@/services/cabangServices";
import EditCabang from "./CabangEdit";

type Session = {
  name: string;
  id: number;
  username: string;
  role_id: number;
  role_name: string;
  accessToken: string;
};

type isLoadingProps = {
  [key: number]: boolean;
};

type Branch = {
  number: number;
  id: number;
  uuid: string;
  name: string;
  address: string;
  alias: string;
  telp: string;
  email: string;
  is_deleted: boolean;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const CabangPage = ({ session }: { session: Session | null }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({} as Branch);
  const [isLoadingAction, setIsLoadingAction] = useState<isLoadingProps>({});
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
        const resultDelete = await cabangServices.deleteCabang(
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
          setSearch("");
          mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/cabang?page=1`);
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
      const resultEdit = await cabangServices.getCabangById(accessToken!, id);
      if (!resultEdit.status) {
        setAlert({
          status: true,
          color: "danger",
          message: resultEdit.message,
        });
      } else {
        setIsEditOpen(true);
        setEditData(resultEdit.data);
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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/cabang?page=${currentPage}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/cabang?page=${currentPage}&search=${debouncedSearch}`,
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
                    <input
                      className="form-control form-control-sm"
                      placeholder="Search"
                      type="text"
                      style={{ width: 180 }}
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                    />
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
                              <th style={{ width: "5%", textAlign: "center" }}>
                                NO
                              </th>
                              <th style={{ width: "20%", textAlign: "center" }}>
                                CABANG
                              </th>
                              <th style={{ textAlign: "center" }}>ALIAS</th>
                              <th style={{ width: "13%", textAlign: "center" }}>
                                TELP
                              </th>
                              <th style={{ width: "13%", textAlign: "center" }}>
                                EMAIL
                              </th>
                              <th style={{ textAlign: "center" }}>ALAMAT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan={7} align="center">
                                  Tidak ada data
                                </td>
                              </tr>
                            ) : (
                              items.map((item: Branch, index: number) => (
                                <tr key={index}>
                                  <td className="align-middle" align="center">
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
                                  <td className="align-middle">
                                    {item.name?.toUpperCase()}
                                  </td>
                                  <td className="align-middle" align="center">
                                    {item.alias?.toUpperCase()}
                                  </td>
                                  <td className="align-middle" align="center">
                                    {item.telp}
                                  </td>
                                  <td className="align-middle" align="center">
                                    {item.email}
                                  </td>
                                  <td className="align-middle">
                                    {item.address}
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
                        <CreateCabang
                          isOpen={isCreateOpen}
                          onClose={() => {
                            setIsCreateOpen(false);
                            setSearch("");
                            mutate(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/cabang?page=${currentPage}`
                            );
                          }}
                          accessToken={accessToken!}
                        />
                      )}
                      {isEditOpen && (
                        <EditCabang
                          isOpen={isEditOpen}
                          onClose={() => {
                            setIsEditOpen(false);
                            setSearch("");
                            mutate(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/cabang?page=${currentPage}`
                            );
                          }}
                          accessToken={accessToken!}
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

export default CabangPage;

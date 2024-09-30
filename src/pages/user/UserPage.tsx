"use client";
import CustomButton from "@/components/CustomButton";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import CustomAlert from "@/components/CustomAlert";
import Pagination from "@/components/Pagination";
import CreateUser from "./UserCreate";
import userServices from "@/services/userServices";
import EditUser from "./UserEdit";
import React from "react";
type Session = {
  user: UserSession;
};
type UserSession = {
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

type Users = {
  number: number;
  id: number;
  username: string;
  password: string;
  name: string;
  telp: string;
  created_at: Date;
  is_deleted: boolean;
  role_id: number;
  user_branch: {
    branch: Branch;
    branch_id: number;
    user_id: number;
  }[];
  role: Role;
};

type Role = {
  id: number;
  name: string;
};

type Branch = {
  number: number;
  id: number;
  uuid: string;
  name: string;
  address: string;
  alias: string;
  telp: string;
  latitude: null;
  longitude: null;
  is_deleted: boolean;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const UserPage = ({ session }: { session: Session | null }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setisEditOpen] = useState(false);
  const [editData, setEditData] = useState({} as Users);
  const [isLoadingAction, setIsLoadingAction] = useState<isLoadingProps>({});
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const accessToken = session!.user.accessToken;

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingAction({ ...isLoadingAction, [id]: true });
      try {
        const result = await userServices.deleteUser(accessToken, id);

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
          mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/user?page=1`);
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
      const result = await userServices.getUserById(accessToken, id);
      if (!result.status) {
        setAlert({
          status: true,
          color: "danger",
          message: result.message,
        });
      } else {
        setisEditOpen(true);
        setEditData(result.data);
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

  const handleResetPassword = async (id: number) => {
    if (confirm("Reset Password this user?")) {
      try {
        const result = await userServices.resetPassword(accessToken, id);

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
          mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/user?page=1`);
        }
      } catch (error) {
        setAlert({
          status: true,
          color: "danger",
          message: "Something went wrong, please refresh and try again",
        });
      }
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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/user?page=${currentPage}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/user?page=${currentPage}&search=${debouncedSearch}`,
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
                                Aksi
                              </th>
                              <th style={{ width: "1%", textAlign: "center" }}>
                                No
                              </th>
                              <th>Nama</th>
                              <th>Username</th>
                              <th>Telp</th>
                              <th>Role</th>
                              <th>Manage Cabang</th>
                              <th style={{ width: "1%", textAlign: "center" }}>
                                Reset Password
                              </th>
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
                              items.map((item: Users, index: number) => (
                                <tr key={index}>
                                  <td align="center">
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
                                    {item.username}
                                  </td>
                                  <td className="align-middle" align="center">
                                    {item.telp}
                                  </td>
                                  <td className="align-middle">
                                    {item.role.name?.toUpperCase()}
                                  </td>
                                  <td className="align-middle">
                                    {item.user_branch?.map(
                                      (branch, indexBranch) => (
                                        <React.Fragment key={indexBranch}>
                                          * {branch.branch?.name?.toUpperCase()}{" "}
                                          <br />
                                        </React.Fragment>
                                      )
                                    )}
                                  </td>
                                  <td className="align-middle" align="center">
                                    <button
                                      className="btn btn-sm btn-info"
                                      type="button"
                                      onClick={() =>
                                        handleResetPassword(item.id)
                                      }
                                    >
                                      Reset
                                    </button>
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
                        <CreateUser
                          isOpen={isCreateOpen}
                          onClose={() => {
                            setIsCreateOpen(false);
                            mutate(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/user?page=${currentPage}`
                            );
                          }}
                          accessToken={accessToken}
                          dataCabang={data.cabang as Branch[]}
                        />
                      )}
                      {isEditOpen && (
                        <EditUser
                          isOpen={isEditOpen}
                          onClose={() => {
                            setisEditOpen(false);
                            mutate(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/user?page=${currentPage}`
                            );
                          }}
                          accessToken={accessToken}
                          dataCabang={data.cabang as Branch[]}
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

export default UserPage;

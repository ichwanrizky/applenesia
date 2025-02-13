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
import invoiceService from "@/services/invoiceService";

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

type Transaction = {
  number: number;
  id: number;
  desc: string;
  payment_id: number;
  nominal: number;
  type: string;
  created_at: Date;
  created_by: number;
  branch_id: number;
  is_deleted: boolean;
  user_created: {
    id: number;
    name: string;
  };
  payment: {
    id: number;
    name: string;
  };
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const TransactionPage = ({ session }: { session: Session | null }) => {
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
        const result = await invoiceService.deleteInvoice(accessToken!, id);
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
            `${process.env.NEXT_PUBLIC_API_URL}/api/invoice?branchaccess=${branchAccess}&page=1`
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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/transaction?branchaccess=${branchAccess}&page=${currentPage}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/transaction?branchaccess=${branchAccess}&page=${currentPage}&search=${debouncedSearch}`,
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
                              {/* <th style={{ width: "5%", textAlign: "center" }}>
                                AKSI
                              </th> */}
                              <th style={{ width: "5%", textAlign: "center" }}>
                                NO
                              </th>
                              <th style={{ width: "30%", textAlign: "center" }}>
                                DESC
                              </th>
                              <th style={{ width: "10%", textAlign: "center" }}>
                                ACCOUNT
                              </th>
                              <th style={{ width: "10%", textAlign: "center" }}>
                                NOMINAL
                              </th>
                              <th style={{ width: "10%", textAlign: "center" }}>
                                TYPE
                              </th>
                              <th style={{ width: "15%", textAlign: "center" }}>
                                CREATED
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
                              items.map((item: Transaction, index: number) => (
                                <tr key={index}>
                                  <td align="center" className="align-middle">
                                    {item.number}
                                  </td>
                                  <td align="left" className="align-middle">
                                    {item.desc?.toUpperCase()}
                                  </td>
                                  <td align="center" className="align-middle">
                                    {item.payment.name?.toUpperCase()}
                                  </td>
                                  <td align="center" className="align-middle">
                                    {`Rp. ${item.nominal.toLocaleString(
                                      "id-ID"
                                    )}`}
                                  </td>
                                  <td align="center" className="align-middle">
                                    {item.type === "INCOME" && (
                                      <span
                                        className="badge badge-soft-success"
                                        style={{ fontSize: "16px" }}
                                      >
                                        INCOME
                                      </span>
                                    )}
                                    {item.type === "EXPENSE" && (
                                      <span
                                        className="badge badge-soft-danger"
                                        style={{ fontSize: "16px" }}
                                      >
                                        EXPENSE
                                      </span>
                                    )}
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

export default TransactionPage;

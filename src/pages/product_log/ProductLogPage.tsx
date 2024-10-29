"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import CustomAlert from "@/components/CustomAlert";
import Pagination from "@/components/Pagination";
import React from "react";
import BranchOptions from "@/components/BranchOptions";
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

type ProductLog = {
  number: number;
  id: number;
  product_id: number;
  qty: number;
  type: string;
  created_at: Date;
  created_by: number;
  desc: string;
  product: {
    name: string;
    sub_name: string;
  };
  user_created: {
    name: string;
  };
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const ProductLogPage = ({ session }: { session: Session | null }) => {
  const [currentPage, setCurrentPage] = useState(1);

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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/product_log?branchaccess=${branchAccess}&page=${currentPage}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/product_log?branchaccess=${branchAccess}&page=${currentPage}&search=${debouncedSearch}`,
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
                    isDismissable={false}
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
                                NO
                              </th>
                              <th style={{ textAlign: "left" }}>PRODUK</th>
                              <th style={{ width: "5%", textAlign: "center" }}>
                                IN/OUT
                              </th>
                              <th style={{ width: "5%", textAlign: "center" }}>
                                QTY
                              </th>
                              <th style={{ width: "20%", textAlign: "left" }}>
                                KET
                              </th>
                              <th style={{ width: "10%", textAlign: "center" }}>
                                TANGGAL
                              </th>
                              <th style={{ width: "10%", textAlign: "left" }}>
                                USER
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan={8} align="center">
                                  Tidak ada data
                                </td>
                              </tr>
                            ) : (
                              items.map((item: ProductLog, index: number) => (
                                <tr key={index}>
                                  <td align="center" className="align-middle">
                                    {item.number}
                                  </td>
                                  <td align="left" className="align-middle">
                                    {item.product.name?.toUpperCase()}
                                    {item.product.sub_name &&
                                      ` - ${item.product.sub_name?.toUpperCase()}`}
                                  </td>
                                  <td align="center" className="align-middle">
                                    {item.type === "IN" ? (
                                      <span className="badge badge-success">
                                        IN
                                      </span>
                                    ) : (
                                      <span className="badge badge-danger">
                                        OUT
                                      </span>
                                    )}
                                  </td>
                                  <td align="center" className="align-middle">
                                    {item.qty}
                                  </td>
                                  <td align="left" className="align-middle">
                                    {item.desc?.toUpperCase()}
                                  </td>
                                  <td align="center" className="align-middle">
                                    {new Date(item.created_at).toLocaleString(
                                      "id-ID",
                                      {
                                        timeZone: "UTC",
                                      }
                                    )}
                                  </td>
                                  <td align="left" className="align-middle">
                                    {item.user_created.name?.toUpperCase()}
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

export default ProductLogPage;

"use client";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import CustomAlert from "@/components/CustomAlert";
import Pagination from "@/components/Pagination";
import React from "react";
import BranchOptions from "@/components/BranchOptions";
import SearchInput from "@/components/SearchInput";
import CustomButton from "@/components/CustomButton";
import EditProductInventory from "./ProductInventoryEdit";
import productServices from "@/services/productServices";

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

type ProductInventory = {
  number: number;
  id: number;
  name: string;
  sub_name: string;
  stock: number;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const ProductInventoryPage = ({ session }: { session: Session | null }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [isLoadingAction, setIsLoadingAction] = useState<isLoadingProps>({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({} as ProductInventory);
  const [editType, setEditType] = useState("");
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

  const handleEdit = async (id: number, type: string) => {
    setIsLoadingAction({ ...isLoadingAction, [id]: true });
    try {
      const resultGetById = await productServices.getProductInventoryById(
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
        setEditType(type);
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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/product_inventory?branchaccess=${branchAccess}&page=${currentPage}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/product_inventory?branchaccess=${branchAccess}&page=${currentPage}&search=${debouncedSearch}`,
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
                              <th style={{ width: "1%", textAlign: "center" }}>
                                NO
                              </th>
                              <th style={{ textAlign: "left" }}>PRODUK</th>
                              <th style={{ width: "15%", textAlign: "center" }}>
                                JUM STOCK
                              </th>
                              <th style={{ width: "5%", textAlign: "center" }}>
                                IN
                              </th>
                              <th style={{ width: "5%", textAlign: "center" }}>
                                OUT
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
                              items.map(
                                (item: ProductInventory, index: number) => (
                                  <tr key={index}>
                                    <td align="center" className="align-middle">
                                      {item.number}
                                    </td>
                                    <td align="left" className="align-middle">
                                      {item.name?.toUpperCase()}
                                      {item.sub_name &&
                                        ` - ${item.sub_name?.toUpperCase()}`}
                                    </td>
                                    <td align="center" className="align-middle">
                                      {item.stock}
                                    </td>
                                    <td align="center" className="align-middle">
                                      <CustomButton
                                        buttonType="in"
                                        indexData={index}
                                        isLoading={isLoadingAction[item.id]}
                                        onEdit={() => handleEdit(item.id, "IN")}
                                      >
                                        <i className="mdi mdi-plus" />
                                      </CustomButton>
                                    </td>
                                    <td align="center" className="align-middle">
                                      <CustomButton
                                        buttonType="out"
                                        indexData={index}
                                        isLoading={isLoadingAction[item.id]}
                                        onEdit={() =>
                                          handleEdit(item.id, "OUT")
                                        }
                                      >
                                        <i className="mdi mdi-minus" />
                                      </CustomButton>
                                    </td>
                                  </tr>
                                )
                              )
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

                      {isEditOpen && (
                        <EditProductInventory
                          isOpen={isEditOpen}
                          onClose={() => {
                            setIsEditOpen(false);
                            mutate(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/category?page=1`
                            );
                          }}
                          accessToken={accessToken!}
                          editData={editData}
                          editType={editType}
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

export default ProductInventoryPage;

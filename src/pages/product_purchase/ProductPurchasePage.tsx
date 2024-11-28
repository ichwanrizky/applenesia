"use client";
import CustomButton from "@/components/CustomButton";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import CustomAlert from "@/components/CustomAlert";
import Pagination from "@/components/Pagination";
import React from "react";
import BranchOptions from "@/components/BranchOptions";
import libServices from "@/services/libServices";
import SearchInput from "@/components/SearchInput";
import CreateProductPurchase from "./ProductPurchaseCreate";
import productPurchaseServices from "@/services/productPurchaseServices";
import EditProductPurchase from "./ProductPurchaseEdit";

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

type ProductPurchase = {
  number: number;
  id: number;
  product_id: number;
  qty: number;
  price: number;
  created_at: Date;
  created_by: number;
  payment_id: number;
  product: {
    id: number;
    name: string;
    sub_name: string;
    branch_id: number;
  };
  payment: {
    id: number;
    name: string;
  };
  user_created: {
    id: number;
    name: string;
  };
};

type ProductInventory = {
  id: number;
  name: string;
  sub_name: string;
  stock: number;
};

type PaymentMethod = {
  id: number;
  name: string;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const ProductPurchasePage = ({ session }: { session: Session | null }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({} as ProductPurchase);
  const [productData, setProductData] = useState([] as ProductInventory[]);
  const [paymentData, setPaymentData] = useState([] as PaymentMethod[]);
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

  const handleCreate = async () => {
    if (branchAccess === "all") {
      setAlert({
        status: true,
        color: "warning",
        message: "Please select cabang",
      });
      return;
    }
    setIsLoadingAction({ ...isLoadingAction, [0]: true });
    try {
      const resultGetProduct = await libServices.getProductInventory(
        accessToken!,
        branchAccess
      );
      const resultGetPaymentMethod = await libServices.getPaymentMethod(
        accessToken!
      );
      if (!resultGetProduct.status || !resultGetPaymentMethod.status) {
        setAlert({
          status: true,
          color: "danger",
          message: resultGetProduct.status
            ? resultGetProduct.message
            : resultGetPaymentMethod.message,
        });
      } else {
        setIsCreateOpen(true);
        setProductData(resultGetProduct.data);
        setPaymentData(resultGetPaymentMethod.data);
      }
    } catch (error) {
      setAlert({
        status: true,
        color: "danger",
        message: "Something went wrong, please refresh and try again",
      });
    } finally {
      setIsLoadingAction({ ...isLoadingAction, [0]: false });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingAction({ ...isLoadingAction, [id]: true });
      try {
        const resultDelete =
          await productPurchaseServices.deleteProductPurchase(accessToken!, id);
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
            `${process.env.NEXT_PUBLIC_API_URL}/api/product_purchase?branchaccess=${branchAccess}&page=1`
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
      const resultGetById =
        await productPurchaseServices.getProductPurchaseById(accessToken!, id);
      const resultGetPaymentMethod = await libServices.getPaymentMethod(
        accessToken!
      );

      if (!resultGetById.status || !resultGetPaymentMethod.status) {
        setAlert({
          status: true,
          color: "danger",
          message: resultGetById.status
            ? resultGetById.message
            : resultGetPaymentMethod.message,
        });
      } else {
        setIsEditOpen(true);
        setEditData(resultGetById.data);
        setPaymentData(resultGetPaymentMethod.data);
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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/product_purchase?branchaccess=${branchAccess}&page=${currentPage}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/product_purchase?branchaccess=${branchAccess}&page=${currentPage}&search=${debouncedSearch}`,
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
                  <div className="col-sm-4 col-sm-auto d-flex justify-content-end">
                    <CustomButton
                      buttonType="add"
                      isLoading={isLoadingAction[0]}
                      disabled={false}
                      children="Tambah Data"
                      onClick={handleCreate}
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
                                NO
                              </th>
                              <th style={{ textAlign: "left" }}>PRODUK</th>
                              <th style={{ width: "5%", textAlign: "center" }}>
                                QTY
                              </th>
                              <th style={{ width: "15%", textAlign: "right" }}>
                                TOTAL PRICE
                              </th>
                              <th style={{ width: "15%", textAlign: "center" }}>
                                PAYMENT
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
                              items.map(
                                (item: ProductPurchase, index: number) => (
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
                                      {item.product.name?.toUpperCase()}
                                      {item.product.sub_name &&
                                        ` - ${item.product.sub_name?.toUpperCase()}`}
                                    </td>
                                    <td align="center" className="align-middle">
                                      {item.qty}
                                    </td>
                                    <td align="right" className="align-middle">
                                      {item.price?.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        maximumFractionDigits: 0,
                                      })}
                                    </td>
                                    <td align="center" className="align-middle">
                                      {item.payment.name?.toUpperCase()}
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

                      {isCreateOpen && (
                        <CreateProductPurchase
                          isOpen={isCreateOpen}
                          onClose={() => {
                            setIsCreateOpen(false);
                            mutate(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/product_purchase?branchaccess=${branchAccess}&page=1`
                            );
                          }}
                          accessToken={accessToken!}
                          branch={branchAccess}
                          productData={productData}
                          paymentData={paymentData}
                        />
                      )}
                      {isEditOpen && (
                        <EditProductPurchase
                          isOpen={isEditOpen}
                          onClose={() => {
                            setIsEditOpen(false);
                            mutate(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/product_purchase?branchaccess=${branchAccess}&page=1`
                            );
                          }}
                          accessToken={accessToken!}
                          paymentData={paymentData}
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

export default ProductPurchasePage;

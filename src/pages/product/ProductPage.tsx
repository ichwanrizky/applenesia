"use client";
import CustomButton from "@/components/CustomButton";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import CustomAlert from "@/components/CustomAlert";
import Pagination from "@/components/Pagination";
import React from "react";
import BranchOptions from "@/components/BranchOptions";
import CreateProduct from "./ProductCreate";
import libServices from "@/services/libServices";
import SearchInput from "@/components/SearchInput";
import productServices from "@/services/productServices";
import EditProduct from "./ProductEdit";

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

type Product = {
  number: number;
  id: number;
  name: string;
  sub_name: string;
  sell_price: number;
  purchase_price: number;
  warranty: number;
  is_inventory: boolean;
  is_pos: boolean;
  product_type: string;
  created_at: Date;
  is_deleted: boolean;
  branch_id: number;
  product_category: {
    category: {
      id: number;
      name: string;
    };
  }[];
  product_device: {
    device: {
      id: number;
      name: string;
      device_type: {
        id: number;
        name: string;
      };
    };
  }[];
  branch: {
    id: number;
    name: string;
  };
};

type Category = {
  id: number;
  name: string;
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

const ProductPage = ({ session }: { session: Session | null }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({} as Product);
  const [categoryData, setCategoryData] = useState([] as Category[]);
  const [deviceTypeData, setDeviceTypeData] = useState([] as DeviceType[]);
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
      const resultGetCategory = await libServices.getCategory(accessToken!);
      const resultGetDeviceType = await libServices.getDeviceType(accessToken!);

      if (!resultGetCategory.status || !resultGetDeviceType.status) {
        setAlert({
          status: true,
          color: "danger",
          message: resultGetCategory.status
            ? resultGetCategory.message
            : resultGetDeviceType.message,
        });
      } else {
        setIsCreateOpen(true);
        setCategoryData(resultGetCategory.data);
        setDeviceTypeData(resultGetDeviceType.data);
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
        const resultDelete = await productServices.deleteProduct(
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
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/product?branchaccess=${branchAccess}&page=1`
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
      const resultGetById = await productServices.getProductById(
        accessToken!,
        id
      );

      const resultGetCategory = await libServices.getCategory(accessToken!);
      const resultGetDeviceType = await libServices.getDeviceType(accessToken!);

      if (
        !resultGetById.status ||
        !resultGetCategory.status ||
        !resultGetDeviceType.status
      ) {
        setAlert({
          status: true,
          color: "danger",
          message: resultGetById.status
            ? resultGetById.message
            : resultGetCategory.message
            ? resultGetCategory.message
            : resultGetDeviceType.message,
        });
      } else {
        setIsEditOpen(true);
        setEditData(resultGetById.data);
        setCategoryData(resultGetCategory.data);
        setDeviceTypeData(resultGetDeviceType.data);
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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/product?branchaccess=${branchAccess}&page=${currentPage}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/product?branchaccess=${branchAccess}&page=${currentPage}&search=${debouncedSearch}`,
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
                              <th style={{ width: "8%", textAlign: "center" }}>
                                TIPE
                              </th>
                              <th style={{ width: "20%", textAlign: "center" }}>
                                KATEGORI
                              </th>
                              <th style={{ width: "20%", textAlign: "center" }}>
                                DEVICE
                              </th>
                              <th style={{ width: "10%", textAlign: "right" }}>
                                HARGA JUAL
                              </th>
                              <th style={{ width: "5%", textAlign: "center" }}>
                                GARANSI
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
                              items.map((item: Product, index: number) => (
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
                                    {item.name?.toUpperCase()}
                                    {item.sub_name &&
                                      ` - ${item.sub_name?.toUpperCase()}`}
                                  </td>
                                  <td align="center" className="align-middle">
                                    {item.product_type}
                                  </td>
                                  <td align="center" className="align-middle">
                                    {item.product_category
                                      ?.map((e) =>
                                        e.category.name?.toUpperCase()
                                      )
                                      .join(", ")}
                                  </td>
                                  <td
                                    align="center"
                                    className="align-middle"
                                    style={{
                                      maxWidth: "100px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {item.product_device
                                      ?.map((e) => e.device.name?.toUpperCase())
                                      .join(", ")}
                                  </td>
                                  <td
                                    align="right"
                                    className="align-middle"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    {`Rp. ${item.sell_price?.toLocaleString(
                                      "id-ID"
                                    )}`}
                                  </td>
                                  <td align="center" className="align-middle">
                                    {`${item.warranty} Hari`}
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
                        <CreateProduct
                          isOpen={isCreateOpen}
                          onClose={() => {
                            setIsCreateOpen(false);
                            setSearch("");
                            mutate(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/product?branchaccess=${branchAccess}&page=1`
                            );
                          }}
                          accessToken={accessToken!}
                          branch={branchAccess}
                          categoryData={categoryData}
                          deviceTypeData={deviceTypeData}
                        />
                      )}
                      {isEditOpen && (
                        <EditProduct
                          isOpen={isEditOpen}
                          onClose={() => {
                            setIsEditOpen(false);
                            setSearch("");
                            mutate(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/product?branchaccess=${branchAccess}&page=1`
                            );
                          }}
                          accessToken={accessToken!}
                          categoryData={categoryData}
                          deviceTypeData={deviceTypeData}
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

export default ProductPage;

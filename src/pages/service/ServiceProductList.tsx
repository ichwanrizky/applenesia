"use client";
import CustomAlert from "@/components/CustomAlert";
import CustomButton from "@/components/CustomButton";
import { useEffect, useState } from "react";
import useSWR from "swr";

type Props = {
  isOpen: boolean;
  onClose: (selectedProduct?: any) => void;
  accessToken: string;
  branch: string;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

type ProductList = {
  id: number;
  name: string;
  sub_name: string;
  sell_price: number;
  warranty: number;
  product_device: {
    device: {
      id: number;
      name: string;
      device_type_id: number;
    };
  }[];
  product_log: {
    qty: number;
    type: string;
  }[];
  stock: number;
};

type SelectedProps = {
  [key: number]: boolean;
};

const ServiceProductList = (props: Props) => {
  const { isOpen, onClose, accessToken, branch } = props;

  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [name, setName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([] as any);
  const [isSelected, setIsSelected] = useState<SelectedProps>({});

  const handleAddProduct = (product: ProductList) => {
    if (product.product_log.length > 0) {
      if (product.stock <= 0) {
        setAlert({
          status: true,
          color: "danger",
          message: "Stock tidak mencukupi",
        });
        return;
      }
    }

    setIsSelected({ ...isSelected, [product.id]: true });
    setSelectedProduct([
      ...selectedProduct,
      {
        id: product.id,
        name: product.name,
        sub_name: product.sub_name,
        price: product.sell_price,
        qty: 1,
        warranty: product.warranty,
        is_product: product.product_log.length > 0 ? true : false,
      },
    ]);
  };

  const handleRemoveProduct = (product: ProductList) => {
    setIsSelected({ ...isSelected, [product.id]: false });
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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/libs/productlist?branch=${branch}&category=all&device_type=all`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/libs/productlist?branch=${branch}&category=all&device_type=all&search=${debouncedSearch}`,
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
    isOpen && (
      <>
        <div className="modal-backdrop fade show"></div>
        <div
          className="modal fade show"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalScrollableTitle"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
              <form>
                <div className="modal-header">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <h5
                      className="modal-title"
                      id="exampleModalScrollableTitle"
                    >
                      List Produk / Jasa
                    </h5>

                    {/* Add the alert below the title inside the modal-header */}
                    {alert?.status && (
                      <div className="mt-2">
                        <CustomAlert
                          message={alert.message}
                          color={alert.color}
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="close waves-effect waves-light"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={onClose}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>

                <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
                  <div className="modal-body">
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
                        const items = data?.data;

                        return (
                          <div className="row">
                            {items.length === 0 ? (
                              <div className="text-center">
                                Produk Tidak Tersedia
                              </div>
                            ) : (
                              items?.map((item: ProductList, index: number) => (
                                <div className="col-sm-4 mb-2" key={index}>
                                  <div className="card border">
                                    <div
                                      className="card-header"
                                      style={{ maxHeight: "55px" }}
                                    >
                                      <h6 className="card-title fs-8">
                                        {item.name?.toUpperCase()}
                                      </h6>
                                      {item.sub_name ? (
                                        <p
                                          className="text-muted small"
                                          style={{ marginTop: "-10px" }}
                                        >
                                          {item.sub_name?.toUpperCase()}
                                        </p>
                                      ) : (
                                        <p>&nbsp;</p>
                                      )}
                                    </div>
                                    <div className="card-body">
                                      <table width={"100%"}>
                                        <tbody>
                                          <tr>
                                            <td width={"100"}>Harga</td>
                                            <td width={"10"}>:</td>
                                            <td>
                                              {`Rp. ${item.sell_price?.toLocaleString(
                                                "id-ID"
                                              )}`}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Garansi</td>
                                            <td>:</td>
                                            <td>
                                              {item.warranty > 0
                                                ? `${item.warranty} Hari`
                                                : "Tidak Ada"}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Device</td>
                                            <td>:</td>
                                            <td
                                              style={{
                                                maxWidth: "100px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                position: "relative",
                                              }}
                                              title={item.product_device
                                                ?.map((e) =>
                                                  e.device.name?.toUpperCase()
                                                )
                                                .join(", ")}
                                            >
                                              {item.product_device
                                                ?.map((e) =>
                                                  e.device.name?.toUpperCase()
                                                )
                                                .join(", ")}
                                              <span
                                                style={{
                                                  position: "absolute",
                                                  top: "100%", // Position the tooltip below the cell
                                                  left: 0,
                                                  backgroundColor: "white",
                                                  padding: "5px",
                                                  borderRadius: "5px",
                                                  boxShadow:
                                                    "0px 0px 5px rgba(0,0,0,0.5)",
                                                  display: "none", // Initially hide the tooltip
                                                }}
                                              >
                                                {item.product_device
                                                  ?.map((e) =>
                                                    e.device.name?.toUpperCase()
                                                  )
                                                  .join(", ")}
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Jum Stock</td>
                                            <td>:</td>
                                            <td>
                                              {item.product_log.length > 0
                                                ? item.stock
                                                : "-"}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <div className="card-footer">
                                      {isSelected[item.id] ? (
                                        <button
                                          className="btn btn-danger btn-sm"
                                          type="button"
                                          onClick={() =>
                                            handleRemoveProduct(item)
                                          }
                                        >
                                          Cancel
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-success btn-sm"
                                          type="button"
                                          onClick={() => handleAddProduct(item)}
                                        >
                                          Select
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        );
                      })()
                    )}
                  </div>

                  <div className="modal-footer">
                    <CustomButton
                      buttonType="close"
                      onClick={() => onClose(selectedProduct)}
                    >
                      Close
                    </CustomButton>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default ServiceProductList;

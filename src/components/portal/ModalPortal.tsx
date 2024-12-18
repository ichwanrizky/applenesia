"use client";
import React, { use, useEffect, useState } from "react";
import Select from "react-select";

export default function ModalPortal({
  isOpen,
  onClose,
  deviceType,
  deviceData,
  productData,
}: {
  isOpen: boolean;
  onClose: () => void;
  deviceType: number | null;
  deviceData: { id: number; name: string; device_type_id: number }[];
  productData: {
    id: number;
    name: string;
    sell_price: number;
    product_device: {
      device_id: number;
    }[];
  }[];
}) {
  const [device, setDevice] = useState(
    null as {
      value: number;
      label: string;
    } | null
  );

  const [product, setProduct] = useState(
    [] as {
      value: number;
      label: string;
    }[]
  );
  const [total, setTotal] = useState(0);

  if (!isOpen) return null;

  const optionsProduct = productData
    .filter((item) =>
      item.product_device.some((pd) => pd.device_id === device?.value)
    )
    .map((item) => ({
      ...item,
      product_device: item.product_device.filter(
        (pd) => pd.device_id === device?.value
      ),
    }));

  useEffect(() => {
    const selectedProduct = product.map((item) => item.value);

    const totalPrice = optionsProduct
      .filter((item) => selectedProduct.includes(item.id))
      .reduce((total, item) => total + item.sell_price, 0);

    setTotal(totalPrice);
  }, [product]);

  const handleImage = (id: number) => {
    switch (id) {
      case 1:
        return <img src="/portal/assets/images_apn/iphone.png" alt="" />;
      case 2:
        return (
          <img
            src="/portal/assets/images_apn/ipad.png"
            alt=""
            style={{ height: 220 }}
          />
        );
      case 3:
        return (
          <img
            src="/portal/assets/images_apn/macbook.png"
            alt=""
            style={{ height: 160 }}
          />
        );

      default:
        return "";
    }
  };

  return (
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
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content p-4">
            <form>
              <div>
                <div className="modal-body">
                  {/* button close modal */}

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={onClose}
                    ></button>
                  </div>

                  <div>
                    <div className="row">
                      <div className="col-sm-5 text-center">
                        {handleImage(deviceType || 0)}
                      </div>
                      <div className="col-sm-6 ml-4">
                        <div className="form-group mb-4">
                          <label htmlFor="device">Device</label>
                          <Select
                            className="w-100"
                            instanceId="device"
                            placeholder="Pilih Device"
                            isClearable
                            options={deviceData.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))}
                            required
                            onChange={(e: any) => {
                              setProduct([]);
                              setDevice(e);
                            }}
                            value={device}
                          />
                        </div>
                        <div className="form-group mb-4">
                          <label htmlFor="product">List Product</label>
                          <Select
                            className="w-100"
                            instanceId="product"
                            placeholder="Pilih Product"
                            isClearable
                            options={optionsProduct?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))}
                            required
                            onChange={(e: any) => setProduct(e)}
                            isMulti
                            value={product}
                          />
                        </div>

                        <hr />
                        <div className="form-group mb-4 text-center">
                          <label htmlFor="product">
                            ESTIMASI HARGA:
                            <span className="fw-bold ms-4">
                              {`Rp. ${total?.toLocaleString("id-ID")}`}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

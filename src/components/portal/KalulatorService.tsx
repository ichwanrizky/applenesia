"use client";
import React, { useState } from "react";
import ModalPortal from "./ModalPortal";
import { getProduct } from "@/services/portalServices";

export default function KalulatorService({
  deviceData,
}: {
  deviceData: { id: number; name: string; device_type_id: number }[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceType, setDeviceType] = useState(null as number | null);
  const [productData, setProductData] = useState(
    [] as {
      id: number;
      name: string;
      sell_price: number;
      product_device: {
        device_id: number;
      }[];
    }[]
  );

  const handleOpenModal = async (deviceType: number) => {
    setIsLoading(true);
    try {
      const res = await getProduct(deviceType);
      if (res.length === 0) {
        // alert("Data not found");
        setDeviceType(deviceType);
        setIsModalOpen(true);
        setProductData(res);
      } else {
        setDeviceType(deviceType);
        setIsModalOpen(true);
        setProductData(res);
      }
    } catch (error) {
      alert("Something went wrong, Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="blog-feed-display-section section-inner-padding-100 blog-feed-dispaly-bg"
        id="kalkulator-service"
      >
        <div className="box-wrapper">
          <div className="section-wrapper">
            <div className="container">
              <div className="row">
                <div className="col-xl-7">
                  <div className="section-content section-content-gap-80">
                    <h6 className="section-tag tag-blue">Kalkulator Service</h6>
                    <h3 className="section-title">
                      Cek Estimasi Biaya Harga Service Kamu Disini.
                    </h3>
                    <span className="icon-seperator">
                      <img
                        src="/portal/assets/images/icons/section-seperator-shape.png"
                        alt=""
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="service-wrapper">
            <div className="container">
              <div className="row">
                {/* iPhone Card */}
                <div className="col-md-4" style={{ marginBottom: 20 }}>
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title" style={{ fontWeight: 800 }}>
                        iPhone
                      </h5>
                      <img
                        src="/portal/assets/images_apn/iphone.png"
                        alt="iPhone"
                        className="card-img-top"
                        style={{ height: 180, objectFit: "contain" }}
                      />
                      <div className="mt-4">
                        {isLoading ? (
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            disabled
                          >
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>{" "}
                            Loading ...
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => handleOpenModal(1)}
                          >
                            Cek Harga Service
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* MacBook Card */}
                <div className="col-md-4" style={{ marginBottom: 20 }}>
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title" style={{ fontWeight: 800 }}>
                        MacBook
                      </h5>
                      <img
                        src="/portal/assets/images_apn/macbook.png"
                        alt="MacBook"
                        className="card-img-top"
                        style={{ height: 180, objectFit: "contain" }}
                      />
                      <div className="mt-4">
                        {isLoading ? (
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            disabled
                          >
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>{" "}
                            Loading ...
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => handleOpenModal(3)}
                          >
                            Cek Harga Service
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* iPad Card */}
                <div className="col-md-4" style={{ marginBottom: 20 }}>
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title" style={{ fontWeight: 800 }}>
                        iPad
                      </h5>
                      <img
                        src="/portal/assets/images_apn/ipad.png"
                        alt="iPad"
                        className="card-img-top"
                        style={{ height: 180, objectFit: "contain" }}
                      />
                      <div className="mt-4">
                        {isLoading ? (
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            disabled
                          >
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>{" "}
                            Loading ...
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => handleOpenModal(2)}
                          >
                            Cek Harga Service
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ModalPortal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          deviceType={deviceType}
          deviceData={deviceData.filter(
            (device) => device.device_type_id === deviceType
          )}
          productData={productData}
        />
      )}
    </>
  );
}

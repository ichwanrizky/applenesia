"use client";
import PortalFooter from "@/components/portal/Footer";
import PortalHeader from "@/components/portal/Header";
import PortalLayout from "@/components/portal/Layout";
import portalServices from "@/services/portalServices";
import { useEffect, useState } from "react";

type TrackingService = {
  service_number: string;
  service_desc: string;
  device: {
    name: string;
  };
  service_status: {
    id: number;
    name: string;
  };
  invoice_service: {
    invoice_number: string;
    uuid: string;
  }[];
};

export default function PortalTracking({
  searchParams,
}: {
  searchParams: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [serviceNumber, setServiceNumber] = useState("");
  const [serviceCode, setServiceCode] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingService | null>();

  useEffect(() => {
    if (searchParams && Object.keys(searchParams).length > 0) {
      const { service_number, service_code } = searchParams;

      if (service_number && service_code) {
        setServiceNumber(service_number);
        setServiceCode(service_code);

        // Trigger data fetching
        fetchTrackingData(service_number, service_code);
      }
    }
  }, [searchParams]);

  const fetchTrackingData = async (
    serviceNumber: string,
    serviceCode: string
  ) => {
    setIsLoading(true);
    setTrackingData(null);
    try {
      const response = await portalServices.getTrackingService(
        serviceNumber,
        serviceCode
      );

      if (!response.status) {
        alert(response.message);
      } else {
        setTrackingData(response.data);
      }
    } catch (error) {
      alert("Something went wrong, please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchTrackingData(serviceNumber, serviceCode);
  };

  return (
    <PortalLayout>
      <main className="main-wrapper">
        <PortalHeader />
        <div className="breadcrumb-section">
          <div className="box-wrapper">
            <div className="breadcrumb-wrapper">
              <div className="container">
                <div className="row text-center">
                  <div className="col-12">
                    <h2 className="breadcrumb-title">Tracking Service</h2>
                    <ul className="breadcrumb-nav">
                      <li>
                        <a href={"/"}>Home</a>
                      </li>
                      <li>Tracking Service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section py-5 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-8 col-lg-10">
                {!(searchParams && Object.keys(searchParams).length > 0) && (
                  <div className="tracking-form-wrapper p-4 shadow rounded bg-white">
                    <h3 className="text-center mb-4">Track Your Service</h3>
                    <form className="default-form" onSubmit={handleSubmit}>
                      <div className="row g-3 align-items-center">
                        <div className="col-md-5">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Service Number"
                            onChange={(e) => setServiceNumber(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-5">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Service Code"
                            onChange={(e) => setServiceCode(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-2 d-grid">
                          {isLoading ? (
                            <button
                              className="btn btn-primary"
                              type="button"
                              disabled
                            >
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            </button>
                          ) : (
                            <button className="btn btn-primary" type="submit">
                              Track Now
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {trackingData && (
                  <div className="tracking-result-wrapper p-4 mt-4 bg-white shadow rounded">
                    <h4 className="text-center mb-3">
                      🔍 Hasil Tracking Service
                    </h4>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th style={{ width: "30%" }}>🔧 Nomor Servis:</th>
                            <td>{trackingData?.service_number || ""}</td>
                          </tr>
                          <tr>
                            <th>📱 Perangkat:</th>
                            <td>{trackingData?.device.name || ""}</td>
                          </tr>
                          <tr>
                            <th>📝 Deskripsi Kerusakan:</th>
                            <td>{trackingData?.service_desc || ""}</td>
                          </tr>
                          <tr>
                            <th>📌 Status:</th>
                            <td className="text-success">
                              {trackingData?.service_status.name?.toUpperCase() ||
                                ""}
                            </td>
                          </tr>
                          <tr>
                            <th>🧾 Invoice:</th>
                            <td>
                              {trackingData.invoice_service.length === 0 && (
                                <span className="text-danger">
                                  BELUM TERSEDIA
                                </span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <PortalFooter />
      </main>
    </PortalLayout>
  );
}

"use client";
import CustomButton from "@/components/CustomButton";
import { useState } from "react";
import CreateCabang from "./CabangCreate";
import useSWR, { mutate } from "swr";
import CustomAlert from "@/components/CustomAlert";
import Pagination from "@/components/Pagination";
import cabangServices from "@/services/cabangServices";

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

const CabangPage = ({ session }: { session: Session | null }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState<isLoadingProps>({});

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingAction({ ...isLoadingAction, [id]: true });
      try {
        const result = await cabangServices.deleteCabang(
          session!.user.accessToken,
          id
        );
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/cabang`);
      } catch (error) {
      } finally {
        setIsLoadingAction({ ...isLoadingAction, [id]: false });
      }
    }
  };

  const fetcher = (url: RequestInfo) => {
    return fetch(url, {
      headers: {
        authorization: `Bearer ${session?.user.accessToken}`,
      },
      next: {
        revalidate: 60,
      },
    }).then((res) => res.json());
  };

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cabang`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row flex-between-center mb-4">
                <div className="col-sm-8 col-sm-auto d-flex align-items-center pe-0">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Search"
                    type="text"
                    defaultValue=""
                    style={{ width: 180 }}
                  />
                </div>
                <div className="col-sm-4 col-sm-auto d-flex justify-content-end"></div>
              </div>

              <div className="text-center">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Loading...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row flex-between-center mb-4"></div>

              <div className="text-center">
                <CustomAlert
                  message={
                    data?.message &&
                    `Error (): ${data?.message} - please refresh the page`
                  }
                  color="danger"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ITEMS_PER_PAGE = data?.itemsPerPage;
  const MAX_PAGINATION = 5;
  const TOTAL_PAGES = Math.ceil(data?.total / ITEMS_PER_PAGE);

  const items = data?.data;

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row flex-between-center mb-4">
                <div className="col-sm-8 col-sm-auto d-flex align-items-center pe-0">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Search"
                    type="text"
                    defaultValue=""
                    style={{ width: 180 }}
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

              <div className="table-responsive">
                <table className="table table-sm table-striped table-bordered nowrap mb-5">
                  <thead>
                    <tr>
                      <th style={{ width: "1%", textAlign: "center" }}>Aksi</th>

                      <th style={{ width: "5%", textAlign: "center" }}>No</th>
                      <th>Nama Cabang</th>
                      <th style={{ textAlign: "center" }}>Alias</th>
                      <th>No Telp</th>
                      <th>Alamat</th>
                      <th>Lokasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items?.length === 0 ? (
                      <tr>
                        <td colSpan={7} align="center">
                          Tidak ada data
                        </td>
                      </tr>
                    ) : (
                      items.map((item: Branch, index: number) => (
                        <tr key={index}>
                          <td align="center">
                            <CustomButton
                              buttonType="action"
                              indexData={index}
                              isLoading={isLoadingAction[item.id]}
                              onDelete={() => handleDelete(item.id)}
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
                            {item.alias?.toUpperCase()}
                          </td>
                          <td className="align-middle">{item.telp}</td>
                          <td className="align-middle">{item.address}</td>
                          <td className="align-middle"></td>
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
                    currentPage={1}
                    TOTAL_PAGES={TOTAL_PAGES}
                    MAX_PAGINATION={MAX_PAGINATION}
                    setCurrentPage={() => {}}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isCreateOpen && (
        <CreateCabang
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </>
  );
};

export default CabangPage;

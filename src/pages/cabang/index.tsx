import ButtonAdd from "@/components/ButtonAdd";

const CabangPage = () => {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Data Cabang</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#">Pages</a>
                  </li>
                  <li className="breadcrumb-item active">Datatables</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
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
                    <ButtonAdd
                      isLoading={false}
                      disabled={false}
                      children="Tambah Data"
                    />
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm table-striped nowrap mb-5">
                    <thead>
                      <tr>
                        <th style={{ width: "5%" }}>No</th>
                        <th>Nama Cabang</th>
                        <th>Alias</th>
                        <th>No Telp</th>
                        <th>Alamat</th>
                        <th>Lokasi</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Applenesia Batam Center</td>
                        <td>Applenesia Batam Center</td>
                        <td>Applenesia Batam Center</td>
                        <td>Applenesia Batam Center</td>
                        <td>Applenesia Batam Center</td>
                        <td>Applenesia Batam Center</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="d-flex align-items-center justify-content-center">
                  <nav>
                    <ul className="pagination">
                      <li className="page-item">
                        <a
                          className="page-link waves-effect"
                          href="javascript: void(0);"
                          aria-label="Previous"
                        >
                          <span aria-hidden="true">«</span>
                          <span className="sr-only">Previous</span>
                        </a>
                      </li>
                      <li className="page-item">
                        <a
                          className="page-link waves-effect"
                          href="javascript: void(0);"
                        >
                          1
                        </a>
                      </li>
                      <li className="page-item">
                        <a
                          className="page-link waves-effect"
                          href="javascript: void(0);"
                        >
                          2
                        </a>
                      </li>
                      <li className="page-item active">
                        <a
                          className="page-link waves-effect"
                          href="javascript: void(0);"
                        >
                          3
                        </a>
                      </li>
                      <li className="page-item">
                        <a
                          className="page-link waves-effect"
                          href="javascript: void(0);"
                        >
                          4
                        </a>
                      </li>
                      <li className="page-item">
                        <a
                          className="page-link waves-effect"
                          href="javascript: void(0);"
                        >
                          5
                        </a>
                      </li>
                      <li className="page-item">
                        <a
                          className="page-link"
                          href="javascript: void(0);"
                          aria-label="Next"
                        >
                          <span aria-hidden="true">»</span>
                          <span className="sr-only">Next</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabangPage;

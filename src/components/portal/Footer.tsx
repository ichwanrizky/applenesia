const PortalFooter = () => {
  return (
    <>
      <footer className="footer-section section-top-gap-0 bg-dark text-light">
        <div className="box-wrapper">
          <div className="footer-top footer-top-style-1 py-5">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-6 mb-4 mb-lg-0">
                  <div className="footer-single-widget footer-about">
                    <h5 className="footer-title text-uppercase">Applenesia</h5>
                    <p>
                      Apakah Anda perlu memperbaiki perangkat Apple Anda dengan
                      cepat? Kunjungi cabang Applenesia kami di Batam. Anda
                      dapat datang langsung atau mengatur janji terlebih dahulu
                      untuk mendapatkan layanan perbaikan yang{" "}
                      <strong>sangat cepat</strong>. Kami dapat mengatasi hampir
                      semua masalah perangkat Apple dengan{" "}
                      <strong>keahlian yang unggul</strong>.
                    </p>
                    <p className="mt-3">
                      <strong>
                        Copyright © {new Date().getFullYear()} Applenesia. All
                        rights reserved.
                      </strong>
                    </p>
                    <div className="d-flex gap-3">
                      <a href="#" className="text-light">
                        <i className="icofont-facebook"></i>
                      </a>
                      <a href="#" className="text-light">
                        <i className="icofont-twitter"></i>
                      </a>
                      <a href="#" className="text-light">
                        <i className="icofont-instagram"></i>
                      </a>
                      <a href="#" className="text-light">
                        <i className="icofont-tiktok"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                  <div className="footer-single-widget footer-menu">
                    <h5 className="footer-title text-uppercase">Product</h5>
                    <ul className="footer-nav">
                      <li>
                        <a href="#" className="text-light text-decoration-none">
                          iPhone
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-light text-decoration-none">
                          iPad
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-light text-decoration-none">
                          MacBook
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-light text-decoration-none">
                          iWatch
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-light text-decoration-none">
                          AirPods
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="footer-single-widget footer-menu">
                    <h5 className="footer-title text-uppercase">Contact Us</h5>
                    <address>
                      Ruko Royal Sincom E-12, Batam, Indonesia, Kepulauan Riau
                    </address>
                    <p>
                      <strong>Phone:</strong> 0857-3333-3723
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom py-3">
            <div className="container">
              <div className="row justify-content-center justify-content-md-between align-items-center">
                <div className="col-auto">
                  <p className="copytight-text mb-0">
                    2024 © Applenesia. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <button className="material-scrolltop" type="button"></button>
    </>
  );
};

export default PortalFooter;

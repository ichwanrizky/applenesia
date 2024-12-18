import React from "react";

const PortalFooter = () => {
  const stores = [
    {
      id: 1,
      name: "Applenesia Batam",
      address: "Ruko Royal Sincom E-12, Batam, Kepulauan Riau, Indonesia",
      phone: "0857-3333-3723",
      email: "id.applenesia@gmail.com",
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0630849942013!2d104.05329739999999!3d1.1148310999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d989a3680c73ed%3A0x68e99d016e84f113!2sApplenesia%20-%20Apple%20Service%20Center%20Specialist!5e0!3m2!1sid!2sid!4v1732782142936!5m2!1sid!2sid",
      contactLink: "https://wa.me/6285733333723",
    },
    {
      id: 2,
      name: "Applenesia - Cabang Batu Aji",
      address:
        "Komplek Pertokoan Central Muka Kuning Blok A No.5, Kel. Buliang, Kec. Batu Aji, Kota Batam, Kep. Riau (Sebrang PStore SP - Deretan Dealer Yamaha)",
      phone: "0813-7152-1277",
      email: "baj.applenesia@gmail.com",
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.155177205756!2d103.9797193!3d1.0446498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d989f803e39073%3A0xbc343fb10b77c97a!2sApplenesia%20Batu%20Aji%20-%20Service%20iPhone%20Batam!5e0!3m2!1sid!2sid!4v1732782371813!5m2!1sid!2sid",
      contactLink: "https://wa.me/6281371521277",
    },
    {
      id: 3,
      name: "Applenesia - Cabang Tanjung Pinang",
      address:
        "Lokasi: Ruko ( Ex-PALUGADA ) (Antara Apotek Assyife dan Zovin Baby & Kids Shop) Jl.Raja Ali Haji 3, RT 001, RW011, Kel. Tanjung Ayun Sakti, Kec.Bukit Bestari .",
      phone: "0813-7152-1266",
      email: "tnj.applenesia@gmail.com",
      mapEmbed: "",
      contactLink: "https://wa.me/6281371521266",
    },
  ];

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
                    {stores.map((store) => (
                      <React.Fragment key={store.id}>
                        <address>{store.address} </address>
                        <p>
                          <strong>Phone:</strong> {store.phone}
                          <strong>Email:</strong> {store.email}
                        </p>
                        <hr />
                      </React.Fragment>
                    ))}
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

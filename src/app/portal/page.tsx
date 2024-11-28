import PortalFooter from "@/components/portal/Footer";
import PortalHeader from "@/components/portal/Header";
import PortalLayout from "@/components/portal/Layout";

export default function Portal() {
  return (
    <PortalLayout>
      <main className="main-wrapper">
        <PortalHeader />
        {/* 0 */}
        <div
          id="heroCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <ol className="carousel-indicators">
            <li
              data-bs-target="#heroCarousel"
              data-bs-slide-to={0}
              className="active"
            />
            <li data-bs-target="#heroCarousel" data-bs-slide-to={1} />
            <li data-bs-target="#heroCarousel" data-bs-slide-to={2} />
            <li data-bs-target="#heroCarousel" data-bs-slide-to={3} />
          </ol>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="/portal/assets/images_apn/header1.jpg"
                className="d-block w-100"
                alt="First Slide"
              />
            </div>
            <div className="carousel-item">
              <img
                src="/portal/assets/images_apn/header2.jpg"
                className="d-block w-100"
                alt="Second Slide"
              />
            </div>
            <div className="carousel-item">
              <img
                src="/portal/assets/images_apn/header3.jpg"
                className="d-block w-100"
                alt="Third Slide"
              />
            </div>
            <div className="carousel-item">
              <img
                src="/portal/assets/images_apn/header4.jpg"
                className="d-block w-100"
                alt="Fourth Slide"
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* 1 */}
        <div className="content-display-section section-top-gap-100 mb-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
                <div className="content-wrapper">
                  <div className="d-inline-block bg-primary text-white px-3 py-1 rounded mb-3">
                    <strong>iPhone Kamu Rusak???</strong>
                  </div>
                  <h3 className="section-title fw-bold mb-3 display-5">
                    Applenesia Solusinya
                  </h3>
                  <p className="mb-4 lead">
                    Service <strong>#PastiAman</strong> hanya di Applenesia!
                  </p>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2">
                      <i className="icofont-check text-success me-2"></i>{" "}
                      Konsultasi GRATIS
                    </li>
                    <li className="mb-2">
                      <i className="icofont-check text-success me-2"></i> Solusi
                      Tepat
                    </li>
                    <li className="mb-2">
                      <i className="icofont-check text-success me-2"></i> Skill
                      Profesional
                    </li>
                    <li>
                      <i className="icofont-check text-success me-2"></i>{" "}
                      Bergaransi
                    </li>
                  </ul>
                  <div>
                    <a
                      href="#kalkulator-service"
                      className="btn btn-primary p-3 me-2"
                    >
                      Estimasi Biaya <i className="icofont-double-right"></i>
                    </a>
                    <a
                      href="https://wa.me/628117779914"
                      className="btn btn-success p-3"
                      target="_blank"
                    >
                      Konsultasi <i className="icofont-double-right"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-12 text-center">
                <img
                  className="img-fluid"
                  src="/portal/assets/images_apn/1.png"
                  alt="Applenesia Service"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2 */}
        <div className="promo-display-section section-inner-padding-100 section-inner-bg-theme-color-gradeint-noise">
          <div className="box-wrapper">
            <div className="promo-wrapper">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="promo-items">
                      <a href="#kalkulator-service">
                        <div className="promo-single-items">
                          <div className="icon">
                            <img
                              src="/portal/assets/images/icons/promo/lightbulb.png"
                              alt=""
                            />
                            <img
                              src="/portal/assets/images/icons/promo/lightbulb-gradient.png"
                              alt=""
                            />
                            <div className="dot-icon-hover">
                              <span />
                              <span />
                              <span />
                            </div>
                          </div>
                          <div className="content">
                            <h4 className="title">CALCULATOR</h4>
                            <p>Cek estimasi harga service kamu disini.</p>
                          </div>
                        </div>
                      </a>
                      <a href="/portal/tracking">
                        <div className="promo-single-items">
                          <div className="icon">
                            <img
                              src="/portal/assets/images/icons/promo/cyber-security.png"
                              alt=""
                            />
                            <img
                              src="/portal/assets/images/icons/promo/cyber-security-gradient.png"
                              alt=""
                            />
                            <div className="dot-icon-hover">
                              <span />
                              <span />
                              <span />
                            </div>
                          </div>
                          <div className="content">
                            <h4 className="title">TRACKING</h4>
                            <p>Cek status perbaikan device kamu disini .</p>
                          </div>
                        </div>
                      </a>
                      <div className="promo-single-items">
                        <div className="icon">
                          <img
                            src="/portal/assets/images/icons/promo/skills.png"
                            alt=""
                          />
                          <img
                            src="/portal/assets/images/icons/promo/skills-gradient.png"
                            alt=""
                          />
                          <div className="dot-icon-hover">
                            <span />
                            <span />
                            <span />
                          </div>
                        </div>
                        <div className="content">
                          <h4 className="title">TESTIMONI</h4>
                          <p>Baca penilaian customer Applenesia disini.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 */}
        <div className="service-dispaly-section section-inner-padding-100 service-dispaly-bg">
          <div className="box-wrapper">
            <div className="section-wrapper">
              <div className="container">
                <div className="row">
                  <div className="col-xl-6 offset-xl-3">
                    <div className="section-content section-content-gap-80 text-center">
                      <h3 className="section-title">
                        Memberikan Solusi Terbaik Untuk Gadgetmu!{" "}
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
                  <div className="col-12">
                    <div className="service-slider default-slider">
                      <div className="swiper-container">
                        <div className="swiper-wrapper">
                          <div className="service-single-item service-single-item-style-1 swiper-slide">
                            <div className="icon">
                              <img
                                src="/portal/assets/images/icons/service/service-1.png"
                                alt=""
                              />
                              <img
                                src="/portal/assets/images/icons/service/service-1-hover.png"
                                alt=""
                              />
                            </div>
                            <div className="content">
                              <h5 className="title"> Face To Face Services </h5>
                              <p>
                                Lihat langsung pengerjaannya Service #PastiAman
                                di Applenesia.
                              </p>
                            </div>
                          </div>
                          <div className="service-single-item service-single-item-style-1 swiper-slide">
                            <div className="icon">
                              <img
                                src="/portal/assets/images/icons/service/service-1.png"
                                alt=""
                              />
                              <img
                                src="/portal/assets/images/icons/service/service-1-hover.png"
                                alt=""
                              />
                            </div>
                            <div className="content">
                              <h5 className="title">
                                Service Bergaransi <br /> &nbsp;
                              </h5>
                              <p>
                                Jangan Khawatir dengan kualitas kami. Kami
                                Berikan garansi 1 Tahun.
                              </p>
                            </div>
                          </div>
                          <div className="service-single-item service-single-item-style-1 swiper-slide">
                            <div className="icon">
                              <img
                                src="/portal/assets/images/icons/service/service-1.png"
                                alt=""
                              />
                              <img
                                src="/portal/assets/images/icons/service/service-1-hover.png"
                                alt=""
                              />
                            </div>
                            <div className="content">
                              <h5 className="title">
                                Pengecekan Gratis ! <br /> &nbsp;
                              </h5>
                              <p>
                                Konsultasi langsung dengan teknisi Applenesia
                                yang profesional.
                              </p>
                            </div>
                          </div>
                          <div className="service-single-item service-single-item-style-1 swiper-slide">
                            <div className="icon">
                              <img
                                src="/portal/assets/images/icons/service/service-1.png"
                                alt=""
                              />
                              <img
                                src="/portal/assets/images/icons/service/service-1-hover.png"
                                alt=""
                              />
                            </div>
                            <div className="content">
                              <h5 className="title">
                                Kualitas Sparepart <br /> &nbsp;
                              </h5>
                              <p>
                                Dapatkan sparepart Apple Device dengan kualitas
                                terbaik. Kami Berikan Garansi 1 Tahun.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="default-slider-buttons">
                        <div className="slider-button button-prev">
                          <i className="icofont-long-arrow-left" />
                        </div>
                        <div className="slider-button button-next">
                          <i className="icofont-long-arrow-right" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 */}
        <div className="count-display section-fluid-200 section-inner-padding-100 section-inner-gray-gradient-bg-reverse">
          <div className="box-wrapper">
            <div className="count-wrapper pos-relative">
              <div className="container-fluid">
                <div className="row align-items-center justify-contents-between">
                  <div className="col-xl-5 offset-xl-0 col-md-10 offset-md-1 col-sm-12">
                    <div className="content text-lg-start text-center">
                      <h3 className="title">
                        We’r <span>2,000+</span> Services complete &amp;{" "}
                        <span>100%</span> client satisfaction.
                      </h3>
                    </div>
                  </div>
                  <div className="col">
                    <ul className="counter-items counter-items-style-1">
                      <li className="counter-single-item">
                        <div className="count-box">
                          <img
                            src="/portal/assets/images/icons/count-shape-blue.png"
                            alt=""
                          />
                          <p className="text">
                            <span
                              className="counter"
                              data-to={1500}
                              data-speed={1500}
                            >
                              100
                            </span>
                            %
                          </p>
                        </div>
                        <h6 className="title">Happy Client’s</h6>
                      </li>
                      <li className="counter-single-item">
                        <div className="count-box">
                          <img
                            src="/portal/assets/images/icons/count-shape-orange.png"
                            alt=""
                          />
                          <p className="text">
                            <span className="counter">92</span>%
                          </p>
                        </div>
                        <h6 className="title">Positive Rating</h6>
                      </li>
                      <li className="counter-single-item">
                        <div className="count-box">
                          <img
                            src="/portal/assets/images/icons/count-shape-purple.png"
                            alt=""
                          />
                          <p className="text">
                            <span className="counter">3</span>
                          </p>
                        </div>
                        <h6 className="title title-center">Cabang Kami</h6>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="dotline-animate">
                <span className="blue" />
                <span className="orange" />
                <span className="blue" />
              </div>
            </div>
          </div>
        </div>

        {/* 5 */}
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
                      <h6 className="section-tag tag-blue">
                        Kalkulator Service
                      </h6>
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
                  <div className="col-12">
                    <div className="service-slider default-slider">
                      <div className="swiper-container">
                        <div className="swiper-wrapper">
                          <div
                            className="service-single-item-style-1 swiper-slide"
                            style={{ padding: 30 }}
                          >
                            <div className="icon text-center">
                              <h5 className="title" style={{ fontWeight: 800 }}>
                                {" "}
                                iPhone{" "}
                              </h5>
                              <img
                                src="/portal/assets/images_apn/iphone.png"
                                alt=""
                                style={{ height: 180 }}
                              />
                            </div>
                            <div className="content ms-2 mt-4 text-center">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#iphoneModal"
                              >
                                Cek Harga Service
                              </button>
                            </div>
                          </div>
                          <div
                            className="service-single-item-style-1 swiper-slide"
                            style={{ padding: 30 }}
                          >
                            <div className="icon">
                              <h5
                                className="title text-center"
                                style={{ fontWeight: 800 }}
                              >
                                {" "}
                                MacBook{" "}
                              </h5>
                              <img
                                src="/portal/assets/images_apn/macbook.png"
                                alt=""
                                style={{ height: 180 }}
                              />
                            </div>
                            <div className="content ms-2 mt-4 text-center">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#iphoneModal"
                              >
                                Cek Harga Service
                              </button>
                            </div>
                          </div>
                          <div
                            className="service-single-item-style-1 swiper-slide"
                            style={{ padding: 30 }}
                          >
                            <div className="icon text-center">
                              <h5 className="title" style={{ fontWeight: 800 }}>
                                iPad{" "}
                              </h5>
                              <img
                                src="/portal/assets/images_apn/ipad.png"
                                alt=""
                                style={{ height: 180 }}
                              />
                            </div>
                            <div className="content ms-2 mt-4 text-center">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#iphoneModal"
                              >
                                Cek Harga Service
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="default-slider-buttons">
                        <div className="slider-button button-prev">
                          <i className="icofont-long-arrow-left" />
                        </div>
                        <div className="slider-button button-next">
                          <i className="icofont-long-arrow-right" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PortalFooter />
      </main>
    </PortalLayout>
  );
}

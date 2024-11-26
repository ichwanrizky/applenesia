import Link from "next/link";

const PortalHeader = () => {
  return (
    <>
      <header className="header-section sticky-header d-none d-lg-block section-fluid-200">
        <div className="header-wrapper">
          <div className="container-fluid">
            <div className="row justify-content-between align-items-center">
              <div className="col-auto">
                <a href="index.html" className="header-logo">
                  <img
                    src="/portal/assets/images_apn/logo.png"
                    alt=""
                    style={{ height: 60 }}
                  />
                </a>
              </div>
              <div className="col-auto d-flex align-items-center">
                <ul className="header-nav">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/portal/tracking">Tracking</Link>
                  </li>
                  <li>
                    <a href="index.html">About Us</a>
                  </li>
                </ul>
              </div>
              <div className="col-auto">
                <div className="header-btn-link">
                  <a href="contact.html" className="btn btn-lg btn-default">
                    Academy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mobile-header d-block d-lg-none">
        <div className="container-fluid">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="mobile-logo">
                <a href="index.html">
                  <img
                    src="/portal/assets/images_apn/logo.png"
                    alt=""
                    style={{ height: 40 }}
                  />
                </a>
              </div>
            </div>
            <div className="col-auto">
              <div className="mobile-action-link text-end">
                <a data-bs-toggle="offcanvas" href="#toggleMenu" role="button">
                  <i className="icofont-navigation-menu" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="offcanvas offcanvas-start" tabIndex={-1} id="toggleMenu">
        <div className="offcanvas-header">
          <a href="index.html" className="header-logo">
            <img src="/portal/assets/images/logo/logo.png" alt="" />
          </a>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          <div className="offcanvas-mobile-menu-wrapper">
            <div className="mobile-menu-bottom">
              <div className="offcanvas-menu">
                <ul>
                  <li>
                    <a href="index.html">
                      <span>Home</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span>Services</span>
                    </a>
                    <ul className="mobile-sub-menu">
                      <li>
                        <a href="service-list.html">Service List</a>
                      </li>
                      <li>
                        <a href="service-details.html">Service Details</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#">
                      <span>Portfolio</span>
                    </a>
                    <ul className="mobile-sub-menu">
                      <li>
                        <a href="portfolio-list.html">Portfolio</a>
                      </li>
                      <li>
                        <a href="portfolio-details.html">Portfolio Details</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#">
                      <span>Pages</span>
                    </a>
                    <ul className="mobile-sub-menu">
                      <li>
                        <a href="about.html">
                          <span>About Us</span>
                        </a>
                      </li>
                      <li>
                        <a href="faq.html">FAQ</a>
                      </li>
                      <li>
                        <a href="404-error.html">404 Page</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#">
                      <span>Blogs</span>
                    </a>
                    <ul className="mobile-sub-menu">
                      <li>
                        <a href="blog-list-left-sidebar.html">
                          Blog List Left Sidebar
                        </a>
                      </li>
                      <li>
                        <a href="blog-list-right-sidebar.html">
                          Blog List Right Sidebar
                        </a>
                      </li>
                      <li>
                        <a href="blog-list-full-width.html">
                          Blog List Full Width
                        </a>
                      </li>
                      <li>
                        <a href="blog-details-left-sidebar.html">
                          Blog Details Left Sidebar
                        </a>
                      </li>
                      <li>
                        <a href="blog-details-right-sidebar.html">
                          Blog Details Right Sidebar
                        </a>
                      </li>
                      <li>
                        <a href="blog-details-full-width.html">
                          Blog Details Full Width
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="contact.html">
                      <span>Contact</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mobile-contact-info text-center">
              <ul className="social-link">
                <li>
                  <a href="https://example.com">
                    <i className="icofont-facebook" />
                  </a>
                </li>
                <li>
                  <a href="https://example.com">
                    <i className="icofont-twitter" />
                  </a>
                </li>
                <li>
                  <a href="https://example.com">
                    <i className="icofont-skype" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="offcanvas-overlay"></div>
    </>
  );
};

export default PortalHeader;

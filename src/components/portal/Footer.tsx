const PortalFooter = () => {
  return (
    <>
      <footer className="footer-section section-top-gap-0">
        <div className="box-wrapper">
          <div className="footer-top footer-top-style-1">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="footer-top-box">
                    <div className="footer-top-left">
                      <div className="footer-single-widget footer-about">
                        <a href="index.html" className="footer-logo">
                          <img src="assets/images/logo/logo-dark.png" alt="" />
                        </a>
                        <p>
                          There are many variation popular sheet containing
                          available have version software like available.
                        </p>
                        <address>Your address goes here.</address>
                      </div>
                    </div>
                    <div className="footer-top-right">
                      <div className="footer-single-widget footer-menu">
                        <h5 className="footer-title">Company</h5>
                        <ul className="footer-nav">
                          <li>
                            <a href="about.html">About Us</a>
                          </li>
                          <li>
                            <a href="contact.html">Contact Us</a>
                          </li>
                          <li>
                            <a href="">Print Ads</a>
                          </li>
                          <li>
                            <a href="faq.html">FAQ’s</a>
                          </li>
                          <li>
                            <a href="">Careers</a>
                          </li>
                        </ul>
                      </div>

                      <div className="footer-single-widget footer-menu">
                        <h5 className="footer-title">Quick Links</h5>
                        <ul className="footer-nav">
                          <li>
                            <a href="">Privacy Policy</a>
                          </li>
                          <li>
                            <a href="">Discussion</a>
                          </li>
                          <li>
                            <a href="">Terms &amp; Conditions</a>
                          </li>
                          <li>
                            <a href=""> Customer Support</a>
                          </li>
                          <li>
                            <a href="">Course FAQ’s</a>
                          </li>
                        </ul>
                      </div>

                      <div className="footer-single-widget footer-menu">
                        <h5 className="footer-title">Product</h5>
                        <ul className="footer-nav">
                          <li>
                            <a href="">Presentation</a>
                          </li>
                          <li>
                            <a href="">E-Books</a>
                          </li>
                          <li>
                            <a href="">Management Tool</a>
                          </li>
                          <li>
                            <a href="">Dashboard</a>
                          </li>
                          <li>
                            <a href="">Event Organizer</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="container">
              <div className="row justify-content-center justify-content-md-between align-items-center">
                <div className="col-auto">
                  <p className="copytight-text">
                    © {new Date().getFullYear()} Strane. Made with{" "}
                    <i className="icofont-heart" /> by{" "}
                    <a
                      href="https://hasthemes.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      HasThemes
                    </a>
                  </p>
                </div>
                <div className="col-auto">
                  <ul className="footer-bottom-link">
                    <li>
                      {" "}
                      <a href="">Terms of Service </a>
                    </li>
                    <li>
                      <a href="">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="">Sitemap</a>
                    </li>
                  </ul>
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

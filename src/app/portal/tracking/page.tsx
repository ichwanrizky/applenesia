import PortalFooter from "@/components/portal/Footer";
import PortalHeader from "@/components/portal/Header";
import PortalLayout from "@/components/portal/Layout";
import Link from "next/link";

export default function PortalTracking() {
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
                        <Link href={"/"}>Home</Link>
                      </li>
                      <li>Tracking Service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section py-5">
          <div className="box-wrapper">
            <div className="contact-form-wrapper">
              <div className="container">
                <div className="row">
                  <div className="col-xl-10 offset-xl-1 col-12">
                    <form
                      id="contact-form"
                      className="default-form"
                      action="assets/mail/contact.php"
                      method="post"
                    >
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="default-form-single-item">
                            <input
                              name="name"
                              type="text"
                              placeholder="Name"
                              required=""
                            />
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="default-form-single-item">
                            <input
                              name="email"
                              type="email"
                              placeholder="Email"
                              required=""
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 text-center">
                          <button className="btn btn-lg btn-default icon-right">
                            Tracking
                          </button>
                        </div>
                      </div>
                    </form>
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

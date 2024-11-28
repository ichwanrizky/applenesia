import PortalFooter from "@/components/portal/Footer";
import PortalHeader from "@/components/portal/Header";
import PortalLayout from "@/components/portal/Layout";

export default function PortalStore() {
  const stores = [
    {
      id: 1,
      name: "Applenesia Batam",
      address: "Ruko Royal Sincom E-12, Batam, Kepulauan Riau, Indonesia",
      phone: "0857-3333-3723",
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.164567947092!2d104.00998831523012!3d1.1112944991692655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98bff567a33df%3A0xf112233445566778!2sApplenesia!5e0!3m2!1sen!2sid!4v1234567890123",
      contactLink: "https://wa.me/6285733333723",
    },
    {
      id: 2,
      name: "Applenesia Jakarta",
      address: "Jl. MH Thamrin No. 10, Jakarta Pusat, Indonesia",
      phone: "0812-3456-7890",
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125564.81358684583!2d106.70098790923984!3d-6.214620574895584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6993015eecaaa9%3A0xfabcde1234567890!2sApplenesia!5e0!3m2!1sen!2sid!4v9876543210123",
      contactLink: "https://wa.me/6285733333723",
    },
    {
      id: 3,
      name: "Applenesia Surabaya",
      address: "Jl. Raya Darmo No. 5, Surabaya, Indonesia",
      phone: "0851-2345-6789",
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.235659987184!2d112.73176381522679!3d-7.290493995154993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fdf9a78b8c65%3A0xf123456789abcdef!2sApplenesia!5e0!3m2!1sen!2sid!4v0123456789012",
      contactLink: "https://wa.me/6285733333723",
    },
  ];

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
                    <h2 className="breadcrumb-title">Our Store</h2>
                    <ul className="breadcrumb-nav">
                      <li>
                        <a href={"/"}>Home</a>
                      </li>
                      <li>Our Store</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="store-section py-5 bg-light">
          <div className="container">
            <div className="row text-center mb-5">
              <div className="col-12">
                <p className="lead">
                  Visit our branches across Indonesia for the best Apple service
                  experience.
                </p>
              </div>
            </div>
            {stores.map((store, index) => (
              <div
                className={`row align-items-center mb-5 ${
                  index % 2 !== 0 ? "flex-row-reverse" : ""
                }`}
                key={store.id}
              >
                {/* Informasi Cabang */}
                <div className="col-lg-6 col-md-12">
                  <div className="store-info p-4 bg-white shadow rounded">
                    <h3 className="fw-bold">{store.name}</h3>
                    <p>
                      <strong>Address:</strong> {store.address}
                    </p>
                    <p>
                      <strong>Phone:</strong> {store.phone}
                    </p>
                    <a
                      href={store.contactLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success mt-3"
                    >
                      Contact Us <i className="icofont-whatsapp"></i>
                    </a>
                  </div>
                </div>
                {/* Peta Lokasi */}
                <div className="col-lg-6 col-md-12">
                  <div className="map-container shadow rounded">
                    <iframe
                      src={store.mapEmbed}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PortalFooter />
      </main>
    </PortalLayout>
  );
}

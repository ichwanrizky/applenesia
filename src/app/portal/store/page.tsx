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
                      <br />
                      <strong>Email:</strong> {store.email}
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

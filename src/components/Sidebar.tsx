"use client";

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

const SidebarAdmin = ({ session }: { session: Session }) => {
  const role_name = session.user.role_name;
  return (
    <div className="vertical-menu">
      <div data-simplebar="" className="h-100">
        <div className="navbar-brand-box">
          <a href="index.html" className="logo">
            <span>Applenesia</span>
          </a>
        </div>

        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {/*  */}
            <li className="menu-title">POINT OF SALE</li>
            <li>
              <a href="/cp/pos/service" className="waves-effect">
                <i className="mdi mdi-toolbox" />
                <span>Data Service</span>
              </a>
            </li>

            <li>
              <a href="/cp/pos/invoice" className="waves-effect">
                <i className="mdi mdi-file-document" />

                <span>Data Invoice</span>
              </a>
            </li>

            {(role_name === "ADMINISTRATOR" ||
              role_name === "SUPERVISOR" ||
              role_name === "ADMINCABANG" ||
              role_name === "CASHIER") && (
              <li>
                <a href="/cp/pos/transaction" className="waves-effect">
                  <i className="mdi mdi-cart" />

                  <span>Data Transaction</span>
                </a>
              </li>
            )}

            {/*  */}
            <li className="menu-title">INVENTORY & PRODUCT</li>
            <li>
              <a href="/cp/inventory/product" className="waves-effect">
                <i className="mdi mdi-file-document-box" />
                <span>Data Product</span>
              </a>
            </li>

            {(role_name === "ADMINISTRATOR" ||
              role_name === "SUPERVISOR" ||
              role_name === "ADMINCABANG") && (
              <li>
                <a
                  href="/cp/inventory/productinventory"
                  className="waves-effect"
                >
                  <i className="mdi mdi-package" />
                  <span>Product Inventory</span>
                </a>
              </li>
            )}

            {(role_name === "ADMINISTRATOR" ||
              role_name === "SUPERVISOR" ||
              role_name === "ADMINCABANG") && (
              <li>
                <a
                  href="/cp/inventory/productpurchase"
                  className="waves-effect"
                >
                  <i className="mdi mdi-cart" />
                  <span>Product Pembelian</span>
                </a>
              </li>
            )}

            {(role_name === "ADMINISTRATOR" ||
              role_name === "SUPERVISOR" ||
              role_name === "ADMINCABANG") && (
              <li>
                <a href="/cp/inventory/productlog" className="waves-effect">
                  <i className="mdi mdi-history" />
                  <span>Product LOG</span>
                </a>
              </li>
            )}

            {/*  */}
            <li className="menu-title">CONFIGURATION</li>
            {session.user.role_name === "ADMINISTRATOR" && (
              <li>
                <a href="/cp/config/cabang" className="waves-effect">
                  <i className="mdi mdi mdi-office-building" />
                  <span>Data Cabang</span>
                </a>
              </li>
            )}

            {(session.user.role_name === "ADMINISTRATOR" ||
              session.user.role_name === "SUPERVISOR") && (
              <li>
                <a href="/cp/config/user" className="waves-effect">
                  <i className="mdi mdi-account-multiple-outline" />
                  <span>Data User</span>
                </a>
              </li>
            )}

            <li>
              <a href="/cp/config/device" className="waves-effect">
                <i className="mdi mdi-cellphone-android" />
                <span>Data Device</span>
              </a>
            </li>
            <li>
              <a href="/cp/config/kategori" className="waves-effect">
                <i className="mdi mdi-format-list-checkbox" />
                <span>Data Kategori</span>
              </a>
            </li>
            <li>
              <a href="/cp/config/formchecking" className="waves-effect">
                <i className="mdi mdi-format-list-checkbox" />
                <span>Data Form Check</span>
              </a>
            </li>
          </ul>
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
};

export default SidebarAdmin;

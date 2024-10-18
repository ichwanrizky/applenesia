"use client";

const SidebarAdmin = () => {
  return (
    <div className="vertical-menu">
      <div data-simplebar="" className="h-100">
        <div className="navbar-brand-box">
          <a href="index.html" className="logo">
            <i className="mdi mdi-album" />
            <span>Xeloro</span>
          </a>
        </div>

        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {/*  */}
            <li className="menu-title">POINT OF SALE</li>
            <li>
              <a href="/dashboard/service" className="waves-effect">
                <i className="mdi mdi-toolbox" />
                <span>Data Service</span>
              </a>
            </li>

            {/*  */}
            <li className="menu-title">INVENTORY & PRODUCT</li>
            <li>
              <a href="/dashboard/product" className="waves-effect">
                <i className="mdi mdi-file-document-box" />
                <span>Data Product</span>
              </a>
            </li>

            <li>
              <a href="/dashboard/productinventory" className="waves-effect">
                <i className="mdi mdi-package" />
                <span>Product Inventory</span>
              </a>
            </li>

            <li>
              <a href="/dashboard/productpurchase" className="waves-effect">
                <i className="mdi mdi-cart" />
                <span>Product Pembelian</span>
              </a>
            </li>

            <li>
              <a href="/dashboard/productlog" className="waves-effect">
                <i className="mdi mdi-history" />
                <span>Product LOG</span>
              </a>
            </li>

            {/*  */}
            <li className="menu-title">CONFIGURATION</li>
            <li>
              <a href="/dashboard/cabang" className="waves-effect">
                <i className="mdi mdi mdi-office-building" />
                <span>Data Cabang</span>
              </a>
            </li>
            <li>
              <a href="/dashboard/user" className="waves-effect">
                <i className="mdi mdi-account-multiple-outline" />
                <span>Data User</span>
              </a>
            </li>
            <li>
              <a href="/dashboard/device" className="waves-effect">
                <i className="mdi mdi-cellphone-android" />
                <span>Data Device</span>
              </a>
            </li>
            <li>
              <a href="/dashboard/kategori" className="waves-effect">
                <i className="mdi mdi-format-list-checkbox" />
                <span>Data Kategori</span>
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

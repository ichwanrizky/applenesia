"use client";
import Link from "next/link";

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
            <li className="menu-title">INVENTORY & PRODUCT</li>
            <li>
              <a href="/dashboard/product" className="waves-effect">
                <i className="mdi mdi-tablet-cellphone" />
                <span>Data Product</span>
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
                <i className="mdi mdi-tablet-cellphone" />
                <span>Data Device</span>
              </a>
            </li>
            <li>
              <a href="/dashboard/kategori" className="waves-effect">
                <i className="mdi mdi-tablet-cellphone" />
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

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
            {/* <li className="menu-title">Menu</li>
            <li>
              <a href="index.html" className="waves-effect">
                <i className="mdi mdi-home-analytics" />
                <span className="badge badge-pill badge-primary float-right">
                  7
                </span>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className="has-arrow waves-effect">
                <i className="mdi mdi-diamond-stone" />
                <span>UI Elements</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <a href="ui-buttons.html">Buttons</a>
                </li>
                <li>
                  <a href="ui-cards.html">Cards</a>
                </li>
                <li>
                  <a href="ui-carousel.html">Carousel</a>
                </li>
                <li>
                  <a href="ui-embeds.html">Embeds</a>
                </li>
                <li>
                  <a href="ui-general.html">General</a>
                </li>
                <li>
                  <a href="ui-grid.html">Grid</a>
                </li>
                <li>
                  <a href="ui-media-objects.html">Media Objects</a>
                </li>
                <li>
                  <a href="ui-modals.html">Modals</a>
                </li>
                <li>
                  <a href="ui-progressbars.html">Progress Bars</a>
                </li>
                <li>
                  <a href="ui-tabs.html">Tabs</a>
                </li>
                <li>
                  <a href="ui-typography.html">Typography</a>
                </li>
                <li>
                  <a href="ui-toasts.html">Toasts</a>
                </li>
                <li>
                  <a href="ui-tooltips-popovers.html">
                    Tooltips &amp; Popovers
                  </a>
                </li>
                <li>
                  <a href="ui-scrollspy.html">Scrollspy</a>
                </li>
                <li>
                  <a href="ui-spinners.html">Spinners</a>
                </li>
                <li>
                  <a href="ui-sweetalerts.html">Sweet Alerts</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#" className="has-arrow waves-effect">
                <i className="mdi mdi-table-merge-cells" />
                <span>Tables</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <a href="tables-basic.html">Basic Tables</a>
                </li>
                <li>
                  <a href="tables-datatables.html">Data Tables</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#" className="has-arrow waves-effect">
                <i className="mdi mdi-poll" />
                <span>Charts</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <a href="charts-morris.html">Morris</a>
                </li>
                <li>
                  <a href="charts-google.html">Google</a>
                </li>
                <li>
                  <a href="charts-chartjs.html">Chartjs</a>
                </li>
                <li>
                  <a href="charts-sparkline.html">Sparkline</a>
                </li>
                <li>
                  <a href="charts-knob.html">Jquery Knob</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#" className="waves-effect">
                <i className="mdi mdi-format-list-bulleted-type" />
                <span className="badge badge-pill badge-danger float-right">
                  6
                </span>
                <span>Forms</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <a href="forms-elements.html">Elements</a>
                </li>
                <li>
                  <a href="forms-plugins.html">Plugins</a>
                </li>
                <li>
                  <a href="forms-validation.html">Validation</a>
                </li>
                <li>
                  <a href="forms-mask.html">Masks</a>
                </li>
                <li>
                  <a href="forms-quilljs.html">Quilljs</a>
                </li>
                <li>
                  <a href="forms-uploads.html">File Uploads</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#" className="has-arrow waves-effect">
                <i className="mdi mdi-black-mesa" />
                <span>Icons</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <a href="icons-materialdesign.html">Material Design</a>
                </li>
                <li>
                  <a href="icons-fontawesome.html">Font awesome</a>
                </li>
                <li>
                  <a href="icons-dripicons.html">Dripicons</a>
                </li>
                <li>
                  <a href="icons-feather.html">Feather Icons</a>
                </li>
              </ul>
            </li> */}
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

const HeaderAdmin = () => {
  return (
    <>
      <div className="header-border" />
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex align-items-left">
            <button
              type="button"
              className="btn btn-sm mr-2 d-lg-none px-3 font-size-16 header-item waves-effect"
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>
            <div className="dropdown py-3">
              <select className="custom-select">
                <option value="">Cabang 1</option>
              </select>
            </div>
          </div>
          <div className="d-flex align-items-left">
            <div className="dropdown d-inline-block ml-2">
              <button
                type="button"
                className="btn header-item waves-effect"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  className="rounded-circle header-profile-user"
                  src="/themes/assets/images/users/avatar-2.jpg"
                  alt="Header Avatar"
                />
                <span className="d-none d-sm-inline-block ml-1">Donald M.</span>
                <i className="mdi mdi-chevron-down d-none d-sm-inline-block" />
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                <a
                  className="dropdown-item d-flex align-items-center justify-content-between"
                  href="#"
                >
                  <span>Inbox</span>
                  <span>
                    <span className="badge badge-pill badge-info">3</span>
                  </span>
                </a>
                <a
                  className="dropdown-item d-flex align-items-center justify-content-between"
                  href="#"
                >
                  <span>Profile</span>
                  <span>
                    <span className="badge badge-pill badge-warning">1</span>
                  </span>
                </a>
                <a
                  className="dropdown-item d-flex align-items-center justify-content-between"
                  href="#"
                >
                  Settings
                </a>
                <a
                  className="dropdown-item d-flex align-items-center justify-content-between"
                  href="#"
                >
                  <span>Lock Account</span>
                </a>
                <a
                  className="dropdown-item d-flex align-items-center justify-content-between"
                  href="#"
                >
                  <span>Log Out</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderAdmin;

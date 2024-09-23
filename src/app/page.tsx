export default function Home() {
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center min-vh-100">
              <div className="w-100 d-block bg-white shadow-lg rounded my-5">
                <div className="row">
                  <div className="col-lg-5 d-none d-lg-block bg-login rounded-left" />
                  <div className="col-lg-7">
                    <div className="p-5">
                      <div className="text-center mb-5">
                        <a
                          href="index.html"
                          className="text-dark font-size-22 font-family-secondary"
                        >
                          <b>ADMIN APPLENESIA</b>
                        </a>
                      </div>
                      <h1 className="h5 mb-1">Welcome Back!</h1>
                      <p className="text-muted mb-4">
                        Enter your username and password to access admin panel.
                      </p>
                      <form className="user">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control form-control-user"
                            placeholder="Username"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            placeholder="Password"
                          />
                        </div>
                        <a
                          href=""
                          className="btn btn-success btn-block waves-effect waves-light"
                        >
                          Log In
                        </a>
                        <div className="text-center mt-4">
                          <ul className="list-inline mt-3 mb-0">
                            <li className="list-inline-item">
                              <a
                                href="javascript: void(0);"
                                className="social-list-item border-primary text-primary"
                              >
                                <i className="mdi mdi-facebook" />
                              </a>
                            </li>
                            <li className="list-inline-item">
                              <a
                                href="javascript: void(0);"
                                className="social-list-item border-danger text-danger"
                              >
                                <i className="mdi mdi-google" />
                              </a>
                            </li>
                            <li className="list-inline-item">
                              <a
                                href="javascript: void(0);"
                                className="social-list-item border-info text-info"
                              >
                                <i className="mdi mdi-twitter" />
                              </a>
                            </li>
                            <li className="list-inline-item">
                              <a
                                href="javascript: void(0);"
                                className="social-list-item border-secondary text-secondary"
                              >
                                <i className="mdi mdi-github-circle" />
                              </a>
                            </li>
                          </ul>
                        </div>
                      </form>
                      <div className="row mt-4">
                        <div className="col-12 text-center">
                          <p className="text-muted mb-2">
                            <a
                              href="pages-recoverpw.html"
                              className="text-muted font-weight-medium ml-1"
                            >
                              Forgot your password?
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

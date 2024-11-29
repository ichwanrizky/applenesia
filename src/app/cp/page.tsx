"use client";
import CustomAlert from "@/components/CustomAlert";
import CustomButton from "@/components/CustomButton";
import authServices from "@/services/authServices";
import { useState } from "react";

export default function Login({ searchParams }: { searchParams: any }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    status: false,
    message: "",
    color: "",
  });

  const callbackUrl = searchParams?.callbackUrl
    ? searchParams?.callbackUrl
    : "/cp/redirect";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    let result;
    try {
      result = await authServices.loginUser(username, password);
      setError({
        status: true,
        message: result?.ok
          ? "Login success"
          : "Login failed, please try again",
        color: result?.ok ? "success" : "danger",
      });
      if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch (error) {
      setError({
        status: true,
        message: "Something went wrong",
        color: "danger",
      });
    } finally {
      if (!result?.ok) {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <title> Login - Applenesia</title>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center min-vh-100">
              <div className="w-100 d-block bg-white shadow-lg rounded my-5">
                <div className="row">
                  <div className="col-lg-5 d-none bg-login d-lg-block rounded-left">
                    {/* <Image
                      src={"/img/landing.jpg"}
                      alt={"login"}
                      width="0"
                      height="0"
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                    /> */}
                  </div>
                  <div className="col-lg-7">
                    <div className="p-5">
                      <div className="text-center mb-5">
                        <a
                          href=""
                          className="text-dark font-size-22 font-family-secondary"
                        >
                          <b>ADMIN APPLENESIA</b>
                        </a>
                      </div>

                      {error.status && (
                        <CustomAlert
                          message={error.message}
                          color={error.color}
                        />
                      )}

                      <h1 className="h5 mb-1">Welcome Back!</h1>
                      <p className="text-muted mb-4">
                        Enter your username and password to access admin panel.
                      </p>
                      <form onSubmit={handleSubmit} className="user">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control form-control-user"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                          />
                        </div>
                        <CustomButton buttonType="login" isLoading={isLoading}>
                          Login
                        </CustomButton>
                        <div className="text-center mt-4">
                          <ul className="list-inline mt-3 mb-0">
                            <li className="list-inline-item">
                              <a
                                href=""
                                className="social-list-item border-primary text-primary"
                              >
                                <i className="mdi mdi-facebook" />
                              </a>
                            </li>
                            <li className="list-inline-item">
                              <a
                                href=""
                                className="social-list-item border-danger text-danger"
                              >
                                <i className="mdi mdi-google" />
                              </a>
                            </li>
                            <li className="list-inline-item">
                              <a
                                href=""
                                className="social-list-item border-info text-info"
                              >
                                <i className="mdi mdi-twitter" />
                              </a>
                            </li>
                            <li className="list-inline-item">
                              <a
                                href=""
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
                              href="#"
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
    </>
  );
}

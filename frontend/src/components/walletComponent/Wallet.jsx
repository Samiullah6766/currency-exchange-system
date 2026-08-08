import React, { useEffect, useState } from "react";
import { authenticateUser, getWallet } from "../../services/WalletService";
import { Link, useNavigate } from "react-router-dom";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isWalletTransactionHovered, setIsWalletTransactionHovered] =
    useState(false);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigator = useNavigate();

  useEffect(() => {
    getWallet()
      .then((response) => {
        setWallet(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setWallet(null);
        }

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      });
  }, []);

  const goBack = () => {
    navigator(-1);
  };

  const openUpdateModal = () => {
    setShowUpdateModal(true);
  };

  const confirmUpdateWallet = () => {
    if (!credentials.username || !credentials.password) {
      setErrorMessage("نام کاربری و رمز عبور را وارد کنید.");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return;
    }

    setShowUpdateModal(false);
    const data = {
      username: credentials.username,
      password: credentials.password,
    };

authenticateUser(data)
  .then(() => {
    navigator("/update-wallet/" + wallet.id, {
      state: data,
    });
  })
  .catch((error) => {
    if (error.response?.status === 401) {
      setErrorMessage("❌ نام کاربری یا رمز عبور اشتباه است.");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } else {
      setErrorMessage("خطایی رخ داده است.");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }

    setShowUpdateModal(true);
  });

    // setCredentials({
    //   username: "",
    //   password: "",
    // });
  };

  if (!wallet) {
    return (
      <div className="min-vh-100 d-flex" style={{ background: "#f4f6fb" }}>
        <div
          className="bg-white shadow-sm border-end p-4"
          style={{ width: "270px", minHeight: "100vh" }}
        >
          <h4 className="fw-bold mb-4">خزانه</h4>

          <Link
            to="/create-wallet"
            className="btn btn-success w-100 rounded-3 py-3 fw-bold"
          >
            + ایجاد خزانه
          </Link>
        </div>

        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="text-center bg-white p-5 rounded-4 shadow">
            <h2 className="fw-bold mb-3">خزانه وجود ندارد</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex" style={{ background: "#f4f6fb" }}>
      {errorMessage && (
        <div
          className="position-fixed top-50 start-50 translate-middle"
          style={{
            zIndex: 3000,
            minWidth: "420px",
            maxWidth: "500px",
          }}
        >
          <div
            className="text-white text-center shadow-lg rounded-4 p-4"
            style={{
              backgroundColor: "#dc3545",
              fontSize: "18px",
              fontWeight: "bold",
              border: "3px solid white",
            }}
          >
            ❌ {errorMessage}
          </div>
        </div>
      )}

      {successMessage && (
        <div
          className="position-fixed top-50 start-50 translate-middle"
          style={{
            zIndex: 3000,
            minWidth: "420px",
            maxWidth: "500px",
          }}
        >
          <div
            className="text-white text-center shadow-lg rounded-4 p-4"
            style={{
              backgroundColor: "#198754",
              fontSize: "18px",
              fontWeight: "bold",
              border: "3px solid white",
            }}
          >
            ✅ {successMessage}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className="bg-white shadow-sm border-end p-4"
        style={{
          width: "270px",
          minHeight: "100vh",
        }}
      >
        <div className="d-grid gap-3">
          <Link
            to="/create-wallet-transaction"
            className="btn btn-success rounded-3"
            onMouseEnter={() => setIsWalletTransactionHovered(true)}
            onMouseLeave={() => setIsWalletTransactionHovered(false)}
          >
            {isWalletTransactionHovered
              ? "اضافه کردن یا کشیدن پول به/از خزانه"
              : "اضافه کردن یا کشیدن"}
          </Link>

          <Link
            to="/owner-exchange"
            className="btn btn-success rounded-3 fw-bold"
          >
            ایجاد معامله خرید و فروش
          </Link>

          <Link
            to="/wallet-transactions"
            className="btn btn-outline-secondary rounded-3"
          >
            روزنامچه خزانه
          </Link>

          <hr />

          <button
            className="btn btn-warning rounded-3 fw-bold"
            onClick={openUpdateModal}
          >
            ✏️ ویرایش خزانه
          </button>
        </div>
      </div>

      {/* Main */}
      <div
        className="flex-grow-1 p-4"
        style={{
          transform: "translateX(-40px)",
        }}
      >
        <div className="mb-4">
          <h2 className="fw-bold mb-2">خزانه</h2>

          <span className="badge bg-secondary fs-6 px-3 py-2">
            شناسه خزانه: #{wallet.id}
          </span>
        </div>

        <div
          className="bg-white rounded-4 shadow-lg p-4"
          style={{
            maxWidth: "1000px",
            border: "1px solid #e9ecef",
          }}
        >
          <button
            className="btn btn-light border rounded-circle ms-3 mb-4"
            onClick={goBack}
          >
            <i className="bi bi-arrow-right"></i>
          </button>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="p-3 rounded-4 border bg-light shadow-sm">
                <div className="fw-semibold">🇦🇫 افغانی</div>
                <div className="fs-5 fw-bold text-success">
                  {wallet.afghaniBalance?.toLocaleString() || 0}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 rounded-4 border bg-light shadow-sm">
                <div className="fw-semibold">💵 دالر</div>
                <div className="fs-5 fw-bold text-primary">
                  {wallet.dollarBalance?.toLocaleString() || 0}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 rounded-4 border bg-light shadow-sm">
                <div className="fw-semibold">💶 یورو</div>
                <div className="fs-5 fw-bold text-info">
                  {wallet.euroBalance?.toLocaleString() || 0}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 rounded-4 border bg-light shadow-sm">
                <div className="fw-semibold">🇮🇷 تومان</div>
                <div className="fs-5 fw-bold text-warning">
                  {wallet.tomanBalance?.toLocaleString() || 0}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 rounded-4 border bg-light shadow-sm">
                <div className="fw-semibold">💰 کالدار</div>
                <div className="fs-5 fw-bold text-danger">
                  {wallet.kaldaraBalance?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: "rgba(0,0,0,.45)",
              zIndex: 1040,
            }}
            onClick={() => setShowUpdateModal(false)}
          />

          <div
            className="position-fixed top-50 start-50 translate-middle"
            style={{
              width: "430px",
              zIndex: 1050,
            }}
          >
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h4 className="fw-bold text-warning">
                    تایید هویت برای ویرایش خزانه
                  </h4>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">نام کاربری</label>

                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">رمز عبور</label>

                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control rounded-3"
                      value={credentials.password}
                      style={{ paddingLeft: "45px" }}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
                        })
                      }
                    />

                    <button
                      type="button"
                      className="btn btn-sm position-absolute"
                      style={{
                        left: "10px",
                        top: "5px",
                        border: "none",
                        background: "transparent",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowUpdateModal(false);
                      setCredentials({
                        username: "",
                        password: "",
                      });
                    }}
                  >
                    لغو
                  </button>

                  <button
                    className="btn btn-warning"
                    onClick={confirmUpdateWallet}
                  >
                    ادامه
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Wallet;

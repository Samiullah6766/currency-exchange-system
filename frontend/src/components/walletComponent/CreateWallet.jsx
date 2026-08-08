import React, { useEffect, useState } from "react";
import {
  createWallet,
  getWallet,
  updateWallet,
} from "../../services/WalletService";
import { useNavigate, useParams } from "react-router-dom";

const CreateWallet = () => {
  const [afghani, setAfghani] = useState("");
  const [dollar, setDollar] = useState("");
  const [kaldara, setKaldara] = useState("");
  const [toman, setToman] = useState("");
  const [euro, setEuro] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { id } = useParams();

  const navigator = useNavigate();
  const formatNumber = (value) => {
    const clean = value.replace(/,/g, "");

    // allow only digits and one decimal point
    if (!/^\d*\.?\d*$/.test(clean)) {
      return value;
    }

    const [integer, decimal] = clean.split(".");

    const formattedInteger = integer ? Number(integer).toLocaleString() : "";

    return decimal !== undefined
      ? `${formattedInteger}.${decimal}`
      : formattedInteger;
  };

  const removeCommas = (value) => {
    return String(value).replace(/,/g, "");
  };

  useEffect(() => {
    if (id) {
      getWallet().then((response) => {
        setAfghani(removeCommas(response.data.afghaniBalance));
        setDollar(removeCommas(response.data.dollarBalance));
        setKaldara(removeCommas(response.data.kaldaraBalance));
        setToman(removeCommas(response.data.tomanBalance));
        setEuro(removeCommas(response.data.euroBalance));
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const walletData = {
      afghaniBalance: removeCommas(afghani),
      dollarBalance: removeCommas(dollar),
      kaldaraBalance: removeCommas(kaldara),
      tomanBalance: removeCommas(toman),
      euroBalance: removeCommas(euro),
    };

    if (id) {
      const data = {
        username: credentials.username,
        password: credentials.password,
        afghaniBalance: removeCommas(afghani),
        dollarBalance: removeCommas(dollar),
        kaldaraBalance: removeCommas(kaldara),
        tomanBalance: removeCommas(toman),
        euroBalance: removeCommas(euro),
      };

      updateWallet(data)
        .then(() => {
          navigator("/wallet");
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            setErrorMessage("اسم کاربری یا رمز عبور اشتباه است");
          } else {
            setErrorMessage("خطایی رخ داده است");
          }
        });

      return;
    } else {
      createWallet(walletData)
        .then(() => {
          setAfghani("");
          setDollar("");
          setKaldara("");
          setToman("");
          setEuro("");

          setSuccessMessage(true);

          setTimeout(() => {
            setSuccessMessage(false);
            navigator("/wallet");
          }, 3000);
        })
        .catch((error) => {
          setAfghani("");
          setDollar("");
          setKaldara("");
          setToman("");
          setEuro("");

          if (error.response?.status === 409) {
            setErrorMessage("خزانه موجود است");
          } else {
            setErrorMessage("خطایی رخ داده است، دوباره تلاش کنید");
          }
        });
    }

    if (id) {
    }
  };

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor: "#f8f9fa",
        paddingTop: "30px",
        paddingBottom: "20px",
      }}
    >
      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div
          className="position-fixed top-50 start-50 translate-middle"
          style={{
            zIndex: 1055,
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <div
            className="shadow-lg rounded-4 p-4 text-center text-white"
            style={{
              backgroundColor: "#198754",
              border: "3px solid white",
            }}
          >
            <div className="fs-1 mb-3">✅</div>

            <h5 className="fw-bold">خزانه با موفقیت ایجاد شد</h5>

            <p className="mb-0 fs-6">در حال انتقال به صفحه خزانه...</p>
          </div>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div
          className="position-fixed top-50 start-50 translate-middle"
          style={{
            zIndex: 1055,
            width: "100%",
            maxWidth: "550px",
          }}
        >
          <div
            className="alert shadow-lg border-0 rounded-4 p-4 text-center"
            style={{
              backgroundColor: "#ffe5e5",
              color: "#dc3545",
            }}
          >
            <div className="fs-1 mb-3">⚠️</div>

            <h5 className="fw-bold">ایجاد خزانه انجام نشد</h5>

            <p className="fs-5">{errorMessage}</p>

            <button
              className="btn btn-danger px-4 rounded-pill"
              onClick={() => setErrorMessage("")}
            >
              فهمیدم
            </button>
          </div>
        </div>
      )}

      <div className="container">
        <div
          className="card shadow mx-auto"
          style={{
            maxWidth: "1200px",
            width: "100%",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <div className="card-header bg-white py-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-1 fw-bold text-dark">
                  {id ? "ویرایش خزانه" : "ایجاد خزانه"}
                </h3>

                <small className="text-muted">معلومات موجودی اولیه خزانه</small>
              </div>

              <button
                className="btn btn-outline-secondary rounded-circle shadow-sm"
                style={{
                  width: "42px",
                  height: "42px",
                }}
                onClick={() => navigator(-1)}
                title="بازگشت"
              >
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>

          {/* BODY */}

          <div className="card-body p-5">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="row g-3">
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">
                    افغانی (AFG)
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="مقدار افغانی"
                    value={afghani}
                    onChange={(e) => setAfghani(formatNumber(e.target.value))}
                  />
                </div>

                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">
                    دالر (USD)
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="مقدار دالر"
                    value={dollar}
                    onChange={(e) => setDollar(formatNumber(e.target.value))}
                  />
                </div>

                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">
                    یورو (EUR)
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="مقدار یورو"
                    value={euro}
                    onChange={(e) => setEuro(formatNumber(e.target.value))}
                  />
                </div>

                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">تومان</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="مقدار تومان"
                    value={toman}
                    onChange={(e) => setToman(formatNumber(e.target.value))}
                  />
                </div>

                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">کالدار</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="مقدار کالدار"
                    value={kaldara}
                    onChange={(e) => setKaldara(formatNumber(e.target.value))}
                  />
                </div>
              </div>
              {id && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">نام کاربری</label>

                    <input
                      type="text"
                      className="form-control"
                      value={credentials.username}
                      autoComplete="off"
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          username: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">رمز عبور</label>

                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        name="wallet-pass"
                        autoComplete="new-password"
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
                          left: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          border: "none",
                          background: "transparent",
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => navigator("/wallet")}
                >
                  لغو
                </button>

                <button type="submit" className="btn btn-success px-4">
                  {id ? "ویرایش خزانه" : "ایجاد خزانه"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWallet;

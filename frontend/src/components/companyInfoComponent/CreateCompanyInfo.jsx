import React, { useEffect, useState } from "react";
import {
  saveInfo,
  getCompanyInfo,
  updateCompanyInfo,
} from "../../services/CompanyInfoService";
import { useLocation, useNavigate } from "react-router-dom";

const CreateCompanyInfo = () => {
  const [companyId, setCompanyId] = useState(null);

  const [officeName, setOfficeName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isUpdateMode = location.pathname === "/update-companyInfo";

  useEffect(() => {
    if (isUpdateMode) {
      getCompanyInfo()
        .then((response) => {
          const data = response.data;

          setCompanyId(data.id);

          setOfficeName(data.companyName || "");
          setOwnerName(data.ownerName || "");
          setAddress(data.address || "");
          setPhone(data.phone || "");
          setEmail(data.email || "");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isUpdateMode]);

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();

    formData.append("companyName", officeName);
    formData.append("ownerName", ownerName);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("email", email);

    if (logo) {
      formData.append("logo", logo);
    }

    try {
      if (isUpdateMode) {
        await updateCompanyInfo(formData);

        setSuccessMessage("اطلاعات صرافی با موفقیت ویرایش شد.");
      } else {
        await saveInfo(formData);

        setSuccessMessage("اطلاعات صرافی با موفقیت ثبت شد.");

        setOfficeName("");
        setOwnerName("");
        setAddress("");
        setPhone("");
        setEmail("");
        setLogo(null);
      }

      setTimeout(() => {
        if (isUpdateMode) {
          navigate("/configurations");
        } else {
          navigate("/sign-up");
        }
      }, 1500);
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMessage("شما قبلاً اطلاعات صرافی را ثبت کرده‌اید.");
      } else {
        setErrorMessage("خطایی رخ داده است، دوباره تلاش کنید.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      {(errorMessage || successMessage) && (
        <div
          className="position-fixed top-50 start-50 translate-middle"
          style={{ zIndex: 9999 }}
        >
          <div
            className={`alert shadow-lg border-0 px-5 py-4 ${
              errorMessage ? "alert-danger" : "alert-success"
            }`}
          >
            <strong>{errorMessage || successMessage}</strong>
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body p-5">
              <h3 className="text-center fw-bold mb-4">
                {isUpdateMode ? "ویرایش اطلاعات صرافی" : "اطلاعات صرافی"}
              </h3>

              <form onSubmit={submitHandler}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">نام صرافی</label>

                    <input
                      type="text"
                      className="form-control"
                      value={officeName}
                      onChange={(e) => setOfficeName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">اسم مالک صرافی</label>

                    <input
                      type="text"
                      className="form-control"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">شماره تلیفون</label>

                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">ایمیل آدرس</label>

                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="col-12 mb-4">
                    <label className="form-label">آدرس</label>

                    <textarea
                      className="form-control"
                      rows="3"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">لوگو</label>

                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setLogo(e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() => navigate("/configurations")}
                  >
                    لغو
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success px-4"
                    disabled={loading}
                  >
                    {loading
                      ? "در حال ذخیره..."
                      : isUpdateMode
                        ? "ویرایش اطلاعات"
                        : "ثبت اطلاعات"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompanyInfo;

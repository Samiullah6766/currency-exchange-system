import React, { useEffect, useState } from "react";
import {
  AddNewCustomer,
  getCustomer,
  updateCustomer,
} from "../../services/CustomerService";
import { useNavigate, useParams } from "react-router-dom";

const AddCustomer = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");

  // ✅ NEW: error message state
  const [errorMessage, setErrorMessage] = useState("");

  const navigator = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getCustomer(id)
        .then((response) => {
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setFatherName(response.data.fatherName || "");
          setEmail(response.data.email);
          setNumber(response.data.number);
          setAddress(response.data.address);
        })
        .catch((error) => console.log(error));
    }
  }, [id]);

  // ✅ NEW: show error helper
  const showError = (message) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const customer = {
      firstName,
      lastName,
      fatherName,
      email,
      number,
      address,
    };

    if (id) {
      updateCustomer(customer, id)
        .then(() => {
          navigator("/customers-list");
        })
        .catch((error) => {
          console.log(error);
          showError(
            "متأسفانه ویرایش اطلاعات مشتری انجام نشد. لطفاً دوباره تلاش کنید.",
          );
        });
    } else {
      AddNewCustomer(customer)
        .then(() => {
          navigator("/customers-list");
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 409) {
            showError(
              `مشتری با نام ${firstName} ${lastName} قبلاً ثبت شده است. لطفاً اطلاعات را تغیر دهید!.`,
            );
          } else {
            showError("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
          }
        });
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
      {/* ✅ CENTERED ERROR MESSAGE */}
      {errorMessage && (
        <div
          className="position-fixed top-50 start-50 translate-middle"
          style={{ zIndex: 1055, width: "100%", maxWidth: "480px" }}
        >
          <div
            className="alert shadow-lg text-center border-0 px-4 py-4 rounded-4"
            style={{
              backgroundColor: "#fff3cd",
              color: "#664d03",
            }}
          >
            <div className="fs-4 fw-bold mb-2">⚠️ Customer Already Exists</div>

            <div className="fs-5">{errorMessage}</div>
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
          {/* Header */}
          <div className="card-header bg-white py-4">
            <h3 className="mb-1 fw-bold text-dark">
              {id ? "ویرایش مشتری" : "ثبت مشتری"}
            </h3>
            <small className="text-muted">ثبت اطلاعات مشتری</small>
          </div>

          {/* Form */}
          <div className="card-body p-5">
            <form onSubmit={handleRegister}>
              <div className="row g-3">
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">نام</label>
                  <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">تخلص</label>
                  <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">نام پدر</label>
                  <input
                    type="text"
                    className="form-control"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                  />
                </div>

                <div className="col-lg-6 col-md-6">
                  <label className="form-label text-secondary">ایمیل</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="col-lg-6 col-md-6">
                  <label className="form-label text-secondary">
                    شماره تلیفون
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label text-secondary">ادرس</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => navigator("/customers-list")}
                >
                  لغو
                </button>

                <button type="submit" className="btn btn-success px-4">
                  {id ? "ویرایش مشتری" : "ثبت مشتری"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;

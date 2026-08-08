import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddTransaction,
  updateTransaction,
  getTransaction,
} from "../../services/TransactionService";

const CreateTransaction = () => {
  const navigator = useNavigate();

  const [type, setType] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [typeOfMoney, setTypeOfMoney] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [error, setError] = useState("");

  const { id } = useParams();
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
      getTransaction(id)
        .then((response) => {
          setCustomerId(response.data.customerId);
          setAmount(formatNumber(String(response.data.amount)));
          setType(response.data.transactionType);
          setDate(response.data.transactionDate);
          setTypeOfMoney(response.data.moneyType);
          setNote(response.data.note);
        })
        .catch((error) => console.log(error));
    }
  }, [id]);

  const showError = (message) => {
    setError(message);

    setTimeout(() => {
      setError("");
    }, 3000);
  };

  const handleCreation = (e) => {
    e.preventDefault();

    const transactionData = {
      customerId,
      transactionType: type,
      amount: removeCommas(amount),
      transactionDate: date,
      moneyType: typeOfMoney,
      note,
    };

    if (id) {
      updateTransaction(id, transactionData)
        .then((response) => {
          navigator("/transactions-list");
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            showError(
              `There is not sufficient ${typeOfMoney?.toLowerCase()} balance.`,
            );
          } else {
            showError("Something went wrong!");
          }
        });
    } else {
      AddTransaction(transactionData)
        .then((response) => {
          navigator("/transactions-list");
        })
        .catch((error) => {
          if (error.response?.status === 400) {
            showError(
              `There is not sufficient ${typeOfMoney?.toLowerCase()} balance.`,
            );
          } else if (error.response?.status === 404) {
            showError("❌ مشتری با این ID وجود ندارد");
          } else {
            showError("Something went wrong!");
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
      {/* Error Message */}
      {error && (
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
            <div className="fs-4 fw-bold mb-2">⚠️ Transaction Error</div>

            <div className="fs-5">{error}</div>
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
              {id ? "ویرایش" : "اضافه کردن معامله"}
            </h3>
            <small className="text-muted">اطلاعات معامله</small>
          </div>

          {/* Form */}
          <div className="card-body p-5">
            <form onSubmit={handleCreation}>
              <div className="row g-3">
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">مشتری ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    required
                  />
                </div>

                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">
                    نوع معامله
                  </label>
                  <select
                    className="form-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      انتخاب نوع معامله
                    </option>
                    <option value="BORROWED">برده گی</option>
                    <option value="RETURNED">رسیده گی</option>
                  </select>
                </div>

                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">نوع پول</label>
                  <select
                    className="form-select"
                    value={typeOfMoney}
                    onChange={(e) => setTypeOfMoney(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      انتخاب پول
                    </option>
                    <option value="DOLLAR">دالر</option>
                    <option value="AFGHANI">افغانی</option>
                    <option value="TOMAN">تومان</option>
                    <option value="KALDARA">کالدار</option>
                    <option value="EURO">یرو</option>
                  </select>
                </div>

                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">مقدار</label>
                  <input
                    type="text"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(formatNumber(e.target.value))}
                    required
                  />
                </div>

                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">تاریخ</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="col-lg-4 col-md-12">
                  <label className="form-label text-secondary">یاداشت</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => navigator("/transactions-list")}
                >
                  لغو
                </button>

                <button type="submit" className="btn btn-success px-4">
                  {id ? "ویرایش معامله" : "ثبت معامله"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTransaction;

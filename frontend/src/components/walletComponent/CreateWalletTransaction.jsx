import React, { useState } from "react";
import { walletTransaction } from "../../services/WalletService";
import { useNavigate } from "react-router-dom";

const CreateWalletTransaction = () => {
  const [walletId, setWalletId] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");
  const [moneyType, setMoneyType] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [insufficientBalance, setInsufficientBalance] = useState(false);

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
    return value.replace(/,/g, "");
  };
  const url = useNavigate();
  const data = {
    walletId,
    transactionType,
    moneyType,
    amount: removeCommas(amount),
    note,
    date,
  };
  const handleCreation = (e) => {
    e.preventDefault();

    walletTransaction(data)
      .then((response) => {
        console.log(response.data);
        url("/wallet-transactions");
      })
      .catch((error) => {
        console.error(error);

        const status = error?.response?.status;

        if (status === 400) {
          setInsufficientBalance(true);
        }
      });
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
      {/* Insufficient Balance Error */}
      {insufficientBalance && (
        <div
          className="position-fixed top-50 start-50 translate-middle"
          style={{ zIndex: 1055, width: "100%", maxWidth: "550px" }}
        >
          <div
            className="alert shadow-lg border-0 rounded-4 p-4 text-center"
            style={{
              backgroundColor: "#fff3cd",
              color: "#664d03",
            }}
          >
            <div className="fs-4 fw-bold mb-3">⚠️ بلانس ناکافی</div>

            <p className="mb-2 fs-5">
              موجودی <strong>{moneyType}</strong> شما کافی نیست.
            </p>

            <p className="text-muted">
              لطفاً قبل از انجام این تراکنش، به حساب <strong>{moneyType}</strong>{" "}
               اضافه کنید
            </p>

            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                className="btn btn-success px-4"
                onClick={() => url("/wallet")}
              >
                رفتن به خزانه
              </button>

              <button
                className="btn btn-outline-secondary px-4"
                onClick={() => setInsufficientBalance(false)}
              >
                بستن
              </button>
            </div>
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
            <h3 className="mb-1 fw-bold text-dark">ایجاد کردن معامله خزانه</h3>

            <small className="text-muted">اطلاعات برای ایجاد معامله</small>
          </div>

          {/* Form */}
          <div className="card-body p-5">
            <form onSubmit={handleCreation}>
              <div className="row g-3">
                {/* Wallet ID */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">خزانه ID</label>

                  <input
                    type="number"
                    className="form-control"
                    placeholder="خزانه ID"
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                    required
                  />
                </div>

                {/* Transaction Type */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">
                    نوع معامله
                  </label>

                  <select
                    className="form-select"
                    placeholder="انتخاب کردن نوع معامله"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      نوع معامله
                    </option>
                    <option value="WITHDRAW">کشیدن پول</option>
                    <option value="DEPOSIT">وارد کردن پول</option>
                  </select>
                </div>

                {/* Money Type */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">نوع پول</label>

                  <select
                    className="form-select"
                    placeholder="انتخاب کردن نوع پول"
                    value={moneyType}
                    onChange={(e) => setMoneyType(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      انتخاب نوع پول
                    </option>
                    <option value="DOLLAR">دالر</option>
                    <option value="AFGHANI">افغانی</option>
                    <option value="TOMAN">تومان</option>
                    <option value="KALDARA">کالدار</option>
                    <option value="EURO">یورو</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">مقدار</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="مقدار پول"
                    value={amount}
                    onChange={(e) => setAmount(formatNumber(e.target.value))}
                    required
                  />
                </div>

                {/* Transaction Date */}
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

                {/* Note */}
                <div className="col-lg-4 col-md-12">
                  <label className="form-label text-secondary">یاداشت</label>

                  <input
                    type="text"
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
                  onClick={() => url(-1)}
                >
                  لغو
                </button>

                <button type="submit" className="btn btn-success px-4">
                  ثبت معامله
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWalletTransaction;

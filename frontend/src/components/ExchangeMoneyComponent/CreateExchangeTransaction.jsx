import React, { useState } from "react";
import { createExchangeTransaction } from "../../services/ExchangeTransactionService";
import { useNavigate } from "react-router-dom";
import { currencyLabel } from "../../services/dateUtils";

const CreateExchangeTransaction = () => {
  const [customerId, setCustomerId] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [buyingExchangeRate, setBuyingExchangeRate] = useState("");
  const [sellingExchangeRate, setSellingExchangeRate] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  // 👇 error state
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [customerNotFound, setCustomerNotFound] = useState(false);

  const [showCalculator, setShowCalculator] = useState(false);

  // states of form for finding the Exchange Rate
  const [amount, setAmount] = useState("");
  const [amountCurrency, setAmountCurrency] = useState("");

  const [rateToAfg, setRateToAfg] = useState("");

  const [targetCurrency, setTargetCurrency] = useState("");
  const [targetRate, setTargetRate] = useState("");

  const [result, setResult] = useState("");
  const [afghaniAmount, setAfghaniAmount] = useState("");

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
    return value.replace(/,/g, "");
  };

  const handleCreation = (e) => {
    e.preventDefault();

    const data = {
      customerId,
      fromCurrency,
      toCurrency,
      fromAmount: removeCommas(fromAmount),
      buyingExchangeRate: removeCommas(buyingExchangeRate),
      sellingExchangeRate: removeCommas(sellingExchangeRate),
      note,
      transactionDate: date,
    };

    createExchangeTransaction(data)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setInsufficientBalance(false);
          navigator("/exchange-list");
        }
      })
      .catch((error) => {
        console.error(error);

        const status = error?.response?.status;

        if (status === 400) {
          setInsufficientBalance(true);
        }

        if (status === 404) {
          setCustomerNotFound(true);

          setTimeout(() => {
            setCustomerNotFound(false);
          }, 3000);
        }
      });
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    let afg = 0;

    if (amountCurrency === "DOLLAR" || amountCurrency === "EURO" || amountCurrency === "TOMAN") {
      afg = Number(removeCommas(amount)) * Number(rateToAfg);
    }

    const finalResult = (1000000 * afg) / Number(removeCommas(targetRate));

    setAfghaniAmount(afg);
    setResult(finalResult);
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

            <p className="mb-2 fs-5" dir="rtl">
              به حد کافی پول{" "}
              <strong>
                <bdi>{toCurrency}</bdi>
              </strong>{" "}
              در خزانه موجود نیست
            </p>

            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                className="btn btn-success px-4"
                onClick={() => navigator("/wallet")}
              >
                رفتن به خزانه
              </button>

              <button
                className="btn btn-outline-secondary px-4"
                onClick={() => setInsufficientBalance(false)}
              >
                بسته کردن
              </button>
            </div>
          </div>
        </div>
      )}
      {customerNotFound && (
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
              backgroundColor: "#dc3545",
              border: "3px solid white",
            }}
          >
            <p className="mb-0 fs-5" dir="rtl">
              ❌ مشتری با این <strong>ID</strong> وجود ندارد.
            </p>
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
            <div className="d-flex justify-content-between align-items-center">
              {/* Title (Right side in RTL) */}
              <div>
                <h3 className="mb-1 fw-bold text-dark">
                  ایجاد کردن معامله خرید و فروش
                </h3>

                <small className="text-muted">اطلاعات معامله برای ثبت</small>
              </div>

              {/* Calculator button (Left side in RTL) */}
              <button
                className="btn btn-warning"
                onClick={() => setShowCalculator(!showCalculator)}
              >
                <i className="bi bi-calculator me-2"></i>
                محاسبه اسعار
              </button>
            </div>
          </div>
          {/* Currency Calculator */}

          <div
            className={`calculator-wrapper ${
              showCalculator ? "calculator-open" : ""
            }`}
          >
            {showCalculator && (
              <div className="card shadow border-0 mb-3">
                <div className="card-header bg-warning d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-calculator me-2"></i>
                    محاسبه اسعار
                  </h5>

                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => setShowCalculator(false)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <form className="card-body" onSubmit={handleCalculate}>
                  <div className="row g-2 justify-content-start">
                    {/* Amount + Currency */}

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">مقدار</label>

                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={amount}
                          onChange={(e) =>
                            setAmount(formatNumber(e.target.value))
                          }
                        />

                        <select
                          className="form-select"
                          value={amountCurrency}
                          onChange={(e) => setAmountCurrency(e.target.value)}
                          style={{ maxWidth: "110px" }}
                        >
                          <option value="" disabled>
                            انتخاب پول
                          </option>
                          <option value="DOLLAR">دالر</option>
                          <option value="TOMAN">تومان</option>
                          <option value="KALDARA">کالدار</option>
                          <option value="EURO">یورو</option>
                        </select>
                      </div>
                    </div>

                    {/* Rate to AFG */}

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        نرخ به افغانی
                      </label>

                      <input
                        type="number"
                        value={rateToAfg}
                        className="form-control"
                        onChange={(e) => setRateToAfg(e.target.value)}
                      />
                    </div>

                    {/* Target Currency + Rate */}

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        نرخ اسعار مقصد به افغانی
                      </label>

                      <div className="input-group">
                        <input
                          type="text"
                          value={targetRate}
                          className="form-control"
                          onChange={(e) =>
                            setTargetRate(formatNumber(e.target.value))
                          }
                        />

                        <select
                          className="form-select"
                          value={targetCurrency}
                          onChange={(e) => setTargetCurrency(e.target.value)}
                          style={{ maxWidth: "120px" }}
                        >
                          <option value="" disabled>
                            انتخاب پول
                          </option>
                          <option value="DOLLAR">دالر</option>
                          <option value="TOMAN">تومان</option>
                          <option value="KALDARA">کالدار</option>
                          <option value="EURO">یورو</option>
                        </select>
                      </div>
                    </div>

                    {/* Calculate Button */}

                    <div className="col-12">
                      <button className="btn btn-primary w-100">
                        <i className="bi bi-calculator me-2"></i>
                        محاسبه
                      </button>
                    </div>
                  </div>

                  <hr />

                  {/* Result */}

                  <div className="alert alert-success mb-0">
                    <div className="row text-center">
                      <div className="col-md-4">
                        <small className="text-muted d-block">
                          مقدار اولیه
                        </small>

                        <h5 className="fw-bold">
                          {amount.toLocaleString()}{" "}
                          {currencyLabel(amountCurrency)}
                        </h5>
                      </div>

                      <div className="col-md-4">
                        <small className="text-muted d-block">افغانی</small>

                        <h5 className="fw-bold">
                          {afghaniAmount.toLocaleString()} AFG
                        </h5>
                      </div>

                      <div className="col-md-4">
                        <small className="text-muted d-block">نتیجه</small>

                        <h5 className="fw-bold text-primary">
                          {result.toLocaleString()}{" "}
                          {currencyLabel(targetCurrency)}
                        </h5>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="card-body p-5">
            <form onSubmit={handleCreation}>
              <div className="row g-3">
                {/* Customer ID */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">ID مشتری</label>
                  <input
                    type="number"
                    className="form-control"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    required
                  />
                </div>

                {/* From Currency */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">از</label>

                  <select
                    className="form-select"
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      انتخاب واحد پولی
                    </option>
                    <option value="DOLLAR">دالر</option>
                    <option value="AFGHANI">افغانی</option>
                    <option value="TOMAN">تومان</option>
                    <option value="KALDARA">کالدار</option>
                    <option value="EURO">یورو</option>
                  </select>
                </div>

                {/* To Currency */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">به</label>

                  <select
                    className="form-select"
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      انتخاب واحد پولی
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
                    value={fromAmount}
                    onChange={(e) =>
                      setFromAmount(formatNumber(e.target.value))
                    }
                    required
                  />
                </div>

                {/* Buying Rate */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">نرخ خرید</label>

                  <input
                    type="text"
                    className="form-control"
                    value={buyingExchangeRate}
                    onChange={(e) =>
                      setBuyingExchangeRate(formatNumber(e.target.value))
                    }
                    required
                  />
                </div>

                {/* Selling Rate */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">نرخ فروش</label>

                  <input
                    type="text"
                    className="form-control"
                    value={sellingExchangeRate}
                    onChange={(e) =>
                      setSellingExchangeRate(formatNumber(e.target.value))
                    }
                    required
                  />
                </div>

                {/* Date */}
                <div className="col-lg-6 col-md-6">
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
                <div className="col-lg-6 col-md-12">
                  <label className="form-label text-secondary">یاداشت</label>

                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder="یاداشت را وارد کنید ..."
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
                  onClick={() => navigator("/exchange-list")}
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

export default CreateExchangeTransaction;

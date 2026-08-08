import React, { useState } from "react";
import { getInterest } from "../../services/ExchangeTransactionService";
import DatePickerModule from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from "react-router-dom";

const FinancialReport = () => {
  const [monthInterest, setMonthInterest] = useState({
    dollarInterest: 0,
    euroInterest: 0,
    afghaniInterest: 0,
    tomanInterest: 0,
    kaldaraInterest: 0,
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigator = useNavigate();

  const goBack = () => {
    navigator(-1);
  };

  const DatePicker = DatePickerModule.default;

  const handleGenerateReport = () => {
    if (!startDate || !endDate) return;

    setLoading(true);

    const payload = {
      startDate: startDate.convert("gregorian").toDate(),
      endDate: endDate.convert("gregorian").toDate(),
    };

    getInterest(payload)
      .then((res) => setMonthInterest(res.data))
      .catch((error) => {
        if (error.res?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          console.log("Error:", error);
        }
      })
      .finally(() => setLoading(false));
  };

  const cardData = [
    {
      title: "دالر",
      value: monthInterest.dollarInterest,
      color: "#198754",
      icon: "$",
      sub: "USD",
    },
    {
      title: "یورو",
      value: monthInterest.euroInterest,
      color: "#6f42c1",
      icon: "€",
      sub: "EUR",
    },
    {
      title: "افغانی",
      value: monthInterest.afghaniInterest,
      color: "#0d6efd",
      icon: "؋",
      sub: "AFN",
    },
    {
      title: "تومان",
      value: monthInterest.tomanInterest,
      color: "#dc3545",
      icon: "₮",
      sub: "IRR",
    },
    {
      title: "کالدار",
      value: monthInterest.kaldaraInterest,
      color: "#fd7e14",
      icon: "₨",
      sub: "PKR",
    },
  ];

  return (
    <div className="container py-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        {/* Title (Right side in RTL) */}
        <div>
          <h1 className="fw-bold mb-0">گزارش مالی</h1>

          <small className="text-muted">
            مشاهده مفاد معاملات در بازه زمانی مشخص
          </small>
        </div>

        {/* Arrow (Opposite side) */}
        <button
          className="btn btn-light border rounded-circle"
          onClick={goBack}
          title="بازگشت"
          style={{
            width: "42px",
            height: "42px",
          }}
        >
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="card border-0 shadow-lg mb-5 rounded-4">
        <div className="card-body p-4">
          <div className="row align-items-center g-4">
            {/* START DATE */}
            <div className="col-md-4">
              <div className="p-3 rounded-4 border bg-light shadow-sm">
                <label className="form-label fw-semibold text-secondary mb-2">
                  📅 شروع تاریخ
                </label>

                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  value={startDate}
                  onChange={setStartDate}
                  className="form-control border-0 bg-white shadow-sm"
                />
              </div>
            </div>

            {/* END DATE */}
            <div className="col-md-4">
              <div className="p-3 rounded-4 border bg-light shadow-sm">
                <label className="form-label fw-semibold text-secondary mb-2">
                  📅 ختم تاریخ
                </label>

                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  value={endDate}
                  onChange={setEndDate}
                  className="form-control border-0 bg-white shadow-sm"
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="col-md-4 d-flex align-items-end">
              <button
                onClick={handleGenerateReport}
                disabled={!startDate || !endDate || loading}
                className="btn btn-dark btn-lg w-100 rounded-4 shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Generating...
                  </>
                ) : (
                  "ایجاد گزارش"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="row g-4">
        {cardData.map((item, i) => (
          <div className="col-lg col-md-4 col-sm-6" key={i}>
            <div className="card border-0 shadow-sm h-100 rounded-4">
              <div className="card-body text-center p-4">
                {/* ICON */}
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center shadow"
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    color: "white",
                    fontSize: "26px",
                    fontWeight: "bold",
                  }}
                >
                  {item.icon}
                </div>

                <h6 className="text-muted mb-1">{item.title}</h6>
                <small className="text-secondary">{item.sub}</small>

                <h3 className="fw-bold mt-3" style={{ color: item.color }}>
                  {new Intl.NumberFormat().format(item.value)}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialReport;

import React, { useEffect, useState } from "react";
import { Link, Links, useNavigate } from "react-router-dom";
import { getExchangeTransactions } from "../../services/ExchangeTransactionService";
import { toShamsi } from "../../services/dateUtils";
import "bootstrap-icons/font/bootstrap-icons.css";

const ExchangeTransactionList = () => {
  const [exchangeTransactions, setExchangeTransactions] = useState([]);
  const navigator = useNavigate();

  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 7; // or 11
  const goBack = () => {
    navigator(-1);
  };

  const addNewTransaction = () => {
    navigator("/create-exchangeTransaction");
  };

  useEffect(() => {
    getExchangeTransactions()
      .then((response) => {
        setExchangeTransactions(response.data.sort((a, b) => b.id - a.id));
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          console.log("Error:", error);
        }
      });
  }, []);
  const currencyLabel = (type) => {
    switch ((type || "").toUpperCase()) {
      case "DOLLAR":
        return "USD";
      case "AFGHANI":
        return "AFG";
      case "EURO":
        return "EUR";
      case "KALDARA":
        return "Rs";
      case "TOMAN":
        return "Toman";
      default:
        return type || "";
    }
  };

  const moneyBox = (currency, amount) => (
    <div
      className="d-inline-flex border rounded overflow-hidden"
      style={{
        width: "fit-content",
        direction: "ltr",
      }}
    >
      <span
        className="px-2 py-1 bg-light border-end fw-semibold"
        style={{ fontSize: "12px" }}
      >
        {currencyLabel(currency)}
      </span>

      <span className="px-3 py-1 fw-bold">
        {Number(amount || 0).toLocaleString()}
      </span>
    </div>
  );
  const displayedTransactions = showAll
    ? exchangeTransactions
    : exchangeTransactions.slice(0, INITIAL_COUNT);
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-light border rounded-circle me-3"
            onClick={goBack}
            title="بازگشت"
          >
            <i className="bi bi-arrow-right"></i>
          </button>

          <h3 className="fw-bold mb-0">معاملات خرید و فروش</h3>
        </div>

        <button className="btn btn-primary" onClick={addNewTransaction}>
          <i className="bi bi-plus-lg me-2"></i>
          اضافه کردن
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>مشتری</th>
                <th>یاداشت</th>
                <th>از</th>
                <th>به</th>
                <th>نرخ فروش</th>
                <th>مفاد</th>
                <th>تاریخ</th>
              </tr>
            </thead>

            <tbody>
              {exchangeTransactions.length > 0 ? (
                displayedTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className="fw-bold text-primary">#{t.id}</span>
                    </td>

                    <td>
                      <span className="badge bg-light text-dark border px-3 py-2">
                        <i className="bi bi-person-fill"></i>
                        <Link
                          to={`/customerExchanges/${t.customerId}`}
                          className="text-decoration-none"
                        >
                          {t.customerName}
                        </Link>
                      </span>
                    </td>
                    <td>
                      <div
                        className="d-inline-flex border rounded overflow-hidden"
                        style={{
                          width: "fit-content",
                          maxWidth: "280px",
                        }}
                        title={t.note}
                      >
                        <span
                          className="px-2 py-1 bg-warning-subtle border-end fw-semibold"
                          style={{ fontSize: "12px" }}
                        >
                          📝
                        </span>

                        <span
                          className="px-3 py-1 text-truncate"
                          style={{ maxWidth: "220px" }}
                        >
                          {t.note || "-"}
                        </span>
                      </div>
                    </td>

                    <td>{moneyBox(t.fromCurrency, t.fromAmount)}</td>

                    <td>{moneyBox(t.toCurrency, t.toAmount)}</td>

                    <td>
                      <span className="fw-semibold">
                        {t.buyingExchangeRate}
                      </span>
                    </td>

                    <td>{moneyBox(t.toCurrency, t.interest)}</td>

                    <td>{toShamsi(t.transactionDate)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No exchange transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {exchangeTransactions.length > INITIAL_COUNT && (
          <div className="text-center py-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  <i className="bi bi-chevron-up me-2"></i>
                  نمایش کمتر
                </>
              ) : (
                <>
                  <i className="bi bi-chevron-down me-2"></i>
                  نمایش همه ({exchangeTransactions.length - INITIAL_COUNT} بیشتر)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangeTransactionList;

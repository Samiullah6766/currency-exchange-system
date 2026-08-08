import React, { useEffect, useState } from "react";
import { ownerTransactions } from "../../services/OwnerExchangeTransaction";
import { useNavigate } from "react-router-dom";
import { toShamsi } from "../../services/dateUtils";

const OwnerExchangeList = () => {
  const [transactions, setTransactions] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 7; // or 11
  const navigate = useNavigate();

  useEffect(() => {
    ownerTransactions()
      .then((response) => {
        setTransactions(response.data.sort((a, b) => b.id - a.id));
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
      case "KALDARA":
        return "Rs";
      case "TOMAN":
        return "Toman";
      case "EURO":
        return "Euro";
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
  const addNewTransaction = () => {
    navigate("/owner-exchange");
  };
  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, INITIAL_COUNT);
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">خرید و فروش دفتر</h3>

        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={addNewTransaction}
          >
            <i className="bi bi-plus-lg"></i>
            اضافه کردن معامله
          </button>
          <button
            className="btn btn-outline-secondary rounded-circle shadow-sm"
            style={{
              width: "42px",
              height: "42px",
            }}
            onClick={() => navigate(-1)}
            title="بازگشت"
          >
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>یاداشت</th>
                <th>از</th>
                <th>به</th>
                <th>نرخ خرید</th>
                <th>مفتاد</th>
                <th>تاریخ</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length > 0 ? (
                displayedTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className="fw-bold text-primary">#{t.id}</span>
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
        {transactions.length > INITIAL_COUNT && (
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
                    نمایش همه ({transactions.length - INITIAL_COUNT} بیشتر)
                  </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerExchangeList;

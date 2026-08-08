import React, { useState, useEffect } from "react";
import { getAllTransactions } from "../../services/TransactionService";
import { useNavigate } from "react-router-dom";
import { toShamsi } from "../../services/dateUtils";

const ListOfTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 10; // or 11
  const navigator = useNavigate();

  useEffect(() => {
    getAllTransactions()
      .then((response) => {
        setTransactions(
          response.data.sort((a, b) => b.transactionId - a.transactionId),
        );
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

  const goBack = () => {
    navigator(-1);
  };

  const removeTransaction = (id) => {
    navigator("/delete-transaction/" + id);
  };

  const updateTransaction = (id) => {
    navigator("/create-transaction/" + id);
  };

  const addNewTransactions = () => {
    navigator("/create-transaction");
  };

  const currencyLabel = (type) => {
    switch ((type || "").toUpperCase()) {
      case "DOLLAR":
        return "USD";
      case "AFGHANI":
        return "AFG";
      case "KALDARA":
        return "Rs";
      case "EURO":
        return "EUR";
      case "TOMAN":
        return "Toman";
      default:
        return type || "";
    }
  };

  const isBorrowed = (type) => {
    return (
      type?.toLowerCase().includes("borrow") ||
      type?.toLowerCase().includes("loan")
    );
  };
  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, INITIAL_COUNT);
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-light border rounded-circle ms-3"
            onClick={goBack}
            title="بازگشت"
          >
            <i className="bi bi-arrow-right"></i>
          </button>

          <h3 className="fw-bold mb-0">روزنامچه</h3>
        </div>

        <button className="btn btn-primary" onClick={addNewTransactions}>
          <i className="bi bi-plus-lg me-2"></i>
          اضافه کردن معامله
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
                <th>مقدار</th>
                <th>نوع معامله</th>
                <th>تاریخ</th>
                <th className="text-center">ویرایش</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length > 0 ? (
                displayedTransactions.map((t) => (
                  <tr key={t.transactionId}>
                    <td>
                      <span className="fw-bold text-primary">
                        #{t.transactionId}
                      </span>
                    </td>

                    <td>
                      <a
                        href={"/customer-transactions/" + t.customerId}
                        className="text-decoration-none fw-semibold"
                      >
                        {t.customerName}
                      </a>
                    </td>

                    <td>
                      <div
                        className="d-inline-flex border rounded overflow-hidden"
                        style={{
                          width: "fit-content",
                          maxWidth: "300px",
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
                          style={{
                            maxWidth: "250px",
                          }}
                        >
                          {t.note || "-"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div
                        className="d-inline-flex border rounded overflow-hidden"
                        style={{
                          width: "fit-content",
                          direction: "ltr",
                        }}
                      >
                        <span
                          className="px-2 py-1 fw-semibold bg-light border-end"
                          style={{ fontSize: "12px" }}
                        >
                          {currencyLabel(t.moneyType)}
                        </span>

                        <span className="px-3 py-1 fw-bold">
                          {Number(t.amount).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge px-3 py-2 ${
                          isBorrowed(t.transactionType)
                            ? "bg-danger"
                            : "bg-success"
                        }`}
                      >
                        {t.transactionType == "BORROWED"
                          ? "برده گی"
                          : "رسیده گی"}
                      </span>
                    </td>

                    <td>{toShamsi(t.transactionDate)}</td>

                    <td className="text-center">
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => updateTransaction(t.transactionId)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>


                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No transactions found.
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

export default ListOfTransactions;

import React, { useEffect, useState } from "react";
import { getAllWalletTransactions } from "../../services/WalletService";
import { useNavigate } from "react-router-dom";
import { currencyLabel, toShamsi } from "../../services/dateUtils";

const WalletTransactions = () => {
  const [walletTransactions, setWalletTransactions] = useState([]);
  const navigator = useNavigate();
  const [showAll, setShowAll] = useState(false);

const INITIAL_COUNT = 7; // or 11

  useEffect(() => {
    getAllWalletTransactions().then((response) => {
      setWalletTransactions(
        response.data.sort((a, b) => b.transactionId - a.transactionId),
      );
    });
  }, []);

  const addNewTransaction = () => {
    navigator("/create-wallet-transaction");
  };

  const isDeposit = (type) => {
    return (type || "").toLowerCase().includes("deposit");
  };
const displayedTransactions = showAll
  ? walletTransactions
  : walletTransactions.slice(0, INITIAL_COUNT);
  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">معاملات خزانه</h3>

        <button className="btn btn-primary" onClick={addNewTransaction}>
          <i className="bi bi-plus-lg me-2"></i>
          اضافه کردن معامله خزانه
        </button>
      </div>

      {/* Table Card */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>یاداشت</th>
                <th>نوع معامله</th>
                <th>مقدار</th>

                <th>اضافه شد توسط</th>
                <th>تاریخ</th>
              </tr>
            </thead>

            <tbody>
              {walletTransactions.length > 0 ? (
                displayedTransactions.map((transaction) => (
                  <tr key={transaction.transactionId}>
                    {/* ID */}
                    <td>
                      <span className="fw-bold text-primary">
                        #{transaction.transactionId}
                      </span>
                    </td>

                    {/* Note */}
                    <td>
                      <div
                        className="d-inline-flex border rounded overflow-hidden"
                        style={{
                          width: "fit-content",
                          maxWidth: "300px",
                        }}
                        title={transaction.note}
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
                          {transaction.note || "-"}
                        </span>
                      </div>
                    </td>

                    {/* Transaction Type */}
                    <td>
                      <span
                        className={`badge px-3 py-2 ${
                          isDeposit(transaction.transactionType)
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {transaction.transactionType == "DEPOSIT"
                          ? "وارد شده"
                          : "کشیده شده"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td>
                      <div
                        className="d-inline-flex border rounded overflow-hidden"
                        style={{ width: "fit-content" }}
                      >
                        <span className="px-3 py-1 fw-bold">
                          {Number(transaction.amount).toLocaleString()}
                        </span>
                        <span
                          className="px-2 py-1 fw-semibold bg-light border-end"
                          style={{ fontSize: "12px" }}
                        >
                          {currencyLabel(transaction.moneyType)}
                        </span>
                      </div>
                    </td>

                    {/* Created By */}
                    <td>
                      <span className="badge bg-secondary px-3 py-2">
                        {transaction.createdBy || "-"}
                      </span>
                    </td>

                    {/* Date */}
                    <td>{toShamsi(transaction.date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No wallet transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {walletTransactions.length > INITIAL_COUNT && (
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
                  نمایش همه ({walletTransactions.length - INITIAL_COUNT} بیشتر)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletTransactions;

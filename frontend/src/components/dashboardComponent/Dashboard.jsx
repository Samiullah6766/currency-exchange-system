import React, { useEffect, useState } from "react";
import { numberofCustomers } from "../../services/CustomerService";
import {
  getAllBorrowed,
  getAllTransactions,
  numOfTransactions,
} from "../../services/TransactionService";
import {
  getExchangeTransactions,
  getNumberOfExchangeTransactions,
  todayInterest,
} from "../../services/ExchangeTransactionService";
import { getWallet } from "../../services/WalletService";
import { toShamsi } from "../../services/dateUtils";
import { allUsers } from "../../services/UserService";

const Dashboard = () => {
  const [numCustomers, setNumCustomers] = useState("");
  const [numTransactions, setNumTransactions] = useState("");
  const [numExchangeOperations, setNumExchangeOperations] = useState("");
  const [wallet, setWallet] = useState({});
  const [borrowed, setBorrowed] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentExchanges, setRecentExchanges] = useState([]);
  const [todayProfit, setTodayProfit] = useState([]);
  const [users, setUsers] = useState([]);

  const INITIAL_COUNT = 10;

  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showAllExchanges, setShowAllExchanges] = useState(false);

  useEffect(() => {
    numberofCustomers().then((response) => {
      setNumCustomers(response.data);
      console.log(response.data);
    });
    numOfTransactions().then((response) => {
      setNumTransactions(response.data);
    });
    getNumberOfExchangeTransactions().then((res) => {
      setNumExchangeOperations(res.data);
    });
    getWallet().then((response) => {
      setWallet(response.data);
    });

    getAllBorrowed().then((response) => {
      setBorrowed(response.data);
    });

    getAllTransactions().then((response) => {
      const recent = response.data.sort(
        (a, b) => b.transactionId - a.transactionId,
      );

      setRecentTransactions(recent);
    });

    getExchangeTransactions().then((response) => {
      const recent = response.data.sort(
        (a, b) => b.transactionId - a.transactionId,
      );

      setRecentExchanges(recent);
    });

    todayInterest().then((response) => {
      setTodayProfit(response.data);
    });
    allUsers()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const currencyLabel = (type) => {
    switch ((type || "").toUpperCase()) {
      case "DOLLAR":
        return "USD";
      case "AFGHANI":
        return "AFG";
      case "KALDARA":
      case "EURO":
        return "EURO";
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
      style={{ width: "fit-content" }}
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

  const displayedTransactions = showAllTransactions
    ? recentTransactions
    : recentTransactions.slice(0, INITIAL_COUNT);

  const displayedExchanges = showAllExchanges
    ? recentExchanges
    : recentExchanges.slice(0, INITIAL_COUNT);

  return (
    <div
      className="container-fluid py-4"
      style={{
        minHeight: "100vh",
        background: "#f4f7fc",
      }}
    >
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">دشبورد</h2>
      </div>

      {/* Top Statistics */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">تعداد مشتریان</h6>
              <h2 className="fw-bold text-primary">{numCustomers}</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">تعداد معاملات</h6>
              <h2 className="fw-bold text-success">{numTransactions}</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">تعداد خرید و فروش ها</h6>
              <h2 className="fw-bold text-warning">{numExchangeOperations}</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">یوزر ها</h6>
              <h2 className="fw-bold text-danger">{users?.length}</h2>
            </div>
          </div>
        </div>
      </div>
      {/* Today's Profit */}
      {/* Today's Profit */}
      <div className="card border-0 shadow mb-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">مفاد امروز</h5>
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="bg-primary text-white rounded p-3 text-center h-100">
                <h6 className="mb-2">دالر</h6>
                <h4 className="mb-0">
                  ${Number(todayProfit?.dollarInterest || 0).toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="bg-info text-white rounded p-3 text-center h-100">
                <h6 className="mb-2">یرو</h6>
                <h4 className="mb-0">
                  €{Number(todayProfit?.euroInterest || 0).toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="bg-success text-white rounded p-3 text-center h-100">
                <h6 className="mb-2">افغانی</h6>
                <h4 className="mb-0">
                  {Number(todayProfit?.afghaniInterest || 0).toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="bg-warning text-dark rounded p-3 text-center h-100">
                <h6 className="mb-2">تومان</h6>
                <h4 className="mb-0">
                  {Number(todayProfit?.tomanInterest || 0).toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="bg-secondary text-white rounded p-3 text-center h-100">
                <h6 className="mb-2">کالدار</h6>
                <h4 className="mb-0">
                  {Number(todayProfit?.kaldaraInterest || 0).toLocaleString()}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="card border-0 shadow mb-4">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">موجدی خزانه</h5>
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="bg-primary text-white rounded p-3 text-center h-100">
                <h6 className="mb-2">دالر</h6>
                <h4 className="mb-0">
                  ${wallet?.dollarBalance?.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="bg-info text-white rounded p-3 text-center h-100">
                <h6 className="mb-2">یرو</h6>
                <h4 className="mb-0">
                  €{wallet?.euroBalance?.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="bg-success text-white rounded p-3 text-center h-100">
                <h6 className="mb-2">افغانی</h6>
                <h4 className="mb-0">
                  {wallet?.afghaniBalance?.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="bg-warning text-dark rounded p-3 text-center h-100">
                <h6 className="mb-2">تومان</h6>
                <h4 className="mb-0">
                  {wallet?.tomanBalance?.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="bg-secondary text-white rounded p-3 text-center h-100">
                <h6 className="mb-2">کالدار</h6>
                <h4 className="mb-0">
                  {wallet?.kaldaraBalance?.toLocaleString()}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding Debts */}
      <div className="card border-0 shadow mb-4">
        <div className="card-header bg-danger text-white">
          <h5 className="mb-0">اندازه قرض ها</h5>
        </div>

        <div className="card-body">
          <div className="row g-3 text-center">
            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="p-3 border rounded h-100">
                <h6>دالر</h6>
                <h4 className="text-danger mb-0">
                  {borrowed.totalDollarBorrowed?.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="p-3 border rounded h-100">
                <h6>یرو</h6>
                <h4 className="text-danger mb-0">
                  {borrowed.totalEuroBorrowed?.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="p-3 border rounded h-100">
                <h6>افغانی</h6>
                <h4 className="text-danger mb-0">
                  {borrowed.totalAfghaniBorrowed?.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="p-3 border rounded h-100">
                <h6>تومان</h6>
                <h4 className="text-danger mb-0">
                  {borrowed.totalTomanBorrowed?.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 col-xl">
              <div className="p-3 border rounded h-100">
                <h6>کالدار</h6>
                <h4 className="text-danger mb-0">
                  {borrowed.totalKaldaraBorrowed?.toLocaleString()}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tables */}
      <div className="row g-4">
        {/* Recent Transactions */}
        <div className="col-lg-6">
          <div className="card border-0 shadow h-100">
            <div className="card-header bg-primary text-white">
              اخرین معاملات
            </div>

            <div className="card-body table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>مشتری</th>
                    <th>یاداشت</th>
                    <th>نوع</th>
                    <th>مقدار</th>
                    <th>تاریخ</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedTransactions.map((item) => (
                    <tr key={item.transactionId}>
                      <td>{item.customerName}</td>
                      <td>{item.note}</td>
                      <td>
                        <span
                          style={{
                            backgroundColor:
                              item.transactionType === "RETURNED"
                                ? "green"
                                : "red",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          {item.transactionType == "RETURNED"
                            ? "رسیده گی"
                            : "برده گی"}
                        </span>
                      </td>
                      <td>{moneyBox(item.moneyType, item.amount)}</td>
                      <td>{toShamsi(item.transactionDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentTransactions.length > INITIAL_COUNT && (
                <div className="text-center py-3">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowAllTransactions(!showAllTransactions)}
                  >
                    {showAllTransactions ? (
                      <>
                        <i className="bi bi-chevron-up me-2"></i>
                        نمایش کمتر
                      </>
                    ) : (
                      <>
                        <i className="bi bi-chevron-down me-2"></i>
                        نمایش همه ({recentTransactions.length -
                          INITIAL_COUNT}{" "}
                        بیشتر)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Exchanges */}
        <div className="col-lg-6">
          <div className="card border-0 shadow h-100">
            <div className="card-header bg-success text-white">
              اخرین خرید و فروش ها
            </div>

            <div className="card-body table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>مشتری</th>
                    <th>یاداشت</th>
                    <th>از مقدار</th>
                    <th>به مقدار</th>
                    <th>تاریخ</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedExchanges.map((item) => (
                    <tr key={item.id}>
                      <td>{item.customerName}</td>
                      <td>{item.note}</td>
                      <td>{moneyBox(item.fromCurrency, item.fromAmount)}</td>
                      <td>{moneyBox(item.toCurrency, item.toAmount)}</td>
                      <td>{toShamsi(item.transactionDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentExchanges.length > INITIAL_COUNT && (
                <div className="text-center py-3">
                  <button
                    className="btn btn-outline-success"
                    onClick={() => setShowAllExchanges(!showAllExchanges)}
                  >
                    {showAllExchanges ? (
                      <>
                        <i className="bi bi-chevron-up me-2"></i>
                        نمایش کمتر
                      </>
                    ) : (
                      <>
                        <i className="bi bi-chevron-down me-2"></i>
                        نمایش همه ({recentExchanges.length - INITIAL_COUNT}{" "}
                        بیشتر)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

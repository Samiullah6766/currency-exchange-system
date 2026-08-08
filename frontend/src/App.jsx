import HeaderComponent from "./components/dashboardComponent/HeaderComponent";

import FooterComponent from "./components/dashboardComponent/FooterComponent";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerListComponent from "./components/customerComponent/CustomerListComponent";
import AddCustomer from "./components/customerComponent/AddCustomer";
import CreateTransaction from "./components/transactionComponent/CreateTransaction";
import ListOfTransactions from "./components/transactionComponent/ListOfTransactions";
import Home from "./components/dashboardComponent/Dashboard";
import DeleteCustomer from "./components/customerComponent/DeleteCustomer";
import CustomerTransactions from "./components/customerComponent/CustomerTransactions";
import DeleteTransaction from "./components/transactionComponent/DeleteTransaction";
import Dashboard from "./components/dashboardComponent/Dashboard";
import Wallet from "./components/walletComponent/Wallet";
import CreateWallet from "./components/walletComponent/CreateWallet";
import DeleteWallet from "./components/walletComponent/DeleteWallet";
import ExchangeTransactionList from "./components/ExchangeMoneyComponent/ExchangeTransactionList";
import CreateExchangeTransaction from "./components/ExchangeMoneyComponent/CreateExchangeTransaction";
import WalletTransactions from "./components/walletComponent/WalletTransactions";
import CreateWalletTransaction from "./components/walletComponent/CreateWalletTransaction";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FinancialReport from "./components/dashboardComponent/FinancialReport";
import Login from "./components/userComponent/Login";
import Logout from "./components/userComponent/Logout";
import SignUp from "./components/userComponent/SignUp";
import LoginSuccess from "./components/userComponent/LoginSuccess";
import ProtectedRoute from "./components/userComponent/ProtectedRoute";
import CreateRemittance from "./components/remittanceComponent/CreateRemittance";
import Remittances from "./components/remittanceComponent/ViewRemittances";
import ViewRemittances from "./components/remittanceComponent/ViewRemittances";
import CreateCompanyInfo from "./components/companyInfoComponent/CreateCompanyInfo";
import Configurations from "./components/companyInfoComponent/Configurations";
import CustomerExchangeList from "./components/ExchangeMoneyComponent/CustomerExchangeList";
import OwnerExchangeTransaction from "./components/ExchangeMoneyComponent/OwnerExchangeTransaction";
import OwnerExchangeList from "./components/ExchangeMoneyComponent/OwnerExchangeList";
import Sidebar from "./components/dashboardComponent/Siderbar";
import Startup from "./components/companyInfoComponent/Startup";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <HeaderComponent />

          <div className="d-flex flex-grow-1">
            <Sidebar />

            <main className="flex-grow-1 p-3">
              <Routes>
                <Route path="/" element={<Startup />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customers-list"
                  element={
                    <ProtectedRoute>
                      <CustomerListComponent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-customer"
                  element={
                    <ProtectedRoute>
                      <AddCustomer />
                    </ProtectedRoute>
                  }
                />
                <Route path="/update-customer/:id" element={<AddCustomer />} />
                <Route
                  path="/create-transaction"
                  element={
                    <ProtectedRoute>
                      <CreateTransaction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions-list"
                  element={
                    <ProtectedRoute>
                      <ListOfTransactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/delete-customer/:id"
                  element={<DeleteCustomer />}
                />
                <Route
                  path="/customer-transactions/:id"
                  element={
                    <ProtectedRoute>
                      <CustomerTransactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-transaction/:id"
                  element={
                    <ProtectedRoute>
                      <CreateTransaction />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/wallet"
                  element={
                    <ProtectedRoute>
                      <Wallet />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-wallet"
                  element={
                    <ProtectedRoute>
                      <CreateWallet />
                    </ProtectedRoute>
                  }
                />

                <Route path="/update-wallet/:id" element={<CreateWallet />} />
                <Route
                  path="/exchange-list"
                  element={
                    <ProtectedRoute>
                      <ExchangeTransactionList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-exchangeTransaction"
                  element={
                    <ProtectedRoute>
                      <CreateExchangeTransaction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wallet-transactions"
                  element={
                    <ProtectedRoute>
                      <WalletTransactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-wallet-transaction"
                  element={
                    <ProtectedRoute>
                      <CreateWalletTransaction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/report"
                  element={
                    <ProtectedRoute>
                      <FinancialReport />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/login-success" element={<LoginSuccess />} />

                <Route
                  path="/create-remittance"
                  element={
                    <ProtectedRoute>
                      <CreateRemittance />
                    </ProtectedRoute>
                  }
                />
                <Route path="/remittances" element={<ViewRemittances />} />
                <Route
                  path="/create-companyInfo"
                  element={<CreateCompanyInfo />}
                />
                <Route path="/configurations" element={<Configurations />} />
                <Route
                  path="/customerExchanges/:id"
                  element={
                    <ProtectedRoute>
                      <CustomerExchangeList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner-exchange"
                  element={
                    <ProtectedRoute>
                      <OwnerExchangeTransaction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner-exchange-transactions"
                  element={
                    <ProtectedRoute>
                      <OwnerExchangeList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/update-companyInfo"
                  element={<CreateCompanyInfo />}
                />
                <Route
                  path="/update-remittance/:id"
                  element={
                    <ProtectedRoute>
                      <CreateRemittance />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./../../style/header.css";
import { getCompanyInfo } from "../../services/CompanyInfoService";

const HeaderComponent = () => {
  const { isLoggedIn } = useAuth();

  const [companyInfo, setCompanyInfo] = useState({});
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const checkServer = () => {
      getCompanyInfo()
        .then((response) => {
          setCompanyInfo(response.data);
          setIsOnline(true);
        })
        .catch(() => {
          setIsOnline(false);
        });
    };

    checkServer(); // check immediately

    const interval = setInterval(checkServer, 60000); // check every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getCompanyInfo().then((response) => {
      setCompanyInfo(response.data);
    });
  }, []);

  return (
    <nav
      className="navbar navbar-expand-xl navbar-dark ministry-navbar shadow-sm"
      dir="rtl"
    >
      <div className="container-fluid px-3">
        {/* BRAND RIGHT */}

        <Link
          className="navbar-brand d-flex align-items-center gap-3 fw-bold"
          to="/"
        >
          <div className="logo-circle">
            {companyInfo.logoPath && (
              <img
                src={`${import.meta.env.VITE_API_URL}/${companyInfo.logoPath.replace("\\", "/")}`}
                alt="Company Logo"
              />
            )}
          </div>

          <span className="company-name">
            {companyInfo.companyName || "سیستم مدیریت مالی صرافی"}
          </span>
        </Link>

        {/* MOBILE BUTTON */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV CONTENT */}

        <div className="collapse navbar-collapse" id="mainNavbar">
          {/* CENTER MENU - REMAINING ITEMS */}

          <ul className="navbar-nav mx-auto align-items-xl-center">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/owner-exchange-transactions">
                خرید و فروش دفتر
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/report">
                گزارش
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/wallet">
                خزانه
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/remittances">
                حواله جات
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/customers-list">
                مشتریان
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/exchange-list">
                خرید و فروش
              </Link>
            </li>
          </ul>

          {/* BUTTONS LEFT */}

          <div className="d-flex gap-2 auth-buttons">
            <div className="internet-status">
              <span className="status-text">
                {isOnline ? "آنلاین" : "آفلاین"}
              </span>

              <span
                className={`status-dot ${isOnline ? "online" : "offline"}`}
              ></span>
            </div>

            {!isLoggedIn && (
              <Link
                className="btn btn-outline-light rounded-pill px-4 fw-semibold"
                to="/login"
              >
                داخل شدن به حساب
              </Link>
            )}

            <Link
              className="btn btn-warning rounded-pill px-4 fw-semibold"
              to="/sign-up"
            >
              ایجاد حساب
            </Link>

            {isLoggedIn && (
              <Link
                className="btn btn-danger rounded-pill px-4 fw-semibold"
                to="/logout"
              >
                خارج شدن از حساب
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderComponent;

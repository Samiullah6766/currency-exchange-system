import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allUsers } from "../../services/UserService";
import { getCompanyInfo } from "../../services/CompanyInfoService";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  createBackup,
  getBackups,
  restoreBackup,
} from "../../services/BackupService";

function Configurations() {
  const [users, setUsers] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [error, setError] = useState("");

  const [backupMessage, setBackupMessage] = useState("");
  const [backupType, setBackupType] = useState("");

  const [backups, setBackups] = useState([]);
  const [selectedBackup, setSelectedBackup] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    allUsers()
      .then((response) => {
        setUsers(response.data.sort((a, b) => b.id - a.id));
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load users.");
      });

    getCompanyInfo()
      .then((response) => {
        setCompanyInfo(response.data);
      })
      .catch((err) => {
        console.error(err);
      });

    loadBackups();
  }, []);

  const loadBackups = () => {
    getBackups()
      .then((response) => {
        setBackups(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleBackup = () => {
    createBackup()
      .then((response) => {
        setBackupMessage(response.data);
        setBackupType("success");

        loadBackups();

        setTimeout(() => {
          setBackupMessage("");
        }, 3000);
      })
      .catch((error) => {
        setBackupMessage(error.response?.data || "Backup failed.");
        setBackupType("error");

        setTimeout(() => {
          setBackupMessage("");
        }, 3000);
      });
  };

  const handleRestore = () => {
    if (!selectedBackup) {
      alert("لطفاً یک فایل پشتیبان را انتخاب کنید.");
      return;
    }

    if (
      !window.confirm(
        "آیا مطمئن هستید؟\nتمام اطلاعات فعلی با نسخه پشتیبان جایگزین خواهد شد.",
      )
    ) {
      return;
    }

    restoreBackup(selectedBackup)
      .then((response) => {
        setBackupMessage(response.data);
        setBackupType("success");
      })
      .catch((error) => {
        setBackupMessage(error.response?.data || "Restore failed.");
        setBackupType("error");
      });
  };

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor: "#f8f9fa",
        paddingTop: "30px",
        paddingBottom: "30px",
      }}
    >
      <div className="container">
        {backupMessage && (
          <div
            className="position-fixed top-50 start-50 translate-middle"
            style={{
              zIndex: 9999,
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <div
              className="shadow-lg rounded-4 p-4 text-center text-white"
              style={{
                backgroundColor:
                  backupType === "success" ? "#198754" : "#dc3545",
                border: "3px solid white",
              }}
            >
              <div className="fs-1 mb-3">
                {backupType === "success" ? "✅" : "❌"}
              </div>

              <h5 className="fw-bold">{backupMessage}</h5>
            </div>
          </div>
        )}

        {/* TOP DASHBOARD */}

        <div className="row g-3 align-items-stretch mb-4"
        style={{minHeight: "65px"}}>
          {/* Users */}

          <div className="col-lg-2">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <h6 className="text-muted">مجموعه کاربران</h6>

                <h2 className="fw-bold text-primary">{users.length}</h2>
              </div>
            </div>
          </div>

          {/* Restore */}

          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex flex-column justify-content-center">
                <label className="fw-bold mb-2">بازیابی نسخه پشتیبان</label>

                <div className="input-group">
                  <select
                    className="form-select"
                    value={selectedBackup}
                    onChange={(e) => setSelectedBackup(e.target.value)}
                  >
                    <option value="">انتخاب نسخه پشتیبان</option>

                    {backups.map((backup) => (
                      <option key={backup} value={backup}>
                        {backup}
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn btn-warning"
                    disabled={!selectedBackup}
                    onClick={handleRestore}
                    style={{ minHeight: "65px" }}
                  >
                    بازیابی
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Backup */}

          <div className="col-lg-2">
            <button
              className="btn btn-success w-100  shadow-sm d-flex align-items-center justify-content-center gap-2"
              style={{ minHeight: "65px" }}
              onClick={handleBackup}
              
            >
              <i className="bi bi-download"></i>
              ایجاد نسخه پشتیبان
            </button>
          </div>

          {/* Company Button */}

          <div className="col-lg-3">
            <button
              className="btn btn-primary w-100  shadow-sm d-flex align-items-center justify-content-center gap-2"
              style={{ minHeight: "65px" }}
              onClick={() => navigate("/create-companyInfo")}
            >
              <i className="bi bi-plus-circle"></i>
              وارد کردن اطلاعات صرافی
            </button>
          </div>
        </div>

        {/* COMPANY INFORMATION */}

        {companyInfo && (
          <div
            className="card border-0 shadow-sm mb-4"
            style={{
              borderRadius: "16px",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">اطلاعات صرافی</h4>

                <button
                  className="btn btn-outline-primary rounded-circle"
                  title="ویرایش اطلاعات"
                  onClick={() => navigate("/update-companyInfo")}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>

              <div className="row align-items-center">
                {/* LOGO */}

                <div className="col-md-3 text-center mb-3 mb-md-0">
                  {companyInfo.logoPath ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${companyInfo.logoPath.replace("\\", "/")}`}
                      alt="Company Logo"
                      className="rounded-circle shadow"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto"
                      style={{
                        width: "120px",
                        height: "120px",
                        fontSize: "40px",
                      }}
                    >
                      <i className="bi bi-building"></i>
                    </div>
                  )}
                </div>

                {/* COMPANY DATA */}

                <div className="col-md-9">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="border rounded-3 p-3 bg-light">
                        <small className="text-muted">نام صرافی</small>

                        <div className="fw-bold">{companyInfo.companyName}</div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="border rounded-3 p-3 bg-light">
                        <small className="text-muted">مالک</small>

                        <div className="fw-bold">{companyInfo.ownerName}</div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="border rounded-3 p-3 bg-light">
                        <small className="text-muted">شماره تماس</small>

                        <div className="fw-bold">{companyInfo.phone}</div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="border rounded-3 p-3 bg-light">
                        <small className="text-muted">ایمیل</small>

                        <div className="fw-bold">{companyInfo.email}</div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="border rounded-3 p-3 bg-light">
                        <small className="text-muted">آدرس</small>

                        <div className="fw-bold">{companyInfo.address}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS LIST */}

        <div
          className="card border-0 shadow-lg"
          style={{
            borderRadius: "16px",
          }}
        >
          <div className="card-body p-4">
            <h2 className="fw-bold mb-4">کاربران سیستم</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-4 p-3 mb-3 bg-white shadow-sm"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="fw-semibold mb-1">{user.username}</h5>

                      <span className="badge bg-light text-dark">
                        ID: {user.id}
                      </span>
                    </div>

                    <span
                      className={`badge ${
                        user.role === "ADMIN" ? "bg-danger" : "bg-success"
                      }`}
                    >
                      {user.role === "USER" ? "کاربر" : "ادمین"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-5">
                <i className="bi bi-people fs-1"></i>

                <div className="mt-3">یوزر پیدا نشد</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configurations;

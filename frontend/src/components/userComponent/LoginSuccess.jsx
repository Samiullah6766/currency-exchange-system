import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="card shadow border-0 text-center p-5">
        <div
          className="rounded-circle bg-success d-inline-flex justify-content-center align-items-center mx-auto mb-4"
          style={{ width: "100px", height: "100px" }}
        >
          <span className="text-white fw-bold" style={{ fontSize: "3rem" }}>
            ✓
          </span>
        </div>

        <h2 className="text-success fw-bold mb-3">ورود موفقیت‌آمیز بود</h2>

        <p className="text-muted mb-0">
          شما با موفقیت وارد حساب کاربری خود شدید.
        </p>

        <p className="text-muted mt-3">در حال انتقال به داشبورد...</p>
      </div>
    </div>
  );
};

export default LoginSuccess;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // 🔥 context update
    navigate("/login");
  };

  const cancelLogout = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="card shadow-lg p-5 text-center">
          <h3>آیا مطمئن هستید که می‌خواهید خارج شوید؟</h3>

          <div className="mt-4 d-flex gap-3 justify-content-center">
            <button className="btn btn-secondary" onClick={cancelLogout}>
              لغو
            </button>

            <button className="btn btn-danger" onClick={handleLogout}>
              خروج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;

import {React, useState} from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaCog,
  FaBook,
  FaSyncAlt,
  FaUser,
  FaHandHoldingUsd,
  FaExchangeAlt,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { sendDataToServer } from "../../services/SyncService";

import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
const handleSync = async () => {
  try {
    const response = await sendDataToServer();

    setMessage(response.data); // "Synchronization completed."
    setMessageType("success");

  } catch (err) {

    if (err.response) {
      // Backend returned 503 or another HTTP error
      setMessage(err.response.data);
    } else {
      // Network error or central server unreachable
      setMessage("سرور مرکزی در دسترس نیست");
    }

    setMessageType("error");
  }

  setTimeout(() => {
    setMessage("");
  }, 3000);
};
  return (
    <>
      {message && (
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
                messageType === "success" ? "#198754" : "#dc3545",
              border: "3px solid white",
            }}
          >
            <div className="fs-1 mb-3">
              {messageType === "success" ? "✅" : "❌"}
            </div>

            <h5 className="fw-bold">{message}</h5>
          </div>
        </div>
      )}
      <aside
        dir="rtl"
        className="text-white p-3"
        style={{
          width: "182px",
          minHeight: "100vh",
          backgroundColor: "#243445",
        }}
      >
        <div className="d-flex flex-column gap-3">
          <Link
            to="/dashboard"
            className="btn text-white d-flex align-items-center gap-3"
          >
            <FaHome />
            دشبورد
          </Link>

          <Link
            to="/configurations"
            className="btn text-white d-flex align-items-center gap-3"
          >
            <FaCog />
            تنظیمات
          </Link>

          <Link
            to="/transactions-list"
            className="btn text-white d-flex align-items-center gap-2"
          >
            <FaBook />
            روزنامچه
          </Link>

          <Link
            to="/create-transaction"
            className="btn text-white d-flex align-items-center gap-2"
          >
            <FaHandHoldingUsd size={15} />+ بورد و رسید
          </Link>
          <Link
            to="/create-exchangeTransaction"
            className="btn text-white d-flex align-items-center gap-1"
          >
            <FaExchangeAlt size={13} style={{ marginLeft: "-3px" }} />+ خرید و
            فروش
          </Link>

          <button
            className="btn text-white d-flex align-items-center gap-3"
            onClick={() => window.location.reload()}
          >
            <FaSyncAlt />
            تازه سازی
          </button>
          <button
            className="btn text-white d-flex align-items-center gap-3"
            onClick={handleSync}
          >
            <FaCloudUploadAlt />
            ارسال اطلاعات به سرور
          </button>
        </div>

        <hr className="mt-4" />

        {currentUser && (
          <div
            className="rounded p-3"
            style={{
              backgroundColor: "#34495e",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <FaUser />

              <span>کاربر</span>
            </div>

            <div className="fw-bold mt-2">{currentUser.username}</div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;

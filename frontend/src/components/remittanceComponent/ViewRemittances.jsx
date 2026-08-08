import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRemittances } from "../../services/RemittanceService";
import { getCompanyInfo } from "../../services/CompanyInfoService";
import { currencyLabel } from "../../services/dateUtils";
import "bootstrap-icons/font/bootstrap-icons.css";
const ViewRemittances = () => {
  const [remittances, setRemittances] = useState([]);
  const [companyInfo, setComanyInfo] = useState({});
  const navigate = useNavigate()
  // 🏢 
  const sendToWhatsApp = (remittance) => {
    const phone = remittance.senderPhone?.replace(/\D/g, "");

    const currency = currencyLabel(remittance.moneyType);

    const total = Number(remittance.amount) + Number(remittance.transferFee);

    const message = `

🏢 ${companyInfo?.companyName}

🆔 *شماره حواله:* ${remittance.remittanceCode}

👤 *فرستنده:* ${remittance.sender}
🤝 *گیرنده:* ${remittance.receiver}

💰 *مقدار:* ${remittance.amount}${currencyLabel(remittance.moneyType).replace(remittance.amount, "")}
💸 *کمیشن:* ${remittance.transferFee}
🧮 *مجموعه:* ${total}${currencyLabel(remittance.moneyType).replace(remittance.amount, "")}

📍 *آدرس:* ${remittance.address}
🎯 *مقصد:* ${remittance.destination}

📝 *توضیحات:* ${remittance.description || "ندارد"}
`;

    const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    getRemittances().then((response) => {
      setRemittances(
        response.data.sort((a, b) => b.remittanceId - a.remittanceId),
      );
    }).catch((error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.log("Error:", error);
      }
    });

    getCompanyInfo().then((response) => {
      setComanyInfo(response.data);
    });
  }, []);

  return (
    <div className="container-fluid min-vh-100 bg-light py-4">
      <div className="container">
        {/* TOP BAR */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-0">حواله جات</h4>
          </div>

          <button
            className="btn btn-success px-4 fw-bold"
            onClick={() => navigate("/create-remittance")}
          >
            + اضافه کردن حواله
          </button>
        </div>

        {/* LIST */}
        {remittances.map((remittance) => (
          <div
            key={remittance.remittanceId}
            className="card shadow-sm border-0 mb-4"
          >
            {/* HEADER (UPDATED - CLEAN FINANCE STYLE) */}
            <div className="card-header bg-white border-bottom py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold text-dark">
                    #{remittance.remittanceCode}
                  </div>
                  <small className="text-muted">{remittance.date}</small>
                </div>
                <span
                  className="badge border px-3 py-2 d-inline-flex align-items-center"
                  style={{
                    backgroundColor: "#eef8f1",
                    color: "#198754",
                    gap: "10px",
                  }}
                >
                  <span
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    style={{
                      width: "22px",
                      height: "22px",
                      background: "#198754",
                      color: "white",
                    }}
                  >
                    <i className="bi bi-cash-coin"></i>
                  </span>

                  <span className="fw-semibold">
                    {currencyLabel(remittance.moneyType)}
                  </span>
                </span>
              </div>
            </div>

            {/* BODY */}
            <div className="card-body p-4">
              <div className="row g-4">
                {/* Sender */}
                <div className="col-md-6">
                  <h6 className="fw-bold text-dark mb-3">
                    <i className="bi bi-person-fill me-2 text-primary"></i>
                    اطلاعات فرستنده
                  </h6>

                  <div className="mb-2">
                    <small className="text-muted">
                      <i className="bi bi-person me-1"></i> نام
                    </small>
                    <div className="fw-semibold">{remittance.sender}</div>
                  </div>

                  <div>
                    <small className="text-muted">
                      <i className="bi bi-telephone me-1"></i> شماره تلیفون
                    </small>
                    <div>{remittance.senderPhone}</div>
                  </div>
                </div>

                {/* Receiver */}
                <div className="col-md-6">
                  <h6 className="fw-bold text-dark mb-3">
                    <i className="bi bi-person-check-fill me-2 text-success"></i>
                    اطلاعات گیرنده
                  </h6>

                  <div className="mb-2">
                    <small className="text-muted">
                      <i className="bi bi-person me-1"></i> نام
                    </small>
                    <div className="fw-semibold">{remittance.receiver}</div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">
                      <i className="bi bi-geo-alt me-1"></i> آدرس
                    </small>
                    <div>{remittance.address}</div>
                  </div>

                  <div>
                    <small className="text-muted">
                      <i className="bi bi-flag me-1"></i> مقصد
                    </small>
                    <div>{remittance.destination}</div>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              {/* FINANCIAL SUMMARY */}
              <div className="row text-center g-3">
                <div className="col-md-4">
                  <small className="text-muted">
                    <i className="bi bi-cash-stack me-1"></i> مقدار
                  </small>
                  <div className="fw-bold text-success fs-5">
                    {remittance.amount}
                  </div>
                </div>

                <div className="col-md-4">
                  <small className="text-muted">
                    <i className="bi bi-receipt me-1"></i> کمیشن
                  </small>
                  <div className="fw-bold text-danger fs-5">
                    {remittance.transferFee}
                  </div>
                </div>

                <div className="col-md-4">
                  <small className="text-muted">
                    <i className="bi bi-calculator me-1"></i> مجموعه
                  </small>
                  <div className="fw-bold fs-5">
                    {Number(remittance.amount) + Number(remittance.transferFee)}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button className="btn btn-sm btn-outline-primary" onClick={() => navigate("/update-remittance/"+remittance.remittanceId)}>
                  <i className="bi bi-pencil me-1"></i> ویرایش
                </button>

                <button
                  className="btn btn-sm btn-success"
                  onClick={() => sendToWhatsApp(remittance)}
                >
                  <i className="bi bi-whatsapp me-1"></i> ارسال به واتساپ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewRemittances;

import React, { useEffect, useState } from "react";
import { customerExchanges } from "../../services/ExchangeTransactionService";
import { toShamsi } from "../../services/dateUtils";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useParams, useNavigate } from "react-router-dom";

import "../../assets/fonts/Vazirmatn-Regular-normal.js";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CustomerExchangeList = () => {
  const [exchanges, setExchanges] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    customerExchanges(id)
      .then((response) => {
        setExchanges(response.data.sort((a, b) => b.id - a.id));
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          console.log("Error:", error);
        }
      });
  }, [id]);

  const customerName = exchanges?.[0]?.customerName || "Customer";

  const currencyLabel = (type) => {
    switch ((type || "").toUpperCase()) {
      case "DOLLAR":
        return "USD";

      case "AFGHANI":
        return "AFG";

      case "KALDARA":
        return "Kaldara";

      case "EURO":
        return "EUR";

      case "TOMAN":
        return "Toman";

      default:
        return type || "";
    }
  };

  const moneyBox = (currency, amount) => (
    <div
      className="d-inline-flex border rounded overflow-hidden"
      style={{
        width: "fit-content",
        direction: "ltr",
      }}
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

  // =========================
  // WHATSAPP FIX
  // =========================

  const rtl = (text) => `\u200F${text}`;

  const buildWhatsAppMessage = () => {
    const R = (text) => `\u200F${text}`;

    return `

💱 ${R("صورت حساب تبادله مشتری")}

👤 ${R("مشتری")}: ${R(customerName)}
📅 ${R("تاریخ")}: ${new Date().toLocaleDateString()}
📊 ${R("تعداد معاملات")}: ${exchanges.length}
${exchanges
  .map(
    (t) => `
━━━━━━━━━━━━━━
#${t.id}
📝 ${R("یاداشت")}: ${R(t.note || "-")}
📤 ${R("از")}:  ${currencyLabel(t.fromCurrency)} ${Number(t.fromAmount || 0).toLocaleString()}
📥 ${R("به")}:  ${currencyLabel(t.toCurrency)} ${Number(t.toAmount || 0).toLocaleString()}
💹 ${R("نرخ")}:  ${t.buyingExchangeRate}
📅 ${R("تاریخ")}:  ${toShamsi(t.transactionDate)}
`,
  )
  .join("\n")}
📄 ${R("تمام تاریخچه معاملات در فایل PDF موجود است")}

`;
  };

  const handleWhatsAppShare = () => {
    const phoneNumber = exchanges?.[0]?.customerPhoneNumber;

    if (!phoneNumber) {
      alert("Customer phone number not found.");

      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, "");

    const message = buildWhatsAppMessage();

    const url = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyStatement = async () => {
    try {
      await navigator.clipboard.writeText(buildWhatsAppMessage());

      alert("Copied successfully");
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // PDF FIX
  // =========================

  const processPersianText = (text) => {
    return String(text || "");
  };

  const generateStatementPdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",

      unit: "mm",

      format: "a4",
    });

    // Persian font fix

    doc.setFont("Vazirmatn-Regular", "normal");

    doc.setLanguage("fa");

    doc.setR2L(false);

    doc.setFontSize(18);

    doc.text(
      processPersianText("صورت حساب تبادله مشتری"),

      195,

      20,

      {
        align: "right",
      },
    );

    doc.setFontSize(12);

    doc.text(
      processPersianText(`اسم مشتری: ${customerName}`),

      195,

      30,

      {
        align: "right",
      },
    );

    autoTable(doc, {
      startY: 40,

      theme: "grid",

      styles: {
        font: "Vazirmatn-Regular",

        fontStyle: "normal",

        halign: "right",

        valign: "middle",
      },

      headStyles: {
        font: "Vazirmatn-Regular",

        halign: "right",
      },

      head: [["تاریخ", "نرخ", "به", "از", "یاداشت", "ID"]],

      body: exchanges.map((t) => [
        processPersianText(toShamsi(t.transactionDate)),

        t.buyingExchangeRate,

        processPersianText(
          `${currencyLabel(t.toCurrency)}
          ${Number(t.toAmount || 0).toLocaleString()}`,
        ),

        processPersianText(
          `${currencyLabel(t.fromCurrency)}
          ${Number(t.fromAmount || 0).toLocaleString()}`,
        ),

        processPersianText(t.note || "-"),

        t.id,
      ]),
    });

    doc.save(`${customerName}_exchange_statement.pdf`);
  };
  return (
    <div className="container py-4">
      {/* HEADER */}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            {/* RIGHT SIDE */}

            <div className="d-flex align-items-center">
              <button
                className="btn btn-light border rounded-circle ms-3"
                onClick={goBack}
                title="بازگشت"
              >
                <i className="bi bi-arrow-right"></i>
              </button>

              <div>
                <h3 className="fw-bold mb-1">
                  معاملات خرید و فروش : {customerName}
                </h3>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-success" onClick={handleWhatsAppShare}>
                📱 واتساپ
              </button>

              <button className="btn btn-danger" onClick={generateStatementPdf}>
                📄 دانلود PDF
              </button>

              <button
                className="btn btn-outline-primary"
                onClick={copyStatement}
              >
                📋 خلاصه
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>

                <th>یاداشت</th>

                <th>از</th>

                <th>به</th>

                <th>نرخ</th>

                <th>سود</th>

                <th>تاریخ</th>
              </tr>
            </thead>

            <tbody>
              {exchanges.length > 0 ? (
                exchanges.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className="fw-bold text-primary">#{t.id}</span>
                    </td>

                    <td>
                      <div
                        className="d-inline-flex border rounded overflow-hidden"
                        style={{
                          width: "fit-content",

                          maxWidth: "280px",
                        }}
                        title={t.note}
                      >
                        <span
                          className="px-2 py-1 bg-warning-subtle border-end fw-semibold"
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          📝
                        </span>

                        <span
                          className="px-3 py-1 text-truncate"
                          style={{
                            maxWidth: "220px",
                          }}
                        >
                          {t.note || "-"}
                        </span>
                      </div>
                    </td>

                    <td>{moneyBox(t.fromCurrency, t.fromAmount)}</td>

                    <td>{moneyBox(t.toCurrency, t.toAmount)}</td>

                    <td>
                      <span className="fw-semibold">
                        {t.buyingExchangeRate}
                      </span>
                    </td>

                    <td>{moneyBox(t.toCurrency, t.interest)}</td>

                    <td>{toShamsi(t.transactionDate)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No exchange transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerExchangeList;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllCustomerTransactions,
  getCustomerSummery,
} from "../../services/TransactionService";

import "../../assets/fonts/Vazirmatn-Regular-normal.js";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toShamsi } from "../../services/dateUtils";

const CustomerTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionSummery, setTransactionSummery] = useState({});

  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 3; // or 11

  const { id } = useParams();
  const navigate = useNavigate();

  const currencyLabel = (type) => {
    switch ((type || "").toUpperCase()) {
      case "DOLLAR":
        return "USD";
      case "AFGHANI":
        return "AFG";
      case "KALDARA":
        return "Kaldara";
      case "TOMAN":
        return "Toman";
      case "EURO":
        return "EUR";
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

  useEffect(() => {
    getAllCustomerTransactions(id)
      .then((response) => {
        setTransactions(
          response.data.sort((a, b) => b.transactionId - a.transactionId),
        );
      })
      .catch((error) => console.log(error));

    getCustomerSummery(id)
      .then((response) => setTransactionSummery(response.data))
      .catch((error) => console.log(error));
  }, [id]);

  const isBorrowed = (type) =>
    type?.toLowerCase().includes("borrow") ||
    type?.toLowerCase().includes("loan");

  // =========================
  // Persian PDF Text Fix
  // =========================

  const processPersianText = (text) => {
    return String(text || "");
  };
  // =========================
  // WHATSAPP MESSAGE
  // =========================

  const rtl = (text) => `\u200F${text}`;

  const buildWhatsAppMessage = () => {
    const R = (text) => `\u200F${text}`;

    const customerName = transactions?.[0]?.customerName || "Customer";

    return `
📊 ${R("صورتحساب مشتری")}

👤 ${R("مشتری")}: ${R(customerName)}
📅 ${R("تاریخ")}: ${new Date().toLocaleDateString()}


💵 ${R("دالر")}

📥 ${R("برده گی")}: ${Number(
      transactionSummery.totalDollarBorrowedAmount || 0,
    ).toLocaleString()}

📤 ${R("رسیده گی")}: ${Number(
      transactionSummery.totalDollarReturnedAmount || 0,
    ).toLocaleString()}

⚖️ ${R("بیلانس")}: ${Number(
      transactionSummery.dollarBalance || 0,
    ).toLocaleString()}



💶 ${R("یورو")}

📥 ${R("برده گی")}: ${Number(
      transactionSummery.totalEuroBorrowedAmount || 0,
    ).toLocaleString()}

📤 ${R("رسیده گی")}: ${Number(
      transactionSummery.totalEuroReturnedAmount || 0,
    ).toLocaleString()}

⚖️ ${R("بیلانس")}: ${Number(
      transactionSummery.euroBalance || 0,
    ).toLocaleString()}



🇦🇫 ${R("افغانی")}

📥 ${R("برده گی")}: ${Number(
      transactionSummery.totalAfghaniBorrowedAmount || 0,
    ).toLocaleString()}

📤 ${R("رسیده گی")}: ${Number(
      transactionSummery.totalAfghaniReturnedAmount || 0,
    ).toLocaleString()}

⚖️ ${R("بیلانس")}: ${Number(
      transactionSummery.afghaniBalance || 0,
    ).toLocaleString()}



🇮🇷 ${R("تومان")}

📥 ${R("برده گی")}: ${Number(
      transactionSummery.totalTomanBorrowedAmount || 0,
    ).toLocaleString()}

📤 ${R("رسیده گی")}: ${Number(
      transactionSummery.totalTomanReturnedAmount || 0,
    ).toLocaleString()}

⚖️ ${R("بیلانس")}: ${Number(
      transactionSummery.tomanBalance || 0,
    ).toLocaleString()}



🇵🇰 ${R("کالدار")}

📥 ${R("برده گی")}: ${Number(
      transactionSummery.totalKaldaraBorrowedAmount || 0,
    ).toLocaleString()}

📤 ${R("رسیده گی")}: ${Number(
      transactionSummery.totalKaldaraReturnedAmount || 0,
    ).toLocaleString()}

⚖️ ${R("بیلانس")}: ${Number(
      transactionSummery.kaldaraBalance || 0,
    ).toLocaleString()}



📄 ${R("همه تاریخچه حسابات شما در فایل PDF است")}
`;
  };

  const handleWhatsAppShare = () => {
    const message = buildWhatsAppMessage();

    const phoneNumber = transactions?.[0]?.customerPhone;

    if (!phoneNumber) {
      alert("Customer phone number not found.");

      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, "");

    const url = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(
      message,
    )}`;

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
  // PDF GENERATOR
  // =========================

  const generateStatementPdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFont("Vazirmatn-Regular", "normal");

    doc.setR2L(false);

    doc.setLanguage("fa");

    const customerName = transactions?.[0]?.customerName || "Customer";

    doc.setFontSize(18);

    doc.text(processPersianText("صورت حساب مشتری"), 195, 20, {
      align: "right",
    });

    doc.setFontSize(12);

    doc.text(processPersianText(`اسم مشتری: ${customerName}`), 195, 30, {
      align: "right",
    });

    autoTable(doc, {
      startY: 40,

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

      theme: "grid",

      head: [
        [
          processPersianText("بیلانس"),
          processPersianText("رسیده گی"),
          processPersianText("برده گی"),
          processPersianText("نوع پول"),
        ],
      ],

      body: [
        [
          transactionSummery.dollarBalance || 0,
          transactionSummery.totalDollarReturnedAmount || 0,
          transactionSummery.totalDollarBorrowedAmount || 0,
          processPersianText("دالر"),
        ],

        [
          transactionSummery.afghaniBalance || 0,
          transactionSummery.totalAfghaniReturnedAmount || 0,
          transactionSummery.totalAfghaniBorrowedAmount || 0,
          processPersianText("افغانی"),
        ],

        [
          transactionSummery.tomanBalance || 0,
          transactionSummery.totalTomanReturnedAmount || 0,
          transactionSummery.totalTomanBorrowedAmount || 0,
          processPersianText("تومان"),
        ],

        [
          transactionSummery.euroBalance || 0,
          transactionSummery.totalEuroReturnedAmount || 0,
          transactionSummery.totalEuroBorrowedAmount || 0,
          processPersianText("یورو"),
        ],

        [
          transactionSummery.kaldaraBalance || 0,
          transactionSummery.totalKaldaraReturnedAmount || 0,
          transactionSummery.totalKaldaraBorrowedAmount || 0,
          processPersianText("کالدار"),
        ],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,

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

      theme: "grid",

      head: [
        [
          processPersianText("تاریخ"),
          processPersianText("مقدار"),
          processPersianText("نوع پول"),
          processPersianText("نوع معامله"),
          processPersianText("یاداشت"),
          "ID",
        ],
      ],

      body: transactions.map((t) => [
        processPersianText(toShamsi(t.transactionDate)),

        Number(t.amount).toLocaleString(),

        processPersianText(currencyLabel(t.moneyType)),

        processPersianText(
          t.transactionType === "BORROWED" ? "برده گی" : "رسیده گی",
        ),

        processPersianText(t.note || "-"),

        t.transactionId,
      ]),
    });

    doc.save(`${customerName}_statement.pdf`);
  };

  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, INITIAL_COUNT);

  return (
    <div className="container mt-4">
      {/* HEADER */}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-0">
                {transactions.at(0)?.customerName}
              </h2>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-success" onClick={handleWhatsAppShare}>
                📱 ارسال به واتساپ
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

            <button
              className="btn btn-light border rounded-circle shadow-sm"
              style={{
                width: "42px",
                height: "42px",
              }}
              onClick={() => navigate(-1)}
              title="بازگشت"
            >
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* CURRENCY BOXES */}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-4 mb-4">
        {[
          {
            title: "💵 USD",
            class: "bg-primary",
            borrow: "totalDollarBorrowedAmount",
            returned: "totalDollarReturnedAmount",
            balance: "dollarBalance",
            symbol: "$",
          },

          {
            title: "💶 یورو",
            class: "bg-success",
            borrow: "totalEuroBorrowedAmount",
            returned: "totalEuroReturnedAmount",
            balance: "euroBalance",
            symbol: "€",
          },

          {
            title: "🇮🇷 تومان",
            class: "bg-warning text-dark",
            borrow: "totalTomanBorrowedAmount",
            returned: "totalTomanReturnedAmount",
            balance: "tomanBalance",
            symbol: "",
          },

          {
            title: "🇦🇫 افغانی",
            class: "bg-info text-white",
            borrow: "totalAfghaniBorrowedAmount",
            returned: "totalAfghaniReturnedAmount",
            balance: "afghaniBalance",
            symbol: "",
          },

          {
            title: "🇵🇰 کالدار",
            class: "bg-secondary text-white",
            borrow: "totalKaldaraBorrowedAmount",
            returned: "totalKaldaraReturnedAmount",
            balance: "kaldaraBalance",
            symbol: "",
          },
        ].map((item, index) => (
          <div className="col" key={index}>
            <div className="card shadow border-0 h-100">
              <div className={`card-header text-center ${item.class}`}>
                {item.title}
              </div>

              <div className="card-body">
                <div>
                  📥 برده گی:
                  {item.symbol}
                  {Number(
                    transactionSummery[item.borrow] || 0,
                  ).toLocaleString()}
                </div>

                <div>
                  📤 رسیده گی:
                  {item.symbol}
                  {Number(
                    transactionSummery[item.returned] || 0,
                  ).toLocaleString()}
                </div>

                <div>
                  ⚖️ بلانس:
                  {item.symbol}
                  {Number(
                    transactionSummery[item.balance] || 0,
                  ).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE */}

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white fw-bold">معاملات</div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>

                <th>یاداشت</th>

                <th>مقدار</th>

                <th>نوع</th>

                <th>تاریخ</th>
              </tr>
            </thead>

            <tbody>
              {displayedTransactions.map((t) => (
                <tr key={t.transactionId}>
                  <td>#{t.transactionId}</td>

                  <td>{t.note}</td>

                  <td>{moneyBox(t.moneyType, t.amount)}</td>

                  <td>
                    <span
                      className={`badge ${
                        isBorrowed(t.transactionType)
                          ? "bg-danger"
                          : "bg-success"
                      }`}
                    >
                      {t.transactionType === "BORROWED"
                        ? "برده گی"
                        : "رسیده گی"}
                    </span>
                  </td>

                  <td>{toShamsi(t.transactionDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length > INITIAL_COUNT && (
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
                    نمایش همه ({transactions.length - INITIAL_COUNT} بیشتر)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerTransactions;

import React, { useState } from "react";
import {
  createRemittance,
  getRemittance,
  updateRemittance,
} from "../../services/RemittanceService";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const CreateRemittance = () => {
  const [remittanceCode, setRemittanceCode] = useState("");
  const [sender, setSender] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [receiver, setReceiver] = useState("");
  const [moneyType, setMoneyType] = useState("");
  const [amount, setAmount] = useState("");
  const [transferFee, setTransferFee] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [remittance, setRemittance] = useState({});

  const navigator = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      getRemittance(id)
        .then((response) => {
          const data = response.data;

          setRemittanceCode(data.remittanceCode?.toString() || "");
          setSender(data.sender || "");
          setSenderPhone(data.senderPhone?.toString() || "");
          setReceiver(data.receiver || "");
          setMoneyType(data.moneyType || "");
          setAmount(data.amount?.toString() || "");
          setTransferFee(data.transferFee?.toString() || "");
          setAddress(data.address || "");
          setDescription(data.description || "");
          setDestination(data.destination || "");
          setDate(data.date || "");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  const formatNumber = (value) => {
    const clean = value.replace(/,/g, "");

    // allow only digits and one decimal point
    if (!/^\d*\.?\d*$/.test(clean)) {
      return value;
    }

    const [integer, decimal] = clean.split(".");

    const formattedInteger = integer ? Number(integer).toLocaleString() : "";

    return decimal !== undefined
      ? `${formattedInteger}.${decimal}`
      : formattedInteger;
  };
  const removeCommas = (value) => {
    return String(value).replace(/,/g, "");
  };

  const handleCreation = (e) => {
    e.preventDefault();

    const remittanceData = {
      remittanceCode: removeCommas(remittanceCode),
      sender,
      senderPhone,
      receiver,
      moneyType,
      amount: removeCommas(amount),
      transferFee: removeCommas(transferFee),
      address,
      description,
      destination,
      date,
    };
    if (id) {
      updateRemittance(id, remittanceData)
        .then((response) => {
          navigator("/remittances");
        })
        .catch((error) => {
          console.log("Something went wrong!");
        });
    } else {
      createRemittance(remittanceData)
        .then((response) => {
          console.log(response.data);
          navigator(-1);
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
          } else {
            console.log("Error:", error);
          }
        });
    }
  };

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor: "#f8f9fa",
        paddingTop: "30px",
        paddingBottom: "20px",
      }}
    >
      <div className="container">
        <div
          className="card shadow mx-auto"
          style={{
            maxWidth: "1200px",
            width: "100%",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div className="card-header bg-white py-4">
            <h3 className="mb-1 fw-bold text-dark">ایجاد کردن حواله</h3>

            <small className="text-muted">
              اطلاعات حواله را برای ثبت وارد کنید
            </small>
          </div>

          {/* Form */}
          <div className="card-body p-5">
            <form onSubmit={handleCreation}>
              <div className="row g-3">
                {/* Remittance Code */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">
                    شماره حواله
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={remittanceCode}
                    onChange={(e) =>
                      setRemittanceCode(formatNumber(e.target.value))
                    }
                    required
                  />
                </div>

                {/* Sender */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">فرستنده</label>

                  <input
                    type="text"
                    className="form-control"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    required
                  />
                </div>

                {/* Sender Phone */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">
                    شماره فرستنده
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    required
                  />
                </div>

                {/* Receiver */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">گیرنده</label>

                  <input
                    type="text"
                    className="form-control"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    required
                  />
                </div>

                {/* Amount */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">مقدار</label>

                  <input
                    type="text"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(formatNumber(e.target.value))}
                    required
                  />
                </div>

                {/* Currency */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">نوع پول</label>

                  <select
                    className="form-select"
                    value={moneyType}
                    onChange={(e) => setMoneyType(e.target.value)}
                    required
                  >
                    <option value="">انتخاب واحد پولی</option>
                    <option value="DOLLAR">دالر</option>
                    <option value="AFGHANI">افغانی</option>
                    <option value="TOMAN">تومان</option>
                    <option value="KALDARA">کالدار</option>
                    <option value="EURO">یورو</option>
                  </select>
                </div>

                {/* Transfer Fee */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">کمیشن</label>

                  <input
                    type="text"
                    className="form-control"
                    value={transferFee}
                    onChange={(e) =>
                      setTransferFee(formatNumber(e.target.value))
                    }
                    required
                  />
                </div>

                {/* Address */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">آدرس</label>

                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Destination */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label text-secondary">مقصد</label>

                  <input
                    type="text"
                    className="form-control"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>

                {/* Date */}
                <div className="col-lg-6 col-md-6">
                  <label className="form-label text-secondary">تاریخ</label>

                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-lg-6 col-md-12">
                  <label className="form-label text-secondary">توضیحات</label>

                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder="توضیحات را وارد کنید ..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => navigator(-1)}
                >
                  لغو
                </button>

                <button type="submit" className="btn btn-success px-4">
                  ثبت حواله
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRemittance;

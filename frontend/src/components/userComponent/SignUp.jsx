import React, { useState } from "react";
import { registerUser } from "../../services/UserService";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("");
  const [signupFailed, setSignupFailed] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

   const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      username,
      password,
      role,
    };

    registerUser(userData)
      .then((response) => {
        setUsername("");
        setPassword("");
        setPasswordConfirm("");
        setRole("");

        setSignupFailed(false);
        setSignupSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 2000);

        console.log(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 409) {
          setSignupFailed(true);
        }
      });
  };

  return (
    <div className="container">
      {signupSuccess && (
        <div
          className="position-fixed top-50 start-50 translate-middle"
          style={{
            zIndex: 9999,
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <div className="alert alert-success shadow-lg text-center rounded-4 p-4 border-0">
            <h4 className="fw-bold mb-2">✅ موفقیت</h4>

            <p className="mb-0">حساب کاربر بصورت موفقانه ایجاد شد.</p>
          </div>
        </div>
      )}

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="col-md-6 col-lg-4">
          <form
            onSubmit={handleSubmit}
            className="card shadow p-4 border-0"
            autoComplete="off"
          >
            <h2 className="text-center mb-4">ایجاد حساب</h2>

            <div className="mb-3">
              <label className="form-label">اسم کاربر</label>

              <input
                type="text"
                className="form-control"
                placeholder="اسم کاربر خود را وارد کنید"
                value={username}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              {signupFailed && (
                <p style={{ color: "red" }}>این یوزرنیم قبلاً ثبت شده است</p>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">پسورد</label>

              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="پسورد خود را وارد کنید"
                  value={password}
                  autoComplete="new-password"
                  style={{ paddingLeft: "45px" }}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="btn btn-sm position-absolute"
                  style={{
                    left: "10px",
                    top: "5px",
                    border: "none",
                    background: "transparent",
                    zIndex: 2,
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">تائیدی پسورد</label>

              <div className="position-relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  className="form-control"
                  placeholder="تائیدی پسورد را وارد کنید"
                  value={passwordConfirm}
                  autoComplete="new-password"
                  style={{ paddingLeft: "45px" }}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="btn btn-sm position-absolute"
                  style={{
                    left: "10px",
                    top: "5px",
                    border: "none",
                    background: "transparent",
                    zIndex: 2,
                  }}
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  {showPasswordConfirm ? "🙈" : "👁️"}
                </button>
              </div>

              {passwordConfirm && password !== passwordConfirm && (
                <p className="text-danger mt-2 mb-0">پسورد یکسان نیست</p>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label">نقش</label>

              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">انتخاب نقش</option>
                <option value="ADMIN">ادمین</option>
                <option value="USER">یوزر</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success w-100">
              راجستر کردن
            </button>

            <p className="text-center mt-3 mb-0">
              قبلاً حساب دارید؟
              <a href="/login"> وارد شدن به حساب</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

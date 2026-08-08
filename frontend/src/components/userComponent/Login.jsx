import React, { useState, useEffect } from "react";
import { loginUser } from "../../services/UserService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isInitialized } from "../../services/CompanyInfoService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {

    isInitialized()
        .then((res) => {

            if (!res.data) {
                navigate("/create-companyInfo");
            }

        })
        .catch((err) => {
            console.log(err);
        });

}, []);

  const handleLogin = (e) => {
    e.preventDefault();

    loginUser({ username, password })
      .then((res) => {
        setLoginFailed(false);

        login(res.data.token, {
          username: res.data.username,
          role: res.data.role,
          userId: res.data.userId,
        });

        navigate("/login-success");
      })
      .catch(() => {
        setLoginFailed(true);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <form
            onSubmit={handleLogin}
            className="card p-4 shadow"
            autoComplete="off"
          >
            <h3 className="mb-3 text-center">ورود به حساب</h3>

            <input
              className="form-control mb-2"
              placeholder="اسم کاربری"
              value={username}
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
            />

            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control mb-3"
                placeholder="رمز"
                value={password}
                autoComplete="new-password"
                style={{ paddingLeft: "45px" }}
                onChange={(e) => setPassword(e.target.value)}
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

            {loginFailed && (
              <p style={{ color: "red" }}>
                اطلاعات ورود شما نادرست است، دوباره تلاش کنید
              </p>
            )}

            <button className="btn btn-primary w-100" type="submit">
              ورود
            </button>

            {loginFailed ? (
              <p className="text-center mt-3">
                ثبت‌نام نکرده‌اید؟ <Link to="/sign-up">ثبت‌ نام</Link>
              </p>
            ) : (
              <p className="text-center mt-3">قبلاً حساب کاربری ساخته‌اید</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

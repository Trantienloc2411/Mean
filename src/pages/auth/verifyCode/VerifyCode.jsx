import { useEffect, useState } from "react";
import { LeftOutlined, EyeInvisibleFilled, EyeFilled } from "@ant-design/icons";
import ImageCarousel from "../../../components/ImageCarousel/ImageCarousel";
import styles from "./VerifyCode.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useSendOtpEmailMutation,
  useVerifyEmailMutation,
} from "../../../redux/services/authApi";
import { saveRole, saveToken, saveUserId } from "../../../utils/storage";
import { useDispatch } from "react-redux";
import {
  setCredentials,
  setRole,
  setUser,
} from "../../../redux/slices/authSlice";

const VerifyCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const loginResult = location.state?.loginResult;
  const userData = location.state?.userData;
  const roleData = location.state?.roleData;
  const dispatch = useDispatch();

  const [sendOTP, { isLoading: isLoadingSendOTP }] = useSendOtpEmailMutation();
  const [verifyEmail, { isLoading: isLoadingVerify }] =
    useVerifyEmailMutation();
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  // Đếm ngược khi gửi lại OTP
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const images = [
    "https://cdn.vietnambiz.vn/2020/2/26/kcn-1582688444973524474363.jpg",
    "https://kilala.vn/data/upload/article/3685/3.jpg",
    "https://www.chudu24.com/wp-content/uploads/2017/03/khach-san-sapa-capsule-28.jpg",
  ];

  const toggleCodeVisibility = () => {
    setShowCode(!showCode);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!code) {
      setError("Vui lòng nhập mã xác minh.");
      return;
    }

    try {
      const response = await verifyEmail({ email, otp: code }).unwrap();
      setSuccessMessage("Xác minh thành công! Đang chuyển hướng...");
      saveToken(loginResult.accessToken);
      saveUserId(loginResult._id);
      dispatch(setCredentials(loginResult));
      dispatch(setUser(userData.getUser));
      saveRole(roleData.roleName);
      dispatch(setRole(roleData.roleName));

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Mã xác minh không hợp lệ hoặc đã hết hạn.");
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return; // Nếu đang đếm ngược thì không gửi tiếp

    setError("");
    setSuccessMessage("");

    try {
      await sendOTP({ email }).unwrap();
      setSuccessMessage("Mã xác minh mới đã được gửi!");
      setCountdown(60); // Bắt đầu đếm ngược từ 60s
    } catch (err) {
      setError("Không thể gửi lại mã. Vui lòng thử lại.");
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.verifyForm}>
        <div className={styles.verifyContent}>
          <div className={styles.brand}>
            <h1>Mean</h1>
          </div>
          <div className={styles.backLink}>
            <a href="/">
              <LeftOutlined /> Đăng nhập
            </a>
          </div>
          <h2 className={styles.title}>Nhập mã xác minh</h2>
          <p className={styles.verifyDescription}>
            Mã xác thực đã được gửi tới email của bạn: <b>{email}</b>
          </p>
          <form onSubmit={handleVerifyCode}>
            <div className={styles.formGroup}>
              <label>Nhập mã</label>
              <div className={styles.codeInputWrapper}>
                <input
                  type={showCode ? "text" : "password"}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="7789BMGX"
                  className={styles.formInput}
                  disabled={isLoadingVerify}
                />
                <button
                  type="button"
                  className={styles.toggleVisibility}
                  onClick={toggleCodeVisibility}
                >
                  {showCode ? (
                    <EyeInvisibleFilled className={styles.visibilityIcon} />
                  ) : (
                    <EyeFilled className={styles.visibilityIcon} />
                  )}
                </button>
              </div>
              {error && <p className={styles.error}>{error}</p>}
              {successMessage && (
                <p className={styles.success}>{successMessage}</p>
              )}
              <div className={styles.verifyPrompt}>
                <span>Không nhận được mã? </span>
                <button
                  type="button"
                  className={styles.resendBtn}
                  onClick={handleResendOTP}
                  disabled={isLoadingSendOTP || countdown > 0}
                >
                  {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoadingVerify}
            >
              {isLoadingVerify ? "Đang xác thực..." : "Xác thực"}
            </button>
          </form>
          <div className={styles.copyright}>Copyright © Mean 2025</div>
        </div>
      </div>
      <div className={styles.verifyCarousel}>
        <ImageCarousel images={images} />
      </div>
    </div>
  );
};

export default VerifyCode;

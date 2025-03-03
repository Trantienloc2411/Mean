import { useEffect, useState } from "react";
import { LeftOutlined, EyeInvisibleFilled, EyeFilled } from "@ant-design/icons";
import ImageCarousel from "../../../components/ImageCarousel/ImageCarousel";
import styles from "../verifyCode/VerifyCode.module.scss";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../redux/services/firebase"; // Import Firebase auth instance
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"; // Thêm import bị thiếu

const images = [
  "src/assets/images/beach.jpg",
  "src/assets/images/lake.jpg",
  "src/assets/images/mountain.jpg",
];

const VerifyPhone = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatPhoneNumber = (input) => {
    return input.startsWith("0") ? "+84" + input.slice(1) : input;
  };

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved", response);
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired, please retry.");
          },
        }
      );
    }
  }, []);

  const handleSendCode = async () => {
    setError("");
    setSuccessMessage("");

    if (!phoneNumber) {
      setError("Vui lòng nhập số điện thoại.");
      return;
    }

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const appVerifier = window.recaptchaVerifier;

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      setConfirmationResult(result);
      setSuccessMessage("Mã xác minh đã được gửi!");
      setCountdown(60);
    } catch (err) {
      setError("Không thể gửi mã. Vui lòng thử lại.");
      console.error("Lỗi gửi OTP:", err);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!verificationCode || !confirmationResult) {
      setError("Vui lòng nhập mã xác minh.");
      return;
    }

    try {
      const result = await confirmationResult.confirm(verificationCode);
      const idToken = await result.user.getIdToken(); // Lấy ID Token từ Firebase

      const response = await fetch(
        "http://localhost:5000/api/user/verify-phone",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phoneNumber, idToken }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Xác minh thành công!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        throw new Error(data.error || "Xác minh thất bại.");
      }
    } catch (err) {
      setError("Mã xác minh không hợp lệ hoặc đã hết hạn.");
      console.error("Lỗi xác minh OTP:", err);
    }
  };

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.verifyForm}>
        <div className={styles.verifyContent}>
          <div className={styles.brand}>
            <div id="recaptcha-container"></div>
            <h1>Mean</h1>
          </div>
          <h2 className={styles.title}>Xác thực số điện thoại</h2>
          <form onSubmit={handleVerifyCode}>
            <div className={styles.formGroup}>
              <label>Số điện thoại</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0123123123"
                className={styles.formInput}
              />
              <button
                type="button"
                className={styles.sendCodeBtn}
                onClick={handleSendCode}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi mã"}
              </button>
            </div>
            <div className={styles.formGroup}>
              <label>Nhập mã</label>
              <div className={styles.codeInputWrapper}>
                <input
                  type={showCode ? "text" : "password"}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Nhập mã OTP"
                  className={styles.formInput}
                />
                <button
                  type="button"
                  className={styles.toggleVisibility}
                  onClick={() => setShowCode(!showCode)}
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
            </div>
            <button type="submit" className={styles.submitBtn}>
              Xác thực
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

export default VerifyPhone;

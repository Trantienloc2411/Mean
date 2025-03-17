// import { useEffect, useState } from "react";
// import { EyeInvisibleFilled, EyeFilled } from "@ant-design/icons";
// import ImageCarousel from "../../../components/ImageCarousel/ImageCarousel";
// import styles from "../verifyCode/VerifyCode.module.scss";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../../../redux/services/firebase"; // Import Firebase auth instance
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// const images = [
//   "src/assets/images/beach.jpg",
//   "src/assets/images/lake.jpg",
//   "src/assets/images/mountain.jpg",
// ];

// const VerifyPhone = () => {
//   const navigate = useNavigate();
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [showCode, setShowCode] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const [countdown, setCountdown] = useState(0);

//   useEffect(() => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         auth,
//         "recaptcha-container",
//         {
//           size: "normal", // Hoặc "invisible" nếu không muốn hiển thị
//           callback: (response) => {
//             console.log("reCAPTCHA solved", response);
//           },
//           "expired-callback": () => {
//             console.log("reCAPTCHA expired, please retry.");
//           },
//         }
//       );
//     }
//   }, []);

//   const formatPhoneNumber = (input) => {
//     return input.startsWith("0") ? "+84" + input.slice(1) : input;
//   };

//   const handleSendCode = async () => {
//     setError("");
//     setSuccessMessage("");

//     if (!phoneNumber) {
//       setError("Vui lòng nhập số điện thoại.");
//       return;
//     }

//     const formattedPhone = formatPhoneNumber(phoneNumber);
//     const phoneRegex = /^\+84\d{9,10}$/;

//     if (!phoneRegex.test(formattedPhone)) {
//       setError("Số điện thoại không hợp lệ.");
//       return;
//     }

//     try {
//       const appVerifier = window.recaptchaVerifier;
//       const result = await signInWithPhoneNumber(
//         auth,
//         formattedPhone,
//         appVerifier
//       );
//       setConfirmationResult(result);
//       setSuccessMessage("Mã xác minh đã được gửi!");
//     } catch (err) {
//       setError("Không thể gửi mã. Vui lòng thử lại.");
//       console.error("Lỗi gửi OTP:", err);
//     }
//   };

//   const handleVerifyCode = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccessMessage("");

//     if (!verificationCode || !confirmationResult) {
//       setError("Vui lòng nhập mã xác minh.");
//       return;
//     }

//     try {
//       const result = await confirmationResult.confirm(verificationCode);
//       const idToken = await result.user.getIdToken(); // Lấy ID Token từ Firebase

//       const response = await fetch(
//         "http://localhost:5000/api/user/verify-phone",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ phone: phoneNumber, idToken }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage("Xác minh thành công!");
//         setTimeout(() => navigate("/"), 2000);
//       } else {
//         throw new Error(data.error || "Xác minh thất bại.");
//       }
//     } catch (err) {
//       setError("Mã xác minh không hợp lệ hoặc đã hết hạn.");
//       console.error("Lỗi xác minh OTP:", err);
//     }
//   };

//   return (
//     <div className={styles.verifyContainer}>
//       <div className={styles.verifyForm}>
//         <div className={styles.verifyContent}>
//           <div className={styles.brand}>
//             <div id="recaptcha-container"></div>
//             <h1>Mean</h1>
//           </div>
//           <h2 className={styles.title}>Xác thực số điện thoại</h2>
//           <form onSubmit={handleVerifyCode}>
//             <div className={styles.formGroup}>
//               <label>Số điện thoại</label>
//               <input
//                 type="tel"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 placeholder="0123123123"
//                 className={styles.formInput}
//               />
//               <button
//                 type="button"
//                 className={styles.sendCodeBtn}
//                 onClick={handleSendCode}
//                 disabled={countdown > 0}
//               >
//                 {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi mã"}
//               </button>
//             </div>
//             <div className={styles.formGroup}>
//               <label>Nhập mã</label>
//               <div className={styles.codeInputWrapper}>
//                 <input
//                   type={showCode ? "text" : "password"}
//                   value={verificationCode}
//                   onChange={(e) => setVerificationCode(e.target.value)}
//                   placeholder="Nhập mã OTP"
//                   className={styles.formInput}
//                 />
//                 <button
//                   type="button"
//                   className={styles.toggleVisibility}
//                   onClick={() => setShowCode(!showCode)}
//                 >
//                   {showCode ? (
//                     <EyeInvisibleFilled className={styles.visibilityIcon} />
//                   ) : (
//                     <EyeFilled className={styles.visibilityIcon} />
//                   )}
//                 </button>
//               </div>
//               {error && <p className={styles.error}>{error}</p>}
//               {successMessage && (
//                 <p className={styles.success}>{successMessage}</p>
//               )}
//             </div>
//             <button type="submit" className={styles.submitBtn}>
//               Xác thực
//             </button>
//           </form>
//           <div className={styles.copyright}>Copyright © Mean 2025</div>
//         </div>
//       </div>
//       <div className={styles.verifyCarousel}>
//         <ImageCarousel images={images} />
//       </div>
//     </div>
//   );
// };

// export default VerifyPhone;
import { useState } from "react";
import { auth } from "../../../redux/services/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const VerifyPhone = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Chuẩn hóa số điện thoại (Việt Nam)
  const formatPhoneNumber = (input) => {
    return input.startsWith("0") ? "+84" + input.slice(1) : input;
  };

  // Gửi OTP
  const sendOtp = async () => {
    setError("");
    setSuccessMessage("");

    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!formattedPhone.match(/^\+\d{10,15}$/)) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }

    try {
      // Xóa recaptchaVerifier trước khi tạo mới
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
        }
      );

      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );

      setConfirmationResult(result);
      setSuccessMessage("Mã OTP đã được gửi!");
    } catch (error) {
      setError("Lỗi khi gửi OTP: " + error.message);
      console.error("Lỗi gửi OTP:", error);
    }
  };

  // Xác minh OTP
  const handleVerifyCode = async () => {
    setError("");
    setSuccessMessage("");

    if (!verificationCode || !confirmationResult) {
      setError("Vui lòng nhập mã xác minh.");
      return;
    }

    try {
      const result = await confirmationResult.confirm(verificationCode);
      const user = result.user;
      console.log(result);

      setSuccessMessage(`Xác minh thành công! User ID: ${user.idToken}`);
    } catch (err) {
      setError("Mã xác minh không hợp lệ hoặc đã hết hạn.");
      console.error("Lỗi xác minh OTP:", err);
    }
  };

  return (
    <div>
      <h2>Xác thực số điện thoạaaaai</h2>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Nhập số điện thoại"
      />
      <button onClick={sendOtp}>Gửi mã</button>
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="Nhập mã OTP"
      />
      <button onClick={handleVerifyCode} disabled={!confirmationResult}>
        Xác thực
      </button>
      <div id="recaptcha-container"></div> {/* reCAPTCHA ẩn */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default VerifyPhone;

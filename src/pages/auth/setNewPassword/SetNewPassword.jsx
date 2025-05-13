import { useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { LeftOutlined, EyeInvisibleFilled, EyeFilled } from "@ant-design/icons";
import { Button, notification } from "antd";
import ImageCarousel from "../../../components/ImageCarousel/ImageCarousel";
import { useResetPasswordTokenMutation } from "../../../redux/services/authApi";
import styles from "./SetNewPassword.module.scss";

  const images = [
    "https://cdn.vietnambiz.vn/2020/2/26/kcn-1582688444973524474363.jpg",
    "https://kilala.vn/data/upload/article/3685/3.jpg",
    "https://www.chudu24.com/wp-content/uploads/2017/03/khach-san-sapa-capsule-28.jpg",
  ];

const SetNewPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordTokenMutation();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        return notification.error({
          message: "Lỗi",
          description: "Mật khẩu nhập lại không khớp!",
        });
      }

      try {
        // const result = await resetPassword({ token, password }).unwrap();
        await resetPassword({ token, password }).unwrap();
        notification.success({
          message: "Thành công",
          description: "Mật khẩu đã được đặt lại. Vui lòng đăng nhập!",
        });
        navigate("/set-new-password-success");
      } catch (err) {
        notification.error({
          message: "Lỗi",
          description: err.message || "Đặt lại mật khẩu thất bại!",
        });
      }
    },
    [password, confirmPassword, token, resetPassword, navigate]
  );

  return (
    <div className={styles["setpw-container"]}>
      <div className={styles["setpw-form"]}>
        <div className={styles["setpw-content"]}>
          <h1 className={styles.brand}>Mean</h1>
          <Link to="/" className={styles["back-link"]}>
            <LeftOutlined /> Đăng nhập
          </Link>
          <h2>Đặt lại mật khẩu</h2>
          <p className={styles["setpw-description"]}>
            Vui lòng đặt mật khẩu mới cho tài khoản của bạn.
          </p>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Mật khẩu</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Nhập mật khẩu mới"
                  className={styles.formInput}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeInvisibleFilled /> : <EyeFilled />}
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Nhập lại mật khẩu</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Xác nhận mật khẩu"
                  className={styles.formInput}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeInvisibleFilled /> : <EyeFilled />}
                </button>
              </div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className={styles["submit-btn"]}
              loading={isLoading}
            >
              Đặt lại mật khẩu
            </Button>
          </form>
          <div className={styles.copyright}>Copyright © Mean 2025</div>
        </div>
      </div>
      <div className={styles["setpw-carousel"]}>
        <ImageCarousel images={images} />
      </div>
    </div>
  );
};

export default SetNewPassword;

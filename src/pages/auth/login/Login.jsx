import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeInvisibleFilled, EyeFilled } from "@ant-design/icons";
import { notification } from "antd";
import ImageCarousel from "../../../components/ImageCarousel/ImageCarousel";
import styles from "./Login.module.scss";
import { useDispatch } from "react-redux";
import {
  useLazyGetRoleByIdQuery,
  useLazyGetUserQuery,
  useLoginMutation,
} from "../../../redux/services/authApi";
import {
  setCredentials,
  setRole,
  setUser,
} from "../../../redux/slices/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [getUserById] = useLazyGetUserQuery();
  const [getRoleById] = useLazyGetRoleByIdQuery();

  const images = [
    "src/assets/images/beach.jpg",
    "src/assets/images/lake.jpg",
    "src/assets/images/mountain.jpg",
  ];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await login({ email, password });

      if (data?.accessToken) {
        dispatch(setCredentials(data));
        const { data: userData } = await getUserById(data?._id);
        const { data: roleData } = await getRoleById(userData?.getUser?.roleID);
        dispatch(setUser(userData?.getUser));
        dispatch(setRole(roleData));

        notification.success({
          message: "Đăng nhập thành công",
          description: "Chào mừng bạn đến với Mean!",
        });
        navigate("/");
      } else {
        throw new Error("Đăng nhập thất bại");
      }
    } catch (err) {
      notification.error({
        message: "Đăng nhập thất bại",
        description:
          err.message || "Vui lòng kiểm tra lại tài khoản và mật khẩu.",
      });
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <div className={styles.loginContent}>
          <div className={styles.brand}>
            <h1>Mean</h1>
          </div>
          <h2>Đăng nhập</h2>
          <p className={styles.loginDescription}>
            Đăng nhập để truy cập tài khoản Mean của bạn
          </p>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Email hoặc số điện thoại</label>
              <input
                type="email"
                placeholder="john.doe@gmail.com"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Cập nhật state email
              />
            </div>
            <div className={styles.formGroup}>
              <label>Mật khẩu</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className={styles.formInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Cập nhật state password
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeInvisibleFilled className={styles.passwordIcon} />
                  ) : (
                    <EyeFilled className={styles.passwordIcon} />
                  )}
                </button>
              </div>
              <a href="/forgot-password" className={styles.forgotPassword}>
                Quên mật khẩu
              </a>
            </div>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading} // Vô hiệu hóa khi đang loading
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
          <div className={styles.signupPrompt}>
            <span>Chưa có tài khoản? </span>
            <a href="/signup">Đăng ký</a>
          </div>
          <div className={styles.copyright}>Copyright © Mean 2025</div>
        </div>
      </div>
      <div className={styles.loginCarousel}>
        <ImageCarousel images={images} />
      </div>
    </div>
  );
};

export default Login;

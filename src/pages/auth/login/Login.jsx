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
  useSendOtpEmailMutation,
} from "../../../redux/services/authApi";
import {
  setCredentials,
  setRole,
  setUser,
} from "../../../redux/slices/authSlice";
import {
  saveToken,
  saveUserId,
  saveRole,
  saveUsername,
} from "../../../utils/storage";
import { message } from "antd";
import { checkUserExistInSupabase } from "../../../redux/services/supabase";
import { useEffect } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [login, { isLoading: isLoadingLogin }] = useLoginMutation();
  const [getUserById] = useLazyGetUserQuery();
  const [getRoleById] = useLazyGetRoleByIdQuery();
  const [sendOTP, { isLoading: isLoadingSendOTP }] = useSendOtpEmailMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [userDataLogin, setUserDataLogin] = useState(null);
  const images = [
    "https://cdn.vietnambiz.vn/2020/2/26/kcn-1582688444973524474363.jpg",
    "https://kilala.vn/data/upload/article/3685/3.jpg",
    "https://www.chudu24.com/wp-content/uploads/2017/03/khach-san-sapa-capsule-28.jpg",
  ];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formLogin = {
        email: email.toLowerCase().trim(),
        password: password,
      };
      const loginResult = await login({ data: formLogin }).unwrap();

      if (loginResult?.accessToken) {
        saveToken(loginResult.accessToken);
        saveUserId(loginResult._id);
        saveUsername(loginResult.fullName);

        const userData = await getUserById(loginResult._id).unwrap();

        if (!userData?.getUser.isActive) {
          notification.error({
            message: "Tài khoản bị khóa",
            description:
              "Vui lòng liên hệ quản trị viên để biết thêm chi tiết.",
          });
          setIsLoading(false);
          return;
        }

        if (userData?.getUser) {
          const roleData = await getRoleById(userData.getUser.roleID).unwrap();

          if (!userData?.getUser.isVerifiedEmail) {
            const response = await sendOTP({
              email: userData?.getUser.email,
            }).unwrap();

            notification.success({
              message: response.message,
              description: "Xin hãy kiểm tra email của bạn.",
            });
            setIsLoading(false);

            navigate("/verifycode", {
              state: {
                email: userData?.getUser.email,
                loginResult,
                userData,
                roleData,
              },
            });
            return;
          }

          if (roleData?.roleName) {
            saveToken(loginResult.accessToken);
            saveUserId(loginResult._id);
            dispatch(setCredentials(loginResult));
            dispatch(setUser(userData.getUser));
            saveRole(roleData.roleName);
            dispatch(setRole(roleData.roleName));
            setIsLoading(false);
            
          }
          navigate("/");
        }


        notification.success({
          message: "Đăng nhập thành công",
          description: "Chào mừng bạn đến với Mean!",
        });
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setIsLoading(false);
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
                placeholder="Email"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Mật khẩu</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={styles.formInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              disabled={isLoading}
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

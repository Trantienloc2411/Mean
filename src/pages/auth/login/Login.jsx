import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleFilled, EyeFilled } from '@ant-design/icons';
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';
import styles from './Login.module.scss'; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const images = [
    'src/assets/images/beach.jpg',
    'src/assets/images/lake.jpg',
    'src/assets/images/mountain.jpg'
  ];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/verifycode');
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
              />
            </div>
            <div className={styles.formGroup}>
              <label>Mật khẩu</label>
              <div className={styles.passwordInputWrapper}>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className={styles.formInput} 
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
            <button href="/verifycode" type="submit" className={styles.submitBtn}>
              Đăng nhập
            </button>
          </form>
          <div className={styles.signupPrompt}>
            <span>Chưa có tài khoản? </span>
            <a href="/signup">Đăng ký</a>
          </div>
          <div className={styles.copyright}>
            Copyright © Mean 2025
          </div>
        </div>
      </div>
      <div className={styles.loginCarousel}>
        <ImageCarousel images={images} />
      </div>
    </div>
  );
};

export default Login;

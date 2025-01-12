import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleFilled, EyeFilled } from '@ant-design/icons';
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';
import './Login.scss';

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
    <div className="login-container">
      <div className="login-form">
        <div className="login-content">
          <div className="brand">
            <h1>Mean</h1>
          </div>
          <h2>Đăng nhập</h2>
          <p className="login-description">
            Đăng nhập để truy cập tài khoản Mean của bạn
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email hoặc số điện thoại</label>
              <input 
                type="email" 
                placeholder="john.doe@gmail.com"
                className="form-input" 
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="password-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="form-input" 
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeInvisibleFilled className="password-icon" />
                  ) : (
                    <EyeFilled className="password-icon" />
                  )}
                </button>
              </div>
              <a href="/forgot-password" className="forgot-password">
                Quên mật khẩu
              </a>
            </div>
            <button href="/verifycode" type="submit" className="submit-btn">
              Đăng nhập
            </button>
          </form>
          <div className="signup-prompt">
            <span>Chưa có tài khoản? </span>
            <a href="/signup">Đăng ký</a>
          </div>
          <div className="copyright">
            Copyright © Mean 2025
          </div>
        </div>
      </div>
      <div className="login-carousel">
        <ImageCarousel images={images} />
      </div>
    </div>
  );
};

export default Login;
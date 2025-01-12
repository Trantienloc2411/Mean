import React, { useState, useEffect  } from 'react';
import {EyeInvisibleFilled, EyeFilled } from '@ant-design/icons';
import './Login.scss';

const Login = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  const images = [
    'src/assets/beach.jpg',
    'src/assets/lake.jpg',
    'src/assets/mountain.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === images.length - 1 ? 0 : prevSlide + 1
      );
    }, 8000);

    return () => clearInterval(timer);
  }, [images.length]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <form>
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
                    <EyeFilled  className="password-icon" />
                  )}
                </button>
              </div>
              <a href="/forgot-password" className="forgot-password">
                Quên mật khẩu
              </a>
            </div>
            <button type="submit" className="submit-btn">
              Đăng nhập
            </button>
          </form>
          <div className="signup-prompt">
            <span>Don't have an account? </span>
            <a href="/signup">Sign up</a>
          </div>
          <div className="copyright">
            Copyright © Mean 2025
          </div>
        </div>
      </div>
      <div className="login-carousel">
        <div className="carousel-container" 
             style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {images.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img src={image} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
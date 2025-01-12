import React, { useState } from 'react';
import { EyeInvisibleFilled, EyeFilled } from '@ant-design/icons';
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';
import './Signup.scss';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const images = [
        'src/assets/images/beach.jpg',
        'src/assets/images/lake.jpg',
        'src/assets/images/mountain.jpg'
    ];

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="signup-container">
            <div className="signup-carousel">
                <ImageCarousel images={images} />
            </div>
            <div className="signup-form">
                <div className="signup-content">
                    <div className="brand">
                        <h1>Mean</h1>
                    </div>
                    <h2>Đăng ký</h2>
                    <p className="signup-description">
                        Trở thành đối tác của chúng tôi
                    </p>
                    <form>
                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input
                                type="text"
                                placeholder="Zane Phạm"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="zanepham@gmail.com"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                type="number"
                                placeholder="09876521"
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
                        </div>
                        <div className="form-group">
                            <label>Nhập lại mật khẩu</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <EyeInvisibleFilled className="password-icon" />
                                    ) : (
                                        <EyeFilled className="password-icon" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="form-group terms-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    className="checkbox-input"
                                />
                                <span className="checkbox-text">
                                    Tôi đồng ý với tất cả các{' '}
                                    <a href="/terms" className="link-text">Điều khoản</a>
                                    {' '}và{' '}
                                    <a href="/privacy" className="link-text">Chính sách bảo mật</a>
                                </span>
                            </label>
                        </div>
                        <button type="submit" className="submit-btn">
                            Tạo tài khoản
                        </button>
                    </form>
                    <div className="login-prompt">
                        <span>Đã có tài khoản? </span>
                        <a href="/">Đăng nhập</a>
                    </div>
                    <div className="copyright">
                        Copyright © Mean 2025
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
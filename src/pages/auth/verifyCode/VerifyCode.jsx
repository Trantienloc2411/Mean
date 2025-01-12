import React, { useState } from 'react';
import { LeftOutlined, EyeInvisibleFilled, EyeFilled } from '@ant-design/icons';
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';
import './VerifyCode.scss';

const VerifyCode = () => {
    const [code, setCode] = useState('');
    const [showCode, setShowCode] = useState(false);
    const images = [
        'src/assets/images/beach.jpg',
        'src/assets/images/lake.jpg',
        'src/assets/images/mountain.jpg'
    ];

    const toggleCodeVisibility = () => {
        setShowCode(!showCode);
    };

    return (
        <div className="verify-container">
            <div className="verify-form">
                <div className="verify-content">
                    <div className="brand">
                        <h1>Mean</h1>
                    </div>
                    <div className="back-link">
                        <a href="/login">
                            <LeftOutlined /> Đăng nhập
                        </a>
                    </div>
                    <h2>Nhập mã xác minh</h2>
                    <p className="verify-description">
                        Mã xác thực đã được gửi tới email của bạn.
                    </p>
                    <form>
                        <div className="form-group">
                            <label>Nhập mã</label>
                            <div className="code-input-wrapper">
                                <input
                                    type={showCode ? "text" : "password"}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="7789BMGX"
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    className="toggle-visibility"
                                    onClick={toggleCodeVisibility}
                                >
                                    {showCode ? (
                                        <EyeInvisibleFilled className="visibility-icon" />
                                    ) : (
                                        <EyeFilled className="visibility-icon" />
                                    )}
                                </button>
                            </div>
                            <div className="verify-prompt">
                                <span>Không nhận được mã? </span>
                                <a href="">Gửi lại</a>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">
                            Xác thực
                        </button>
                    </form>
                    <div className="copyright">
                        Copyright © Mean 2025
                    </div>
                </div>
            </div>
            <div className="verify-carousel">
                <ImageCarousel images={images} />
            </div>
        </div>
    );
};

export default VerifyCode;
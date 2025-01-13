import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, EyeInvisibleFilled, EyeFilled } from '@ant-design/icons';
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';
import styles from './ForgotPassword.module.scss';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const images = [
        'src/assets/images/beach.jpg',
        'src/assets/images/lake.jpg',
        'src/assets/images/mountain.jpg'
    ];
    const handleSubmit = (e) => {
            e.preventDefault();
            navigate('/set-new-password');
          };
    return (
        <div className={styles['forgotpw-container']}>
            <div className={styles['forgotpw-form']}>
                <div className={styles['forgotpw-content']}>
                    <div className={styles.brand}>
                        <h1>Mean</h1>
                    </div>
                    <div className={styles['back-link']}>
                        <a href="/">
                            <LeftOutlined /> Đăng nhập
                        </a>
                    </div>
                    <h2>Quên mật khẩu</h2>
                    <p className={styles['forgotpw-description']}>
                        Đừng lo lắng, điều này xảy ra với tất cả chúng ta. Nhập email của bạn bên dưới để khôi phục mật khẩu.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className={styles['form-group']}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="zanepham@gmail.com"
                                className={styles['form-input']}
                            />
                        </div>
                        <button type="submit" className={styles['submit-btn']}>
                            Xác nhận
                        </button>
                    </form>
                    <div className={styles.copyright}>
                        Copyright © Mean 2025
                    </div>
                </div>
            </div>
            <div className={styles['forgotpw-carousel']}>
                <ImageCarousel images={images} />
            </div>
        </div>
    );
};

export default ForgotPassword;
import React, { useState } from 'react';
import { LeftOutlined, EyeInvisibleFilled, EyeFilled } from '@ant-design/icons';
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';
import styles from './SetNewPassword.module.scss';

const ForgotPassword = () => {
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
        <div className={styles['setpw-container']}>
            <div className={styles['setpw-form']}>
                <div className={styles['setpw-content']}>
                    <div className={styles.brand}>
                        <h1>Mean</h1>
                    </div>
                    <div className={styles['back-link']}>
                        <a href="/">
                            <LeftOutlined /> Đăng nhập
                        </a>
                    </div>
                    <h2>Đặt lại mật khẩu</h2>
                    <p className={styles['setpw-description']}>
                        Vui lòng đặt mật khẩu mới cho tài khoản của bạn.
                    </p>
                    <form>
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
                        </div>
                        <div className={styles.formGroup}>
                            <label>Nhập lại mật khẩu</label>
                            <div className={styles.passwordInputWrapper}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    className={styles.formInput}
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <EyeInvisibleFilled className={styles.passwordIcon} />
                                    ) : (
                                        <EyeFilled className={styles.passwordIcon} />
                                    )}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className={styles['submit-btn']}>
                            Đặt lại mật khẩu
                        </button>
                    </form>
                    <div className={styles.copyright}>
                        Copyright © Mean 2025
                    </div>
                </div>
            </div>
            <div className={styles['setpw-carousel']}>
                <ImageCarousel images={images} />
            </div>
        </div>
    );
};

export default ForgotPassword;
import React, { useState } from 'react';
import { EyeInvisibleFilled, EyeFilled } from '@ant-design/icons';
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';
import styles from './Signup.module.scss';

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
        <div className={styles.signupContainer}>
            <div className={styles.signupCarousel}>
                <ImageCarousel images={images} />
            </div>
            <div className={styles.signupForm}>
                <div className={styles.signupContent}>
                    <div className={styles.brand}>
                        <h1>Mean</h1>
                    </div>
                    <h2>Đăng ký</h2>
                    <p className={styles.signupDescription}>
                        Trở thành đối tác của chúng tôi
                    </p>
                    <form>
                        <div className={styles.formGroup}>
                            <label>Họ và tên</label>
                            <input
                                type="text"
                                placeholder="Zane Phạm"
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="zanepham@gmail.com"
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Số điện thoại</label>
                            <input
                                type="number"
                                placeholder="09876521"
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
                        <div className={`${styles.formGroup} ${styles.termsGroup}`}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkboxInput}
                                />
                                <span className={styles.checkboxText}>
                                    Tôi đồng ý với tất cả các{' '}
                                    <a href="/terms" className={styles.linkText}>Điều khoản</a>
                                    {' '}và{' '}
                                    <a href="/privacy" className={styles.linkText}>Chính sách bảo mật</a>
                                </span>
                            </label>
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            Tạo tài khoản
                        </button>
                    </form>
                    <div className={styles.loginPrompt}>
                        <span>Đã có tài khoản? </span>
                        <a href="/">Đăng nhập</a>
                    </div>
                    <div className={styles.copyright}>
                        Copyright © Mean 2025
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

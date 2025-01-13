import React, { useState } from 'react';
import { LeftOutlined, EyeInvisibleFilled, EyeFilled } from '@ant-design/icons';
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';
import styles from './VerifyCode.module.scss';

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
        <div className={styles.verifyContainer}>
            <div className={styles.verifyForm}>
                <div className={styles.verifyContent}>
                    <div className={styles.brand}>
                        <h1>Mean</h1>
                    </div>
                    <div className={styles.backLink}>
                        <a href="/">
                            <LeftOutlined /> Đăng nhập
                        </a>
                    </div>
                    <h2 className={styles.title}>Nhập mã xác minh</h2>
                    <p className={styles.verifyDescription}>
                        Mã xác thực đã được gửi tới email của bạn.
                    </p>
                    <form>
                        <div className={styles.formGroup}>
                            <label>Nhập mã</label>
                            <div className={styles.codeInputWrapper}>
                                <input
                                    type={showCode ? "text" : "password"}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="7789BMGX"
                                    className={styles.formInput}
                                />
                                <button
                                    type="button"
                                    className={styles.toggleVisibility}
                                    onClick={toggleCodeVisibility}
                                >
                                    {showCode ? (
                                        <EyeInvisibleFilled className={styles.visibilityIcon} />
                                    ) : (
                                        <EyeFilled className={styles.visibilityIcon} />
                                    )}
                                </button>
                            </div>
                            <div className={styles.verifyPrompt}>
                                <span>Không nhận được mã? </span>
                                <a href="">Gửi lại</a>
                            </div>
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            Xác thực
                        </button>
                    </form>
                    <div className={styles.copyright}>
                        Copyright © Mean 2025
                    </div>
                </div>
            </div>
            <div className={styles.verifyCarousel}>
                <ImageCarousel images={images} />
            </div>
        </div>
    );
};

export default VerifyCode;

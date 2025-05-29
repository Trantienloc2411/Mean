import { useState } from "react";
import { EyeInvisibleFilled, EyeFilled } from "@ant-design/icons";
import { message } from "antd";
import ImageCarousel from "../../../components/ImageCarousel/ImageCarousel";
import styles from "./Signup.module.scss";
import { useCreateUserMutation } from "../../../redux/services/userApi";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    doB: "",
    roleID: "67f87ca3c19b91da666bbdc7",
  });
  
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();

  // Validation functions
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  
  const validateDateOfBirth = (dob) => {
    if (!dob) return false;
    
    const birthDate = new Date(dob);
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthYear = birthDate.getFullYear();
    
    if (birthDate > today) return false;
    
    if (currentYear - birthYear > 100) return false;
    
    const age = currentYear - birthYear;
    const hasHadBirthdayThisYear = today >= new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    
    return age > 18 || (age === 18 && hasHadBirthdayThisYear);
  };
  
  const validatePassword = (password) => {
    if (password.length < 8) return false;
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return hasUppercase && hasLowercase && hasNumber && hasSpecial;
  };

  const isFormValid = () => {
    const isEmailValid = validateEmail(formData.email);
    const isPhoneValid = validatePhone(formData.phone);
    const isDoBValid = validateDateOfBirth(formData.doB);
    const isPasswordValid = validatePassword(formData.password);
    const isPasswordMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";
    const isFullNameValid = formData.fullName.trim() !== "";
    
    return isEmailValid && isPhoneValid && isDoBValid && isPasswordValid && 
           isPasswordMatch && isFullNameValid && acceptTerms;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email))
      return message.error("Email không hợp lệ!");
    if (!validatePhone(formData.phone))
      return message.error("Số điện thoại phải có 10 số!");
    if (!validateDateOfBirth(formData.doB))
      return message.error("Ngày sinh không hợp lệ! Bạn phải từ 18 tuổi trở lên và không quá 100 tuổi!");
    if (!validatePassword(formData.password))
      return message.error("Mật khẩu phải có ít nhất 8 ký tự, bao gồm: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!");
    if (formData.password !== formData.confirmPassword)
      return message.error("Mật khẩu nhập lại không khớp!");
    if (!acceptTerms)
      return message.error(
        "Bạn phải chấp nhận Điều khoản dịch vụ và Chính sách quyền riêng tư!"
      );

    try {
      const response = await createUser({
        ...formData,
        email: formData.email.toLowerCase().trim(),
        avatarUrl: [],
      }).unwrap();
      message.success("Đăng ký thành công!");
      console.log(response);
      navigate("/login", { 
        state: { 
          email: formData.email.toLowerCase().trim(),
          password: formData.password 
        } 
      });
    } catch (error) {
      message.error(error.data?.message || "Đăng ký thất bại!");
    }
  };

  const getFieldValidationClass = (fieldName) => {
    switch (fieldName) {
      case 'email':
        return formData.email && !validateEmail(formData.email) ? styles.invalid : '';
      case 'phone':
        return formData.phone && !validatePhone(formData.phone) ? styles.invalid : '';
      case 'doB':
        return formData.doB && !validateDateOfBirth(formData.doB) ? styles.invalid : '';
      case 'password':
        return formData.password && !validatePassword(formData.password) ? styles.invalid : '';
      case 'confirmPassword':
        return formData.confirmPassword && formData.password !== formData.confirmPassword ? styles.invalid : '';
      default:
        return '';
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCarousel}>
        <ImageCarousel
          images={[
            "https://cdn.vietnambiz.vn/2020/2/26/kcn-1582688444973524474363.jpg",
            "https://kilala.vn/data/upload/article/3685/3.jpg",
            "https://www.chudu24.com/wp-content/uploads/2017/03/khach-san-sapa-capsule-28.jpg",
          ]}
        />
      </div>
      <div className={styles.signupForm}>
        <div className={styles.signupContent}>
          <h1 className={styles.brand}>Mean</h1>
          <h2>Đăng ký</h2>
          <p className={styles.signupDescription}>
            Trở thành đối tác của chúng tôi
          </p>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Họ và tên"
                className={`${styles.formInput} ${formData.fullName.trim() === '' && formData.fullName !== '' ? styles.invalid : ''}`}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
                className={`${styles.formInput} ${getFieldValidationClass('email')}`}
                required
              />
              {formData.email && !validateEmail(formData.email) && (
                <span className={styles.errorText}>Email không hợp lệ</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0987654321"
                className={`${styles.formInput} ${getFieldValidationClass('phone')}`}
                required
              />
              {formData.phone && !validatePhone(formData.phone) && (
                <span className={styles.errorText}>Số điện thoại phải có đúng 10 số</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Ngày sinh</label>
              <input
                type="date"
                name="doB"
                value={formData.doB}
                onChange={handleChange}
                className={`${styles.formInput} ${getFieldValidationClass('doB')}`}
                required
              />
              {formData.doB && !validateDateOfBirth(formData.doB) && (
                <span className={styles.errorText}>
                  Bạn phải từ 18 tuổi trở lên và không quá 100 tuổi
                </span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Mật khẩu</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className={`${styles.formInput} ${getFieldValidationClass('password')}`}
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeInvisibleFilled className={styles.passwordIcon} />
                  ) : (
                    <EyeFilled className={styles.passwordIcon} />
                  )}
                </button>
              </div>
              {formData.password && !validatePassword(formData.password) && (
                <span className={styles.errorText}>
                  Mật khẩu phải có ít nhất 8 ký tự, bao gồm: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt
                </span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Nhập lại mật khẩu</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className={`${styles.formInput} ${getFieldValidationClass('confirmPassword')}`}
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeInvisibleFilled className={styles.passwordIcon} />
                  ) : (
                    <EyeFilled className={styles.passwordIcon} />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <span className={styles.errorText}>Mật khẩu nhập lại không khớp</span>
              )}
            </div>
            <div className={styles.formGroupCheckbox}>
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
              />
              <label htmlFor="terms">
                Tôi đồng ý với{" "}
                <a href="/terms" target="_blank">
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a href="/privacy" target="_blank">
                  Chính sách quyền riêng tư
                </a>
              </label>
            </div>
            <button
              type="submit"
              className={`${styles.submitBtn} ${!isFormValid() ? styles.disabled : ''}`}
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>
          <div className={styles.loginPrompt}>
            <span>Đã có tài khoản? </span>
            <a href="/login">Đăng nhập</a>
          </div>
          <div className={styles.copyright}>Copyright © Mean 2025</div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
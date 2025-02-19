import { Avatar, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import styles from "./CustomerProfile.module.scss";
import { useGetUserQuery } from "../../../redux/services/authApi";
import { useParams } from "react-router-dom";
import { Tag } from "antd";

export default function CustomerProfile() {
  const { id } = useParams();
  const { data: userData, isLoading } = useGetUserQuery(id);

  if (isLoading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  const userInfo = {
    fullName: userData?.getUser.fullName,
    email: userData?.getUser.email,
    phone: userData?.getUser.phone,
    avatar:
      userData?.getUser.avatarUrl?.[0] ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrT_BjEyf_LEpcvb225JX2qFCJcLz5-0RXLg&s",
    isActive: userData?.getUser.isActive,
    messageIsActive: userData?.getUser.isActive ? "Hoạt động" : "Bị khóa",
    isVerify:
      userData?.getUser.isVerifiedEmail && userData?.getUser.isVerifiedPhone,
    messageIsVerify:
      userData?.getUser.isVerifiedEmail && userData?.getUser.isVerifiedPhone
        ? "Đã xác thực"
        : "Chưa xác thực",
  };

  return (
    <div className={styles.container}>
      {/* Account Information Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Thông tin tài khoản</h2>
          <hr />
        </div>
        <div className={styles.cardContent}>
          <div className={styles.profileSection}>
            <Avatar size={80} src={userInfo.avatar} />
            <div className={styles.formFields}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <div className={styles.value}>{userInfo.fullName}</div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <div className={styles.value}>{userInfo.email}</div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone</label>
                <div className={styles.value}>{userInfo.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Status Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Trạng thái tài khoản</h2>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.statusContainer}>
            <span className={styles.statusLabel}>Trạng thái tài khoản:</span>
            <div className={styles.statusWrapper}>
              <Tag color="green" style={{marginLeft:10 ,borderRadius:20}}>
                {userInfo.messageIsActive}
              </Tag>
              <Tooltip title="Tài khoản của bạn đang hoạt động bình thường.">
                <InfoCircleOutlined className={styles.infoIcon} />
              </Tooltip>
            </div>
          </div>
          {/* <div className={styles.statusContainer}>
            <span className={styles.statusLabel}>Xác thực:</span>
            <div className={styles.statusWrapper}>
              <span className={styles.statusBadge}>
                {userInfo.messageIsVerify}
              </span>
              <Tooltip title="Trạng thái xác thực tài khoản.">
                <InfoCircleOutlined className={styles.infoIcon} />
              </Tooltip>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

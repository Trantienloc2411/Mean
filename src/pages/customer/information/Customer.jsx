import { useState } from "react";
import { Button, Input, Avatar, Tooltip } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import styles from "./CustomerProfile.module.scss";

export default function Customer() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "Alexa Rawles",
    email: "example@email.com",
    phone: "0987654321",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-P8pEL3zXlaFTj20LX30mMW58dlCSwK.png",
  });
  const [tempData, setTempData] = useState(userData);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(userData);
  };

  const handleSave = () => {
    setUserData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(userData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={styles.container}>
      {/* Account Information Card */}
      <div className={styles.card} style={{ marginVertical: 50 }}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Thông tin tài khoản</h2>
          <hr />
          {isEditing ? (
            <div className={styles.actionButtons}>
              <Button type="primary" icon={<CheckOutlined />} onClick={handleSave} />
              <Button type="default" icon={<CloseOutlined />} onClick={handleCancel} />
            </div>
          ) : (
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit} />
          )}
        </div>

        <div className={styles.cardContent}>
          <div className={styles.profileSection}>
            <Avatar size={80} src={userData.avatar || "/placeholder.svg"} />
            <div className={styles.formFields}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                {isEditing ? (
                  <Input
                    value={tempData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                  />
                ) : (
                  <div className={styles.value}>{userData.fullName}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                {isEditing ? (
                  <Input
                    value={tempData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                ) : (
                  <div className={styles.value}>{userData.email}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone</label>
                {isEditing ? (
                  <Input
                    value={tempData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                ) : (
                  <div className={styles.value}>{userData.phone}</div>
                )}
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
              <span className={styles.statusBadge}>Hoạt động</span>
              <Tooltip title="Tài khoản của bạn đang hoạt động bình thường.">
                <InfoCircleOutlined className={styles.infoIcon} />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

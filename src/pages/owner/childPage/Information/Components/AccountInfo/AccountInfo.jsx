import React from "react";
import { Card, Avatar, Typography, Space } from "antd";
import styles from "./AccountInfo.module.scss";

const { Text } = Typography;

const ProfileCard = ({ initialData }) => {
  // Đặt giá trị mặc định cho các trường nếu không có dữ liệu truyền vào
  const defaultData = {
    fullName: "N/a",
    email: "N/a",
    phone: "N/a",
    avatar: "",
    ...initialData, // Ghi đè dữ liệu mặc định nếu có dữ liệu từ props
  };

  /**
   * Hàm render một trường thông tin
   * @param {string} label - Tên của trường thông tin (ví dụ: "Full Name")
   * @param {string} value - Giá trị tương ứng
   */
  const renderField = (label, value) => {
    return (
      <div key={label} style={{ width: "100%" }}>
        <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
          {label}
        </Text>
        <div
          style={{
            background: "#f5f5f5",
            padding: "8px 12px",
            borderRadius: 6,
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            wordBreak: "break-word", // Cho phép xuống dòng nếu nội dung quá dài
            overflowWrap: "break-word", // Tương tự
          }}
        >
          {value}
        </div>
      </div>
    );
  };

  return (
    <div className="contentCard" style={{ margin: 20 }}>
      <Card
        title="Thông tin tài khoản"
        style={{
          borderRadius: 8,
          width: "100%",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }}
      >
        <Space
          direction="vertical"
          size="large"
          className={styles.gridContainer}
        >
          {/* Phần hiển thị Avatar */}
          <div style={{ textAlign: "center" }}>
            <Avatar size={80} src={defaultData.avatar} />
          </div>

          {/* Phần hiển thị các trường thông tin */}
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            {renderField("Full Name", defaultData.fullName)}
            {renderField("Email", defaultData.email)}
            {renderField("Phone", defaultData.phone)}
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default ProfileCard;

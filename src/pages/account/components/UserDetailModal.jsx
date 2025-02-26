import { Modal, Descriptions, Avatar, Tag } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./AccountTable.module.scss";
export default function UserDetailModal({ open, onClose, user }) {
  if (!user) return null;

  return (
    <Modal
      title="Chi tiết tài khoản"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: 20,
        }}
      >
        <Avatar
          size={100}
          src={user.avatarUrl?.length > 0 ? user.avatarUrl[0] : null}
          icon={!user.avatarUrl?.length && <UserOutlined />}
        />
        <h3 style={{ marginTop: 10 }}>{user.fullName}</h3>
      </div>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {user.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{user.doB}</Descriptions.Item>
        <Descriptions.Item label="Vai trò">{user.roleName}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <span className={`${styles.isActive} ${styles[user.isActive]}`}>
            {user.isActive === "true" ? "Hoạt động" : "Bị khóa"}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Xác thực Email">
          {user && (
            <span
              className={`${styles.isVerifiedEmail} ${
                user.isVerifiedEmail === "true" || user.isVerifiedEmail === true
                  ? styles[user.isVerifiedEmail]
                  : styles[user.isVerifiedEmail]
              }`}
            >
              {user.isVerifiedEmail === "true" ||
              user.isVerifiedEmail === true ? (
                <>
                  <CheckCircleOutlined /> Đã xác thực
                </>
              ) : (
                <>
                  <CloseCircleOutlined /> Chưa xác thực
                </>
              )}
            </span>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Xác thực SĐT">
          

          {user && (
            <span
              className={`${styles.isVerifiedPhone} ${
                user.isVerifiedPhone === "true" || user.isVerifiedPhone === true
                  ? styles[user.isVerifiedPhone]
                  : styles[user.isVerifiedPhone]
              }`}
            >
              {user.isVerifiedPhone === "true" ||
              user.isVerifiedPhone === true ? (
                <>
                  <CheckCircleOutlined /> Đã xác thực
                </>
              ) : (
                <>
                  <CloseCircleOutlined /> Chưa xác thực
                </>
              )}
            </span>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{user.createdAt}</Descriptions.Item>
        <Descriptions.Item label="Lần cập nhật gần nhất">
          {user.updatedAt}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

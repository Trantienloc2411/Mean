import { Modal, Descriptions, Avatar, Tag } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

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
          <Tag color={user.isActive ? "green" : "red"}>
            {user.isActive ? "Hoạt động" : "Bị khóa"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Xác thực Email">
          {user.isVerifiedEmail ? (
            <Tag color="green">
              <CheckCircleOutlined /> Đã xác thực
            </Tag>
          ) : (
            <Tag color="red">
              <CloseCircleOutlined /> Chưa xác thực
            </Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Xác thực SĐT">
          {user.isVerifiedPhone ? (
            <Tag color="green">
              <CheckCircleOutlined /> Đã xác thực
            </Tag>
          ) : (
            <Tag color="red">
              <CloseCircleOutlined /> Chưa xác thực
            </Tag>
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

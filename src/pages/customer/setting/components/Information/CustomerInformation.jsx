import { Card, Avatar, Descriptions, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function CustomerInformation({ customerDetail }) {
  if (!customerDetail) return null;

  const { _id, isDelete, createdAt, updatedAt, userId } = customerDetail;
  const { fullName, email, phone, doB, avatarUrl, isVerifiedEmail, isActive } =
    userId || {};

  return (
    <Card title="Thông tin khách hàng" style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <Avatar
          size={64}
          icon={<UserOutlined />}
          src={avatarUrl || undefined}
        />
        <div style={{ marginLeft: 16 }}>
          <h2 style={{ margin: 0 }}>{fullName || "Chưa cập nhật"}</h2>
          <p style={{ margin: 0 }}>{email || "Chưa cập nhật"}</p>
        </div>
      </div>

      <Descriptions bordered column={1}>
        {/* <Descriptions.Item label="ID khách hàng">{_id}</Descriptions.Item> */}
        <Descriptions.Item label="Số điện thoại">
          {phone || "Chưa cập nhật"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">
          {doB || "Chưa cập nhật"}
        </Descriptions.Item>
        <Descriptions.Item label="Email xác thực">
          {isVerifiedEmail ? (
            <Tag color="green">Đã xác thực</Tag>
          ) : (
            <Tag color="red">Chưa xác thực</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {isDelete ? "Đã xóa" : isActive ? "Hoạt động" : "Đã Khóa "}
        </Descriptions.Item>

        <Descriptions.Item label="Tạo lúc">{createdAt}</Descriptions.Item>
        <Descriptions.Item label="Cập nhật lúc">{updatedAt}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

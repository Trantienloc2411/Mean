import { Card, Avatar, Descriptions, Tag, Modal, Button, message } from "antd";
import {
  UserOutlined,
  ExclamationCircleOutlined,
  EditFilled,
} from "@ant-design/icons";
import {
  useActiveUserMutation,
  useBlockUserMutation,
} from "../../../../../redux/services/userApi";
import { Flex } from "antd";

const { confirm } = Modal;

export default function CustomerInformation({ customerDetail, refetch }) {
  if (!customerDetail) return null;

  const [activeUser] = useActiveUserMutation();
  const [blockUser] = useBlockUserMutation();

  const {
    _id: customerId,
    isDelete,
    createdAt,
    updatedAt,
    userId,
  } = customerDetail;
  const {
    _id: userID,
    fullName,
    email,
    phone,
    doB,
    avatarUrl,
    isVerifiedEmail,
    isActive,
  } = userId || {};

  const handleConfirm = (action, user) => {
    confirm({
      title:
        action === "active"
          ? "Xác nhận cho phép hoạt động?"
          : "Xác nhận khóa tài khoản?",
      icon: <ExclamationCircleOutlined />,
      content:
        action === "active"
          ? "Bạn có chắc chắn muốn cho phép tài khoản này hoạt động?"
          : "Bạn có chắc chắn muốn khóa tài khoản này?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () =>
        action === "active" ? handleActiveUser(user) : handleBlockUser(user),
    });
  };

  const handleActiveUser = async (user) => {
    try {
      await activeUser(userID).unwrap();
      message.success("Cho phép hoạt động thành công!");
      refetch();
    } catch {
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  const handleBlockUser = async (user) => {
    try {
      await blockUser(userID).unwrap();
      message.success("Khóa tài khoản thành công!");
      refetch();
    } catch {
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };

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
          <Flex align="center">
            <div>
              {isDelete ? (
                <Tag color="red-inverse">Đã xóa</Tag>
              ) : isActive ? (
                <Tag color="green-inverse">Hoạt động</Tag>
              ) : (
                <Tag color="lime-inverse">Đã Khóa</Tag>
              )}
            </div>
            <div style={{}}>
              {isActive ? (
                <Button
                  type="danger"
                  onClick={() => handleConfirm("block", userId)}
                >
                  {/* Khóa tài khoản */}
                  <EditFilled />
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => handleConfirm("active", userId)}
                >
                  {/* Cho phép hoạt động */}
                  <EditFilled />
                </Button>
              )}
            </div>
          </Flex>
        </Descriptions.Item>
        <Descriptions.Item label="Tạo lúc">{createdAt}</Descriptions.Item>
        <Descriptions.Item label="Cập nhật lúc">{updatedAt}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

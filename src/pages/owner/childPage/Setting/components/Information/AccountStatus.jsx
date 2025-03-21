import { Card, Tag, Button, message, Input, Modal } from "antd";
import { useState } from "react";
import { useUpdateUserMutation } from "../../../../../../redux/services/userApi";
import { useUpdateOwnerMutation } from "../../../../../../redux/services/ownerApi";
import { Flex } from "antd";
import { EditOutlined } from "@ant-design/icons";

export default function AccountStatus({ userData, refetch }) {
  const [updateUser] = useUpdateUserMutation();
  const [updateOwner] = useUpdateOwnerMutation();
  const [reason, setReason] = useState(userData.note || "");
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  const handleToggleAccountStatus = async () => {
    try {
      await updateUser({
        id: userData.userId,
        updatedUser: { isActive: !userData.isActive },
      }).unwrap();

      message.success(
        userData.isActive
          ? "Tài khoản đã bị khóa!"
          : "Tài khoản đã được mở khóa!"
      );

      await refetch();
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại!");
    } finally {
      setConfirmVisible(false);
    }
  };

  const handleApprove = async () => {
    try {
      await updateOwner({
        id: userData.ownerId,
        updatedData: { isApproved: true, note: null },
      }).unwrap();

      message.success("Đã phê duyệt chủ sở hữu!");
      setReason("");
      setModalVisible(false);
      await refetch();
    } catch (error) {
      message.error("Phê duyệt thất bại!");
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      message.error("Vui lòng nhập lý do từ chối!");
      return;
    }

    try {
      await updateOwner({
        id: userData.ownerId,
        updatedData: { isApproved: false, note: reason },
      }).unwrap();

      message.success("Đã từ chối phê duyệt chủ sở hữu!");
      setModalVisible(false);
      await refetch();
    } catch (error) {
      message.error("Từ chối thất bại!");
    }
  };
  console.log(userData);

  return (
    <Card title="Trạng thái tài khoản" style={{ marginTop: 20 }}>
      <Flex vertical gap={20}>
        <Flex>
          <div>
            <strong style={{ marginRight: 10 }}>Trạng thái hoạt động:</strong>
            {userData.isActive ? (
              <Tag color="green">Hoạt động</Tag>
            ) : (
              <Tag color="red">Bị khóa</Tag>
            )}
          </div>
          <Button
            type="text"
            danger={userData.isActive}
            onClick={() => {
              setIsLocking(userData.isActive);
              setConfirmVisible(true);
            }}
            icon={<EditOutlined />}
          />
        </Flex>

        <Flex>
          <div>
            <strong style={{ marginRight: 10 }}>Phê duyệt:</strong>
            {userData.isApproved ? (
              <Tag color="green">Đã phê duyệt</Tag>
            ) : (
              <Tag color="red">Chưa phê duyệt</Tag>
            )}
          </div>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setModalVisible(true)}
          />
        </Flex>

        <Flex>
          <div>
            <strong style={{ marginRight: 10 }}>Xác thực:</strong>
            {userData.isVerifiedEmail ? (
              <Tag color="blue">Đã xác thực</Tag>
            ) : (
              <Tag color="orange">Chưa xác thực</Tag>
            )}
          </div>
        </Flex>
        {!userData.isApproved && userData.note && (
          <p>
            <strong>Lý do chưa phê duyệt:</strong> {userData.note}
          </p>
        )}
      </Flex>

      <Modal
        title="Cập nhật phê duyệt"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="reject" danger onClick={handleReject}>
            Từ chối
          </Button>,
          <Button key="approve" type="primary" onClick={handleApprove}>
            Phê duyệt
          </Button>,
        ]}
        destroyOnClose
        maskClosable
      >
        <p>
          Nhập lý do nếu bạn muốn từ chối phê duyệt, để trống nếu muốn phê
          duyệt.
        </p>
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do từ chối (nếu có)..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>

      <Modal
        title={
          isLocking ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa tài khoản"
        }
        open={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setConfirmVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger={isLocking}
            onClick={handleToggleAccountStatus}
          >
            {isLocking ? "Khóa tài khoản" : "Mở khóa"}
          </Button>,
        ]}
        destroyOnClose
        maskClosable
      >
        <p>
          {isLocking
            ? "Bạn có chắc chắn muốn khóa tài khoản này không?"
            : "Bạn có chắc chắn muốn mở khóa tài khoản này không?"}
        </p>
      </Modal>
    </Card>
  );
}

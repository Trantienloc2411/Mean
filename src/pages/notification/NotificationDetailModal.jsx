import { Flex } from "antd";
import { Modal, Typography, Divider, Tag, Button } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const NotificationDetailModal = ({ visible, notification, onClose }) => {
  return (
    <Modal
      title="Notification Details"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={600}
    >
      <Flex align="center" justify="space-between">
        <Title level={4}>{notification.Title}</Title>
        <Text type="secondary">
          {dayjs(notification.CreateDate).format("HH:mm DD/MM/YYYY")}
        </Text>
      </Flex>
      <Text>{notification.Content}</Text>
      <Divider />
      <Tag color={notification.isRead ? "green" : "volcano"}>
        {notification.isRead ? "Read" : "Unread"}
      </Tag>
    </Modal>
  );
};

export default NotificationDetailModal;

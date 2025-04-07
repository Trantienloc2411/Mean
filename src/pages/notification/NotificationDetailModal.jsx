import { useEffect } from "react";
import { Modal, Typography, Divider, Button, Spin, Tag, Badge } from "antd";
import dayjs from "dayjs";
import { useUpdateNotificationMutation } from "../../redux/services/notificationApi";


const { Title, Text } = Typography;

const NotificationDetailModal = ({ visible, notification, onClose, loading, onUpdate  }) => {
  const [updateNotification] = useUpdateNotificationMutation();

  useEffect(() => {
    const markAsRead = async () => {
      if (visible && notification?.isRead === false) {
        try {
          await updateNotification({
            id: notification._id,
            isRead: true
          });
          onUpdate?.();
        } catch (error) {
          console.error("Update failed:", error);
        }
      }
    };
  
    markAsRead();
  }, [visible, notification]);

  const formatDate = (dateString) => {
    try {
      return dayjs(dateString, 'DD/MM/YYYY HH:mm:ss').format('HH:mm DD/MM/YYYY');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  if (!visible) return null;

  return (
    <Modal
      title="Chi tiết thông báo"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={600}
      centered
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <Spin size="large" />
        </div>
      ) : notification ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ marginBottom: 0, color: notification.isRead ? '#666' : '#1890ff' }}>
              {notification.title}
            </Title>
            <Tag color={notification.isRead ? "green" : "red"}>
              {notification.isRead ? "Đã đọc" : "Chưa đọc"}
            </Tag>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Nội dung:</Text>
            <Text style={{ whiteSpace: 'pre-line' }}>{notification.content}</Text>
          </div>

          {/* {notification.bookingId && (
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Mã Booking:</Text>
              <Text code>{notification.bookingId}</Text>
            </div>
          )} */}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary">Thời gian: {formatDate(notification.createdAt)}</Text>
            {/* {!notification.isRead && <Badge status="processing" text="Mới" />} */}
          </div>
        </div>
      ) : (
        <Text>Không tìm thấy thông tin thông báo</Text>
      )}
    </Modal>
  );
};

export default NotificationDetailModal;
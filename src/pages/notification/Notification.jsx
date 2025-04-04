import { useState, useEffect } from "react";
import { Typography, Button, Space, Spin, Badge } from "antd";
import dayjs from "dayjs";
import NotificationDetailModal from "./NotificationDetailModal";
import { useSelector } from "react-redux";
import { 
  useGetNotificationsByUserQuery,
  useGetNotificationByIdQuery,
  useUpdateNotificationMutation 
} from "../../redux/services/notificationApi";

const { Title, Text } = Typography;

export default function Notification() {
  const userId = useSelector((state) => state.auth.userId);
  const { data: response, isLoading, refetch } = useGetNotificationsByUserQuery(userId);
  const notifications = response?.data || [];
  
  const [filter, setFilter] = useState("all");
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [updateNotification] = useUpdateNotificationMutation();

  const { data: notificationDetail, isFetching: isDetailLoading } = 
    useGetNotificationByIdQuery(selectedNotificationId, {
      skip: !selectedNotificationId
    });

  useEffect(() => {
    if (notificationDetail) {
      setSelectedNotification(notificationDetail.data || notificationDetail);
    } else if (selectedNotificationId) {
      const notificationFromList = notifications.find(n => n._id === selectedNotificationId);
      setSelectedNotification(notificationFromList);
    }
  }, [notificationDetail, selectedNotificationId, notifications]);

  const filteredNotifications = notifications
    .filter((notification) => filter === "all" || !notification.isRead)
    .sort((a, b) => dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss') - dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'));

  const formatTime = (dateString) => {
    try {
      const now = dayjs();
      const notificationDate = dayjs(dateString, 'DD/MM/YYYY HH:mm:ss');

      if (now.diff(notificationDate, "day") > 10) {
        return notificationDate.format("DD/MM/YYYY");
      }

      const diffInMinutes = now.diff(notificationDate, "minute");
      const diffInHours = now.diff(notificationDate, "hour");
      const diffInDays = now.diff(notificationDate, "day");

      if (diffInMinutes < 1) return "Vừa xong";
      if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
      if (diffInHours < 24) return `${diffInHours} giờ trước`;
      if (diffInDays < 10) return `${diffInDays} ngày trước`;

      return notificationDate.format("HH:mm DD/MM");
    } catch (error) {
      return dateString;
    }
  };

  const handleNotificationClick = async (notificationId) => {
    setSelectedNotificationId(notificationId);
    try {
      await updateNotification({
        id: notificationId,
        data: { isRead: true }
      });
      refetch();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedNotificationId(null);
    setSelectedNotification(null);
  };

  if (isLoading) return <Spin size="large" />;

  return (
    <div
      style={{
        margin: "10px 20%",
        maxWidth: "90%",
        background: "#fff",
        borderRadius: 10,
        padding: 20,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Title level={3} style={{ marginBottom: 20, color: "#333" }}>
        Thông báo
      </Title>

      <Space style={{ marginBottom: 20 }}>
        <Button
          type={filter === "all" ? "primary" : "default"}
          onClick={() => setFilter("all")}
          style={{
            borderRadius: 20,
            padding: "5px 20px",
          }}
        >
          Tất cả
        </Button>
        <Button
          type={filter === "unread" ? "primary" : "default"}
          onClick={() => setFilter("unread")}
          style={{
            borderRadius: 20,
            padding: "5px 20px",
          }}
        >
          Chưa đọc
        </Button>
      </Space>

      <div>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              style={{
                padding: "15px",
                borderRadius: 10,
                marginBottom: 10,
                backgroundColor: notification.isRead ? "#f9f9f9" : "#fff",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderLeft: !notification.isRead ? "4px solid #1890ff" : "none"
              }}
              onClick={() => handleNotificationClick(notification._id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <Text
                    strong
                    style={{
                      fontSize: 16,
                      color: notification.isRead ? "#666" : "#1890ff",
                    }}
                  >
                    {notification.title}
                  </Text>
                  <div style={{ marginTop: 8 }}>
                    <Text
                      style={{
                        display: "block",
                        fontSize: 14,
                        color: "#666",
                      }}
                    >
                      {notification.content}
                    </Text>
                  </div>
                </div>
                <div style={{ marginLeft: 16 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatTime(notification.createdAt)}
                  </Text>
                  {!notification.isRead && (
                    <Badge dot style={{ marginLeft: 8 }} color="red" />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            padding: "40px 20px",
            textAlign: "center",
            color: "#888",
            fontSize: "16px"
          }}>
            Không có thông báo nào
          </div>
        )}
      </div>

      <NotificationDetailModal
        visible={!!selectedNotificationId}
        notification={selectedNotification}
        onClose={handleCloseModal}
        loading={isDetailLoading}
      />
    </div>
  );
}
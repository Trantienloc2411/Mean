import { useState } from "react";
import { Typography, Button, Space } from "antd";
import dayjs from "dayjs";
import NotificationDetailModal from "./NotificationDetailModal";

const { Title, Text } = Typography;

export default function Notification() {
  const notifications = [
    {
      Id: 1,
      Title: "Prepare for Your Adventure!",
      Content:
        "It's time to complete your travel preparations. Check the list and ensure everything is ready!",
      CreateDate: "2025-01-17T23:00:00z",
      isRead: false,
      Type: "Travel",
    },
    {
      Id: 2,
      Title: "Thank You for Your Experience!",
      Content:
        "Other users have provided positive reviews. Share your experience and earn reward points!",
      CreateDate: "2025-01-17T21:20:00z",
      isRead: true,
      Type: "Review",
    },
    {
      Id: 3,
      Title: "Weather Forecast for Your Destination",
      Content:
        "Don't forget to check the weather forecast for better travel preparation. Happy exploring!",
      CreateDate: "2025-01-06T09:00:00Z",
      isRead: false,
      Type: "Weather",
    },
    {
      Id: 4,
      Title: "New Travel Deals Available!",
      Content:
        "Explore the latest travel deals tailored just for you. Don't miss out!",
      CreateDate: "2025-01-17T15:00:00Z",
      isRead: false,
      Type: "Travel",
    },
    {
      Id: 5,
      Title: "Your Trip is Confirmed!",
      Content:
        "Your upcoming trip has been confirmed. Get ready for an amazing adventure!",
      CreateDate: "2025-01-11T15:00:00Z",
      isRead: true,
      Type: "Confirmation",
    },
  ];

  const [filter, setFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);

  const filteredNotifications = notifications
    .filter((notification) => filter === "all" || !notification.isRead)
    .sort((a, b) => dayjs(b.CreateDate) - dayjs(a.CreateDate));

  const formatTime = (date) => {
    const now = dayjs();
    const notificationDate = dayjs(date);

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
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

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
        Notifications
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
        {filteredNotifications.map((notification) => (
          <div
            key={notification.Id}
            style={{
              padding: "15px",
              borderRadius: 10,
              marginBottom: 10,
              backgroundColor: notification.isRead ? "#f9f9f9" : "#fff",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
              onClick={() => handleNotificationClick(notification)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: 16,
                    color: notification.isRead ? "#333" : "#000",
                  }}
                >
                  {notification.Title}
                </Text>
                <Text
                  type="secondary"
                  style={{ fontSize: 12, whiteSpace: "nowrap" }}
                >
                  {formatTime(notification.CreateDate)}
                </Text>
              </div>
              <Text
                ellipsis
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "#666",
                }}
              >
                {notification.Content}
              </Text>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {!notification.isRead && (
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "green",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedNotification && (
        <NotificationDetailModal
          visible={selectedNotification !== null}
          notification={selectedNotification}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

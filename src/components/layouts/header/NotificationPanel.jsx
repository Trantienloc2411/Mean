import { useState, useEffect, useRef } from "react";
import { Button, Typography, Spin } from "antd";
import { BellOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import dayjs from "dayjs";
import styleScroll from "./Notification.module.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  useGetNotificationsByUserQuery, 
  useGetNotificationByIdQuery,
  useUpdateNotificationMutation 
} from "../../../redux/services/notificationApi";
import NotificationDetailModal from "../../../pages/Notification/NotificationDetailModal";

const { Title, Paragraph } = Typography;
const ITEMS_PER_PAGE = 8;

export default function NotificationPanel({ onClose }) {
  const userId = useSelector((state) => state.auth.userId);
  const { data: response, isLoading, refetch } = useGetNotificationsByUserQuery(userId);
  const notifications = response?.data || [];
  
  const [filter, setFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [updateNotification] = useUpdateNotificationMutation();
  const [showPanel, setShowPanel] = useState(true);
  const panelRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (selectedNotificationId) {
      setShowPanel(false);
    } else {
      setShowPanel(true);
    }
  }, [selectedNotificationId]);

  const filteredNotifications = notifications
    .filter((notification) => filter === "all" || !notification.isRead)
    .sort((a, b) => dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss') - dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'))
    .slice(0, displayCount);

  const hasMore = displayCount < notifications.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !event.target.closest(".ant-btn") &&
        showPanel 
      ) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose, showPanel]);

  const handleViewAllNotifications = () => {
    onClose();
    navigate("/notification");
  };

  const formatDate = (dateString) => {
    return dayjs(dateString, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm');
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
    onClose(); 
  };

  if (isLoading) return <Spin size="small" />;

  return (
    <>
      {showPanel && (
        <div
          ref={panelRef}
          style={{
            position: "absolute",
            top: "60px",
            right: 0,
            height: "80vh",
            width: "400px",
            backgroundColor: "#fff",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
            zIndex: 9999,
            padding: 10,
          }}
        >
          <div
            className={styleScroll.scrollContainer}
            style={{ height: "100%", background: "#fff", padding: 10 }}
          >
            <Flex justify="space-between" style={{ marginBottom: 2 }}>
              <Title level={4} style={{ margin: 0 }}>
                Thông báo
              </Title>
              <Button
                type="link"
                onClick={handleViewAllNotifications}
                style={{
                  fontWeight: "500",
                  textDecoration: "underline",
                  color: "#666",
                }}
              >
                Tất cả
              </Button>
            </Flex>
            <Flex gap={10} style={{ marginBottom: 10 }}>
              <Button
                type={filter === "all" ? "primary" : "text"}
                onClick={() => setFilter("all")}
                style={{ borderRadius: 10, border: "1px solid #999" }}
              >
                Tất cả
              </Button>
              <Button
                type={filter === "unread" ? "primary" : "text"}
                style={{ borderRadius: 10, border: "1px solid #999" }}
                onClick={() => setFilter("unread")}
              >
                Chưa đọc
              </Button>
            </Flex>

            {filteredNotifications.length > 0 ? (
              <>
                {filteredNotifications.map((item) => (
                  <div 
                    key={item._id} 
                    style={{ 
                      padding: "10px 0px", 
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                      transition: "background-color 0.3s ease"
                    }}
                    onClick={() => handleNotificationClick(item._id)}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <Flex>
                      <Flex align="center">
                        <div style={{ marginRight: "10px" }}>
                          {item.isRead ? (
                            <CheckCircleOutlined
                              style={{
                                color: "green",
                                fontSize: "20px",
                                padding: 10,
                                background: "#e3e3e3",
                                borderRadius: 30,
                              }}
                            />
                          ) : (
                            <BellOutlined
                              style={{
                                color: "red",
                                fontSize: "20px",
                                padding: 10,
                                background: "#e3e3e3",
                                borderRadius: 30,
                              }}
                            />
                          )}
                        </div>

                        <div style={{ flex: 1 }}>
                          <Flex align="center" justify="space-between">
                            <Paragraph
                              style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}
                            >
                              {item.title}
                            </Paragraph>
                            <Paragraph style={{ color: "#888", fontSize: "12px" }}>
                              {formatDate(item.createdAt)}
                            </Paragraph>
                          </Flex>
                          <Paragraph
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              marginBottom: "0",
                            }}
                          >
                            {item.content.length > 50
                              ? `${item.content.slice(0, 50)}...`
                              : item.content}
                          </Paragraph>
                        </div>

                        {!item.isRead && (
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: "blue",
                            }}
                          />
                        )}
                      </Flex>
                    </Flex>
                  </div>
                ))}
                {hasMore && (
                  <Button
                    type="link"
                    onClick={handleLoadMore}
                    style={{ width: "100%", marginTop: 10 }}
                  >
                    Xem thêm
                  </Button>
                )}
              </>
            ) : (
              <div style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#888",
                fontSize: "14px"
              }}>
                Không có thông báo nào
              </div>
            )}
          </div>
        </div>
      )}

      <NotificationDetailModal
        visible={!!selectedNotificationId}
        notification={selectedNotification}
        onClose={handleCloseModal}
        loading={isDetailLoading}
      />
    </>
  );
}
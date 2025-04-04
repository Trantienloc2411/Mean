import { useState, useEffect, useRef } from "react";
import Avatar from "./Avatar";
import NotificationIcon from "./NotificationIcon";
import NotificationPanel from "./NotificationPanel";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../../../redux/services/authApi";
import { useGetNotificationsByUserQuery } from "../../../redux/services/notificationApi";

export default function HeaderAdmin() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const userId = useSelector((state) => state.auth.userId);

  const { data: userData } = useGetUserQuery(userId);
  const { data: notificationsResponse } = useGetNotificationsByUserQuery(userId);
  const unreadCount = notificationsResponse?.data?.filter(n => !n.isRead).length || 0;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const panelRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
          position: "relative",
          height: "60px",
        }}
      >
        <div></div>
        <div
          className="userOption"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div>
            {time.toLocaleTimeString()} {time.toLocaleDateString()}
          </div>
          <div ref={iconRef}>
            <NotificationIcon
              count={unreadCount}
              onClick={(e) => {
                e.stopPropagation();
                setIsNotificationOpen((prev) => !prev);
              }}
            />
          </div>
          <Avatar userData={userData} />
        </div>
      </div>

      {isNotificationOpen && (
        <div ref={panelRef}>
          <NotificationPanel
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
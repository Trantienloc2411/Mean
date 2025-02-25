import { useState, useEffect, useRef } from "react";
// import SearchField from "./SearchField";
import Avatar from "./Avatar";
import NotificationIcon from "./NotificationIcon";
import NotificationPanel from "./NotificationPanel";
import LogoHeader from "../../LogoHeader";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../../../redux/services/authApi";

export default function HeaderSimple() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);

  const { data: userData, isLoading } = useGetUserQuery(userId);
  // console.log(userData);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const notifications = [
    {
      Id: 1,
      Title: "Prepare for Your Adventure!",
      Content:
        "It's time to complete your travel preparations. Check the list and ensure everything is ready!",
      CreateDate: "2023-02-02",
      isRead: false, // false: chưa đọc, true: đã đọc
      Type: "Travel", // Loại thông báo, có thể là Travel, Alert, Update, v.v.
    },
    {
      Id: 1,
      Title: "Prepare for Your Adventure!",
      Content:
        "It's time to complete your travel preparations. Check the list and ensure everything is ready!",
      CreateDate: "2023-02-02",
      isRead: false, // false: chưa đọc, true: đã đọc
      Type: "Travel", // Loại thông báo, có thể là Travel, Alert, Update, v.v.
    },
    {
      Id: 1,
      Title: "Prepare for Your Adventure!",
      Content:
        "It's time to complete your travel preparations. Check the list and ensure everything is ready!",
      CreateDate: "2023-02-02",
      isRead: false, // false: chưa đọc, true: đã đọc
      Type: "Travel", // Loại thông báo, có thể là Travel, Alert, Update, v.v.
    },
    {
      Id: 1,
      Title: "Prepare for Your Adventure!",
      Content:
        "It's time to complete your travel preparations. Check the list and ensure everything is ready!",
      CreateDate: "2023-02-02",
      isRead: false, // false: chưa đọc, true: đã đọc
      Type: "Travel", // Loại thông báo, có thể là Travel, Alert, Update, v.v.
    },
    {
      Id: 1,
      Title: "Prepare for Your Adventure!",
      Content:
        "It's time to complete your travel preparations. Check the list and ensure everything is ready!",
      CreateDate: "2023-02-02",
      isRead: false, // false: chưa đọc, true: đã đọc
      Type: "Travel", // Loại thông báo, có thể là Travel, Alert, Update, v.v.
    },
    {
      Id: 1,
      Title: "Prepare for Your Adventure!",
      Content:
        "It's time to complete your travel preparations. Check the list and ensure everything is ready!",
      CreateDate: "2023-02-02",
      isRead: false, // false: chưa đọc, true: đã đọc
      Type: "Travel", // Loại thông báo, có thể là Travel, Alert, Update, v.v.
    },
    {
      Id: 2,
      Title: "Thank You for Your Experience!",
      Content:
        "Other users have provided positive reviews. Share your experience and earn reward points!",
      CreateDate: "2023-02-02",
      isRead: true,
      Type: "Review", // Loại thông báo
    },
    {
      Id: 3,
      Title: "Weather Forecast for Your Destination",
      Content:
        "Don't forget to check the weather forecast for better travel preparation. Happy exploring!",
      CreateDate: "2023-01-10",
      isRead: false,
      Type: "Weather", // Loại thông báo
    },
    {
      Id: 3,
      Title: "Weather Forecast for Your Destination",
      Content:
        "Don't forget to check the weather forecast for better travel preparation. Happy exploring!",
      CreateDate: "2023-01-10",
      isRead: false,
      Type: "Weather", // Loại thông báo
    },
    {
      Id: 3,
      Title: "Weather Forecast for Your Destination",
      Content:
        "Don't forget to check the weather forecast for better travel preparation. Happy exploring!",
      CreateDate: "2023-01-10",
      isRead: false,
      Type: "Weather", // Loại thông báo
    },
  ];

  const panelRef = useRef(null); // Reference for the notification panel
  const iconRef = useRef(null); // Reference for the notification icon

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false); // Close the panel
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside); // Clean up event listener
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
          backgroundColor: "#fff",
        }}
      >
        {/* <SearchField /> Search Field Component */}
        <div onClick={() => navigate("/")}>
          <LogoHeader />
        </div>
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
          {/* Notification Icon */}
          <NotificationIcon
            // ref={iconRef} // Reference for icon
            count={notifications.length}
            onClick={(e) => {
              e.stopPropagation(); // Ngừng propagate event lên trên
              setIsNotificationOpen((prev) => !prev); // Toggle notification panel
            }}
          />
          <Avatar userData={userData} /> {/* Avatar Component */}
        </div>
      </div>

      {/* Notification Panel */}
      {isNotificationOpen && (
        <div ref={panelRef}>
          <NotificationPanel
            notifications={notifications}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

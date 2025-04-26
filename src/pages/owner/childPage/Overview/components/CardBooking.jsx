import React from "react";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";
import Countdown from "react-countdown";
import styles from "./CardBooking.module.scss";

export default function CardBooking({ item, stageLevel }) {
  const renderer = ({ minutes, seconds }) => (
    <span>
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </span>
  );

  // Format time for display (HH:MM)
  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";

    // Try to split time manually
    const timePart =
      dateTimeStr.split("T")[1] || dateTimeStr.split(" ")[1] || dateTimeStr;

    if (!timePart) return "";

    const [hour, minute] = timePart.split(":");

    if (hour === undefined || minute === undefined) return "";

    // Return as HH:MM
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  // Format date for display (DD/MM/YYYY)
  const formatDate = (dateTimeStr) => {
    if (!dateTimeStr) return "";

    const datePart = dateTimeStr.split("T")[0] || dateTimeStr.split(" ")[0];
    if (!datePart) return "";

    const [year, month, day] = datePart.split("-"); // Assuming format is YYYY-MM-DD

    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return datePart; // fallback if format unexpected
  };

  // Get status label and class
  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return { label: "Chờ xác nhận", className: styles.statusPending };
      case "complete":
        return { label: "Hoàn thành", className: styles.statusComplete };
      case "cancel":
        return { label: "Đã hủy", className: styles.statusCancel };
      default:
        return { label: "Đang xử lý", className: styles.statusProcessing };
    }
  };

  const statusInfo = getStatusInfo(item.status);

  return (
    <div className={styles.cardBooking}>
      <div className={statusInfo.className}>{statusInfo.label}</div>

      <div className={styles.cardContent}>
        <div className={styles.roomNumberSection}>
          <div className={styles.roomFirstPart}>{item.roomNo}</div>
        </div>

        <div className={styles.bookingDetails}>
          <div className={styles.row}>
            <div className={styles.label}>
              <UserOutlined /> Khách hàng
            </div>
            <div className={styles.value}>
              {item.guestName || "Chưa có thông tin"}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.label}>Check-in</div>
              <div className={styles.value}>{formatTime(item.checkIn)}</div>
            </div>

            <div className={styles.column}>
              <div className={styles.label}>Check-out</div>
              <div className={styles.value}>{formatTime(item.checkOut)}</div>
            </div>
          </div>

          <div className={styles.hotelInfo}>
            <HomeOutlined /> {item.placeName}
          </div>
        </div>
      </div>
    </div>
  );
}

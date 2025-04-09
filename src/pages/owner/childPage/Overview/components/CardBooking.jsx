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

  // Format date for display (DD/MM/YYYY)
  const formatDate = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format time for display (HH:MM)
  const formatTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
              <div className={styles.value}>{formatDate(item.checkIn)}</div>
              <div className={styles.time}>{formatTime(item.checkIn)}</div>
            </div>

            <div className={styles.column}>
              <div className={styles.label}>Check-out</div>
              <div className={styles.value}>{formatDate(item.checkOut)}</div>
              <div className={styles.time}>{formatTime(item.checkOut)}</div>
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

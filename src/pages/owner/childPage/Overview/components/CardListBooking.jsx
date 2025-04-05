import React from "react";
import styles from "./CardListBooking.module.scss";
import CardBooking from "./CardBooking.jsx";

export default function CardListBooking({
  stageLevel,
  bookingList,
  listBookingTypeName,
}) {
  // Sample data - in a real app, this would come from props
  bookingList = [
    {
      placeName: "Khách sạn ABC",
      checkIn: "2025-04-03 10:10",
      checkOut: "2025-04-03 10:10",
      price: 100,
      roomNo: "101",
      guestName: "Nguyễn Văn A",
      status: "pending",
    },
    {
      placeName: "Khách sạn XYZ",
      checkIn: "2025-04-03 10:15",
      checkOut: "2025-04-03 11:10",
      price: 200,
      roomNo: "102",
      guestName: "Trần Thị B",
      status: "complete",
    },
    {
      placeName: "Khách sạn DEF",
      checkIn: "2023-10-03 11:15",
      checkOut: "2023-10-07 07:00",
      price: 150,
      roomNo: "103",
      guestName: "Lê Văn C",
      status: "cancel",
    },
    {
      placeName: "Khách sạn ABC",
      checkIn: "2025-04-03 10:10",
      checkOut: "2025-04-03 10:10",
      price: 100,
      roomNo: "101",
      guestName: "Nguyễn Văn A",
      status: "pending",
    },
    {
      placeName: "Khách sạn XYZ",
      checkIn: "2025-04-03 10:15",
      checkOut: "2025-04-03 11:10",
      price: 200,
      roomNo: "102",
      guestName: "Trần Thị B",
      status: "complete",
    },
    {
      placeName: "Khách sạn DEF",
      checkIn: "2023-10-03 11:15",
      checkOut: "2023-10-07 07:00",
      price: 150,
      roomNo: "103",
      guestName: "Lê Văn C",
      status: "cancel",
    },
  ];

  return (
    <div className={styles.cardListBooking}>
      <h2 className={styles.title}>{listBookingTypeName}</h2>
      <div className={styles.bookingList}>
        {bookingList.map((item, index) => (
          <CardBooking key={index} item={item}  stageLevel={stageLevel} />
        ))}
      </div>
    </div>
  );
}
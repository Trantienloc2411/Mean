import { useState, useEffect } from "react";
import styles from "./Booking.module.scss";
import ListBooking from "./components/ListBooking/ListBooking";
import { message } from "antd";
import {
  useGetAllBookingsQuery,
  useUpdateBookingMutation,
  useGetBookingByIdQuery,
} from "../../redux/services/bookingApi";
import dayjs from "dayjs";

const BOOKING_STATUS = Object.freeze({
  CONFIRMED: 1,
  NEEDCHECKIN: 2,
  CHECKEDIN: 3,
  NEEDCHECKOUT: 4,
  CHECKEDOUT: 5,
  CANCELLED: 6,
  COMPLETED: 7,
  PENDING: 8,
  REFUND: 9,
});

const PAYMENT_STATUS = Object.freeze({
  BOOKING: 1,
  PENDING: 2,
  PAID: 3,
  REFUND: 4,
  FAILED: 5,
});

const PAYMENT_METHOD = Object.freeze({
  MOMO: 1,
});

const getBookingStatusDisplay = (statusCode) => {
  const statusMap = {
    [BOOKING_STATUS.CONFIRMED]: "Đã xác nhận",
    [BOOKING_STATUS.PENDING]: "Chờ xác nhận",
    [BOOKING_STATUS.NEEDCHECKIN]: "Cần check-in",
    [BOOKING_STATUS.CHECKEDIN]: "Đã check-in",
    [BOOKING_STATUS.NEEDCHECKOUT]: "Cần check-out",
    [BOOKING_STATUS.CHECKEDOUT]: "Đã check-out",
    [BOOKING_STATUS.CANCELLED]: "Đã huỷ",
    [BOOKING_STATUS.COMPLETED]: "Hoàn tất",
    [BOOKING_STATUS.REFUND]: "Đã hoàn tiền",
  };
  return statusMap[statusCode] || "Trạng thái không xác định";
};

const getPaymentStatusDisplay = (statusCode) => {
  const statusMap = {
    [PAYMENT_STATUS.BOOKING]: "Đã đặt",
    [PAYMENT_STATUS.PENDING]: "Chờ thanh toán",
    [PAYMENT_STATUS.PAID]: "Đã thanh toán",
    [PAYMENT_STATUS.REFUND]: "Yêu cầu hoàn tiền",
    [PAYMENT_STATUS.FAILED]: "Thanh toán thất bại",
  };
  return statusMap[statusCode] || "Chưa thanh toán";
};

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();

  const {
    data: bookingDetailData,
    isLoading: isLoadingBookingDetail,
    error: bookingDetailError,
  } = useGetBookingByIdQuery(selectedBookingId, {
    skip: !selectedBookingId,
  });

  const {
    data: bookingsData,
    isLoading,
    error,
    refetch: refetchBookings,
  } = useGetAllBookingsQuery();

  useEffect(() => {
    if (bookingsData && bookingsData.length > 0) {
      const sortedBookings = [...bookingsData].sort((a, b) => {
        const aNeedsRefund =
          a.status === BOOKING_STATUS.CANCELLED &&
          a.paymentStatus !== PAYMENT_STATUS.REFUND;
        const bNeedsRefund =
          b.status === BOOKING_STATUS.CANCELLED &&
          b.paymentStatus !== PAYMENT_STATUS.REFUND;

        if (aNeedsRefund && !bNeedsRefund) return -1;
        if (!aNeedsRefund && bNeedsRefund) return 1;

        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      const processedBookings = sortedBookings.map((booking) => {
        return {
          _originalBooking: booking,
          Status: getBookingStatusDisplay(booking.status),
          Payment: getPaymentStatusDisplay(booking.paymentStatus),
          createdDate: new Date(booking.createdAt),
          checkInHour: dayjs(booking.checkInHour).format("DD/MM/YYYY HH:mm:ss"),
          checkOutHour: dayjs(booking.checkOutHour).format(
            "DD/MM/YYYY HH:mm:ss"
          ),
        };
      });

      setBookings(processedBookings);
    }
  }, [bookingsData]);

  const handleStatusChange = async (bookingId, updateData) => {
    try {
      const result = await updateBooking({
        id: bookingId,
        ...updateData,
      }).unwrap();

      message.success("Cập nhật thành công");
      refetchBookings();

      return result;
    } catch (error) {
      message.error(error?.data?.message || "Cập nhật thất bại");
      console.error("Error updating booking:", error);
      throw error;
    }
  };

  const handleSelectBookingDetail = (bookingId) => {
    setSelectedBookingId(bookingId);
  };

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi tải booking</div>;

  return (
    <div className={styles.content}>
      <ListBooking
        bookings={bookings}
        bookingStatusCodes={BOOKING_STATUS}
        paymentStatusCodes={PAYMENT_STATUS}
        paymentMethodCodes={PAYMENT_METHOD}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
        bookingDetailData={bookingDetailData}
        onSelectBookingDetail={handleSelectBookingDetail}
        onReload={refetchBookings}
      />
    </div>
  );
}
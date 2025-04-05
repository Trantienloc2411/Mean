import React, { useState, useEffect } from 'react';
import styles from '../Booking/Booking.module.scss';
import ListBooking from './components/ListBooking/ListBooking';
import { message } from 'antd';
import {
  useGetAllBookingsQuery,
  useUpdateBookingMutation,
  useGetBookingByIdQuery,
} from '../../redux/services/bookingApi';

const BOOKING_STATUS = Object.freeze({
  CONFIRMED: 1,
  NEEDCHECKIN: 2,
  CHECKEDIN: 3,
  NEEDCHECKOUT: 4,
  CHECKEDOUT: 5,
  CANCELLED: 6,
  COMPLETED: 7,
  PENDING: 8,   
});

const PAYMENT_STATUS = Object.freeze({
  BOOKING: 1,
  PENDING: 2,
  PAID: 3,
  REFUND: 4,
  FAILED: 5,        
});

const getBookingStatusDisplay = (statusCode) => {
  const statusMap = {
    [BOOKING_STATUS.CONFIRMED]: "Confirmed",
    [BOOKING_STATUS.PENDING]: "Pending",
    [BOOKING_STATUS.NEEDCHECKIN]: "Need Check-in",
    [BOOKING_STATUS.CHECKEDIN]: "Checked In",
    [BOOKING_STATUS.NEEDCHECKOUT]: "Need Check-out",
    [BOOKING_STATUS.CHECKEDOUT]: "Checked Out",
    [BOOKING_STATUS.CANCELLED]: "Cancelled",
    [BOOKING_STATUS.COMPLETED]: "Completed"
  };
  return statusMap[statusCode] || "Unknown Status";
};

const getPaymentStatusDisplay = (statusCode) => {
  const statusMap = {
    [PAYMENT_STATUS.BOOKING]: "Booking",
    [PAYMENT_STATUS.PENDING]: "Pending",
    [PAYMENT_STATUS.PAID]: "Paid",
    [PAYMENT_STATUS.REFUND]: "Refund",
    [PAYMENT_STATUS.FAILED]: "Failed",
  };
  return statusMap[statusCode] || "Unpaid";
};

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();

  const { 
    data: bookingDetailData, 
    isLoading: isLoadingBookingDetail,
    error: bookingDetailError 
  } = useGetBookingByIdQuery(selectedBookingId, {
    skip: !selectedBookingId
  });

  const {
    data: bookingsData,
    isLoading,
    error,
    refetch: refetchBookings
  } = useGetAllBookingsQuery();

  useEffect(() => {
    if (bookingsData && bookingsData.length > 0) {
      const processedBookings = bookingsData.map(booking => {
        return {
          _originalBooking: booking,
          Status: getBookingStatusDisplay(booking.status),
          Payment: getPaymentStatusDisplay(booking.paymentStatus)
        };
      });

      setBookings(processedBookings);
    }
  }, [bookingsData]);

  const handleStatusChange = async (bookingId, updateData) => {
    try {
      const result = await updateBooking({
        id: bookingId, 
        ...updateData 
      }).unwrap();
  
      message.success('Cập nhật thành công');
      refetchBookings();
  
      return result;
    } catch (error) {
      message.error(error?.data?.message || 'Cập nhật thất bại');
      console.error('Error updating booking:', error);
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
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
        bookingDetailData={bookingDetailData} 
        onSelectBookingDetail={handleSelectBookingDetail} 
      />
    </div>
  );
}
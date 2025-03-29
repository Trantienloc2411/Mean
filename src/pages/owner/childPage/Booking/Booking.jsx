import React, { useState, useEffect } from 'react';
import styles from '../Booking/Booking.module.scss';
import ListBooking from './Components/ListBooking/ListBooking';
import ListPlace from './Components/ListPlace/ListPlace';
import { message } from 'antd';
import {
  useGetBookingsByOwnerIdQuery,
  useUpdateBookingMutation,
  useGetBookingByIdQuery,
} from '../../../../redux/services/bookingApi';
import { useGetOwnerDetailByUserIdQuery } from '../../../../redux/services/ownerApi';

const BOOKING_STATUS = Object.freeze({
  CONFIRMED: 1,     
  PENDING: 2,    
  NEEDCHECKIN: 3,  
  CHECKEDIN: 4,   
  NEEDCHECKOUT: 5, 
  CHECKEDOUT: 6,   
  CANCELLED: 7,   
  COMPLETED: 8,    
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
    [PAYMENT_STATUS.PAID]: "Fully Paid",
    [PAYMENT_STATUS.REFUND]: "Refunded",
    [PAYMENT_STATUS.FAILED]: "Failed",
  };
  return statusMap[statusCode] || "Unpaid";
};

export default function Booking() {
  const [effectiveOwnerId, setEffectiveOwnerId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();

  // Query for booking detail with refined query logic
  const { 
    data: bookingDetailData, 
    isLoading: isLoadingBookingDetail,
    error: bookingDetailError 
  } = useGetBookingByIdQuery(selectedBookingId, {
    skip: !selectedBookingId
  });

  const userId = localStorage.getItem('user_id');

  const {
    data: ownerDetailData,
    isLoading: isLoadingOwnerDetail,
    error: ownerDetailError
  } = useGetOwnerDetailByUserIdQuery(
    userId,
    {
      skip: !userId
    }
  );

  useEffect(() => {
    if (ownerDetailData) {
      const ownerId = ownerDetailData.id || ownerDetailData._id;
      setEffectiveOwnerId(ownerId);
    }
  }, [ownerDetailData]);

  const {
    data: bookingsData,
    isLoading,
    error,
    refetch: refetchBookings
  } = useGetBookingsByOwnerIdQuery(
    effectiveOwnerId,
    {
      skip: !effectiveOwnerId
    }
  );

  useEffect(() => {
    if (bookingsData && bookingsData.length > 0) {
      const processedBookings = bookingsData.map(bookingWrapper => {
        const booking = bookingWrapper.booking_1 || bookingWrapper;
        return {
          _originalBooking: booking,
          Status: getBookingStatusDisplay(booking.status),
          Payment: getPaymentStatusDisplay(booking.paymentStatus)
        };
      });

      setBookings(processedBookings);

      const uniqueLocations = processedBookings
        .map(booking => booking._originalBooking.accommodationId)
        .filter((location, index, self) =>
          location &&
          index === self.findIndex((t) => t._id === location._id)
        );

      setLocations(uniqueLocations);
    }
  }, [bookingsData]);

  const handleLocationSelect = (locationId) => {
    setSelectedLocation(locationId);
  };

  const handleStatusChange = async (bookingId, newStatusDisplay) => {
    try {
      const statusCodeKey = Object.keys(BOOKING_STATUS).find(
        key => getBookingStatusDisplay(BOOKING_STATUS[key]) === newStatusDisplay
      );

      if (!statusCodeKey) {
        throw new Error(`Invalid status: ${newStatusDisplay}`);
      }

      const statusCode = BOOKING_STATUS[statusCodeKey];

      const result = await updateBooking({
        id: bookingId, 
        status: statusCode
      }).unwrap();

      message.success('Cập nhật trạng thái booking thành công');
      refetchBookings();

      return result;
    } catch (error) {
      message.error(error?.data?.message || 'Cập nhật trạng thái booking thất bại');
      console.error('Error updating booking status:', error);
      throw error;
    }
  };

  // Function to handle selecting a booking for detail view
  const handleSelectBookingDetail = (bookingId) => {
    setSelectedBookingId(bookingId);
  };

  const filteredBookings = selectedLocation === 'all'
    ? bookings
    : bookings.filter(booking =>
      booking._originalBooking.accommodationId &&
      booking._originalBooking.accommodationId._id === selectedLocation
    );

  if (isLoadingOwnerDetail) return <div>Đang tải thông tin chủ sở hữu...</div>;
  if (ownerDetailError) return <div>Lỗi tải thông tin chủ sở hữu</div>;
  if (!userId) return <div>Không tìm thấy ID người dùng</div>;
  if (!effectiveOwnerId) return <div>Không thể truy xuất ID chủ sở hữu</div>;
  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi tải booking</div>;

  return (
    <div className={styles.content}>
      <ListPlace
        locations={locations}
        onSelectLocation={handleLocationSelect}
        selectedLocation={selectedLocation}
      />
      <ListBooking
        bookings={filteredBookings}
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
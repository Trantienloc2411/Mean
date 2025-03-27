import React, { useState, useEffect } from 'react';
import styles from '../Booking/Booking.module.scss';
import ListBooking from './Components/ListBooking/ListBooking';
import ListPlace from './Components/ListPlace/ListPlace';
import {
  useGetBookingsByOwnerIdQuery,
  useUpdateBookingMutation,
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

const formatDate = (dateString) => {
  try {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    return date.toLocaleString();
  } catch (error) {
    console.error('Invalid date format:', dateString);
    return 'Invalid Date';
  }
};

export default function Booking() {
  const [effectiveOwnerId, setEffectiveOwnerId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');

  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();

  const userId = localStorage.getItem('user_id');

  const {
    data: ownerDetailData,
    isLoading: isLoadingOwnerDetail,
    error: ownerDetailError
  } = useGetOwnerDetailByUserIdQuery(
    userId,
    {
      skip: !userId,
      onSuccess: (data) => {
        console.log('🔍 Owner Detail Query Success:', data);
      },
      onError: (error) => {
        console.error('❌ Owner Detail Query Error:', error);
      }
    }
  );

  useEffect(() => {
    if (ownerDetailData) {
      const ownerId = ownerDetailData.id || ownerDetailData._id;
      console.log('🔑 Extracted Owner ID:', ownerId);
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
      skip: !effectiveOwnerId,
      onSuccess: (data) => {
        console.log('📋 Bookings Query Full Response:', data);
      },
      onError: (error) => {
        console.error('❌ Bookings Query Error:', error);
      }
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

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const statusCodeKey = Object.keys(BOOKING_STATUS).find(
        key => getBookingStatusDisplay(BOOKING_STATUS[key]) === newStatus
      );

      if (!statusCodeKey) {
        throw new Error(`Invalid status: ${newStatus}`);
      }

      const statusCode = BOOKING_STATUS[statusCodeKey];
      const result = await updateBooking({
        bookingId,
        status: statusCode
      }).unwrap();
      refetchBookings();

      return result;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  };

  const filteredBookings = selectedLocation === 'all'
    ? bookings
    : bookings.filter(booking =>
      booking._originalBooking.accommodationId &&
      booking._originalBooking.accommodationId._id === selectedLocation
    );

  if (isLoadingOwnerDetail) return <div>Loading owner details...</div>;
  if (ownerDetailError) return <div>Error fetching owner details</div>;
  if (!userId) return <div>No user ID found</div>;
  if (!effectiveOwnerId) return <div>Could not retrieve owner ID</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching bookings</div>;

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
      />
    </div>
  );
}
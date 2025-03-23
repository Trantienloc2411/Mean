import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../Booking/Booking.module.scss';
import ListBooking from './Components/ListBooking/ListBooking';
import ListPlace from './Components/ListPlace/ListPlace';
import { 
  useGetBookingsByOwnerIdQuery, 
  useUpdateBookingMutation,
  useGetBookingByIdQuery,
} from '../../../../redux/services/bookingApi';

const BOOKING_STATUS = Object.freeze({
  CONFIRMED: 1,
  NEEDCHECKIN: 2,
  CHECKEDIN: 3,
  NEEDCHECKOUT: 4,
  CHECKEDOUT: 5,
  CANCELLED: 6,
  COMPLETED: 7,
});

const PAYMENT_STATUS = Object.freeze({
  BOOKING: 1,
  PENDING: 2,
  PAID: 3,
  REFUND: 4,
  FAILED: 5,
});

const getBookingStatusDisplay = (statusCode) => {
  switch (statusCode) {
    case BOOKING_STATUS.CONFIRMED:
      return "Confirmed";
    case BOOKING_STATUS.NEEDCHECKIN:
      return "Pending Check-in";
    case BOOKING_STATUS.CHECKEDIN:
      return "Checked In";
    case BOOKING_STATUS.NEEDCHECKOUT:
      return "Pending Check-out";
    case BOOKING_STATUS.CHECKEDOUT:
      return "Checked Out";
    case BOOKING_STATUS.CANCELLED:
      return "Canceled";
    case BOOKING_STATUS.COMPLETED:
      return "Complete";
    default:
      return "Pending";
  }
};

const getPaymentStatusDisplay = (statusCode) => {
  switch (statusCode) {
    case PAYMENT_STATUS.BOOKING:
      return "Booking";
    case PAYMENT_STATUS.PENDING:
      return "Pending";
    case PAYMENT_STATUS.PAID:
      return "Fully Paid";
    case PAYMENT_STATUS.REFUND:
      return "Refunded";
    case PAYMENT_STATUS.FAILED:
      return "Failed";
    default:
      return "Unpaid";
  }
};

export default function Booking() {
  const { ownerId: routeOwnerId } = useParams();
  const [manualOwnerId, setManualOwnerId] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  
  useEffect(() => {
    if (!routeOwnerId || routeOwnerId === 'undefined') {
      const urlParts = window.location.pathname.split('/');
      const ownerIdIndex = urlParts.indexOf('owner') + 1;
      if (ownerIdIndex > 0 && ownerIdIndex < urlParts.length) {
        setManualOwnerId(urlParts[ownerIdIndex]);
      }
    }
  }, [routeOwnerId]);

  const effectiveOwnerId = routeOwnerId && routeOwnerId !== 'undefined' ? routeOwnerId : manualOwnerId;
  
  const skipQuery = !effectiveOwnerId;
  const { data: bookingsData, isLoading, error, refetch: refetchBookings } = useGetBookingsByOwnerIdQuery(effectiveOwnerId, {
    skip: skipQuery
  });
  
  const { data: selectedBookingData, isLoading: isLoadingBookingDetails } = useGetBookingByIdQuery(selectedBookingId, {
    skip: !selectedBookingId
  });
  
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (bookingsData && bookingsData.bookings) {
      const formattedBookings = bookingsData.bookings.map((bookingObj) => {
        const bookingKey = Object.keys(bookingObj)[0];
        const booking = bookingObj[bookingKey];
        
        return {
          No: booking._id ? booking._id.substring(booking._id.length - 5) : 'N/A',
          "Customer Name": booking.customerId?.userId?.fullName || "Unknown",
          Location: booking.accommodationId?.description || "Unknown",
          "Booking Time": new Date(booking.createdAt).toLocaleString(),
          "Usage Time": `${new Date(booking.checkInHour).toLocaleString()} ${booking.checkOutHour ? `- ${new Date(booking.checkOutHour).toLocaleString()}` : ''}`,
          "Total Price": booking.totalPrice || booking.basePrice || 0,
          Status: getBookingStatusDisplay(booking.status), 
          Payment: getPaymentStatusDisplay(booking.paymentStatus),
          _originalBooking: booking
        };
      });
      
      setBookings(formattedBookings);
      
      const locationsList = [];
      bookingsData.bookings.forEach(bookingObj => {
        const bookingKey = Object.keys(bookingObj)[0];
        const booking = bookingObj[bookingKey];
        
        if (booking.accommodationId && !locationsList.some(loc => loc._id === booking.accommodationId._id)) {
          locationsList.push(booking.accommodationId);
        }
      });
      
      setLocations(locationsList);
    }
  }, [bookingsData]);

  const handleLocationSelect = (locationId) => {
    setSelectedLocation(locationId);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBooking({
        id: bookingId,
        status: newStatus
      }).unwrap();
      
      refetchBookings();
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  const filteredBookings = selectedLocation === 'all' 
    ? bookings 
    : bookings.filter(booking => 
        booking._originalBooking.accommodationId && 
        booking._originalBooking.accommodationId._id === selectedLocation
      );

  if (skipQuery) {
    return <div className="error-message">Invalid owner ID. Please check the URL parameters.</div>;
  }
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error-message">Error: {error.data?.message || error.error || 'Failed to fetch bookings'}</div>;

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
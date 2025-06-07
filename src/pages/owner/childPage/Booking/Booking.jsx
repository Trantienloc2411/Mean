import { useState, useEffect } from "react";
import styles from "./Booking.module.scss";
import ListBooking from "./Components/ListBooking/ListBooking";
import ListPlace from "./Components/ListPlace/ListPlace";
import { message, Spin } from "antd";
import {
  useGetBookingsByOwnerIdQuery,
  useUpdateBookingMutation,
  useGetBookingByIdQuery,
} from "../../../../redux/services/bookingApi";
import { useGetOwnerDetailByUserIdQuery } from "../../../../redux/services/ownerApi";
import NotApprove from "../notApprove/NotApprove";
import { useParams } from "react-router-dom";

const BOOKING_STATUS = Object.freeze({
  CONFIRMED: 1,
  NEEDCHECKIN: 2,
  CHECKEDIN: 3,
  NEEDCHECKOUT: 4,
  CHECKEDOUT: 5,
  CANCELLED: 6,
  COMPLETED: 7,
  PENDING: 8,
  REFUND: 9
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
    [BOOKING_STATUS.CONFIRMED]: "Đã xác nhận",
    [BOOKING_STATUS.PENDING]: "Chờ xác nhận",
    [BOOKING_STATUS.NEEDCHECKIN]: "Cần check-in",
    [BOOKING_STATUS.CHECKEDIN]: "Đã check-in",
    [BOOKING_STATUS.NEEDCHECKOUT]: "Cần check-out",
    [BOOKING_STATUS.CHECKEDOUT]: "Đã check-out",
    [BOOKING_STATUS.CANCELLED]: "Đã huỷ",
    [BOOKING_STATUS.COMPLETED]: "Hoàn tất",
    [BOOKING_STATUS.REFUND]: "Đã hoàn tiền"
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

const PAYMENT_METHOD = Object.freeze({
  MOMO: 1,
});

export default function Booking() {
  const [effectiveOwnerId, setEffectiveOwnerId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  const userRole = localStorage.getItem("user_role")?.toLowerCase();
  const isAdmin = userRole === `"admin"` || userRole === `"staff"`;

  const { data: bookingDetailData, isLoading: isLoadingBookingDetail } =
    useGetBookingByIdQuery(selectedBookingId, {
      skip: !selectedBookingId,
    });

  const { id } = useParams();

  const { data: ownerDetailData, isLoading: isLoadingOwnerDetail } =
    useGetOwnerDetailByUserIdQuery(id, {
      skip: !id,
    });

  useEffect(() => {
    if (ownerDetailData) {
      const ownerId = ownerDetailData.id || ownerDetailData._id;
      setEffectiveOwnerId(ownerId);
    }
  }, [ownerDetailData]);

  const {
    data: bookingsData,
    isLoading,
    refetch: refetchBookings,
  } = useGetBookingsByOwnerIdQuery(effectiveOwnerId, {
    skip: !effectiveOwnerId,
  });

  useEffect(() => {
    if (bookingsData) {
      let processedBookings = [];
      const locationMap = new Map();

      if (bookingsData.bookings && Array.isArray(bookingsData.bookings)) {
        processedBookings = bookingsData.bookings.map((bookingWrapper) => {
          const bookingKey = Object.keys(bookingWrapper).find((key) =>
            key.startsWith("booking_")
          );
          const booking = bookingKey
            ? bookingWrapper[bookingKey]
            : bookingWrapper;

          return {
            _originalBooking: booking,
            Status: getBookingStatusDisplay(booking.status),
            Payment: getPaymentStatusDisplay(booking.paymentStatus),
          };
        });
      } else if (Array.isArray(bookingsData)) {
        processedBookings = bookingsData.map((booking) => {
          return {
            _originalBooking: booking,
            Status: getBookingStatusDisplay(booking.status),
            Payment: getPaymentStatusDisplay(booking.paymentStatus),
          };
        });
      }

      processedBookings.forEach((bookingData) => {
        const booking = bookingData._originalBooking;
        if (
          booking &&
          booking.accommodationId &&
          booking.accommodationId.rentalLocationId
        ) {
          const locationId = booking.accommodationId.rentalLocationId._id;

          if (!locationMap.has(locationId)) {
            locationMap.set(locationId, booking.accommodationId);
          }
        }
      });

      setBookings(processedBookings);
      setLocations(Array.from(locationMap.values()));
    }
  }, [bookingsData]);

  useEffect(() => {
    if (bookings.length > 0) {
      if (selectedLocation === "all") {
        setFilteredBookings(bookings);
      } else {
        const filtered = bookings.filter((booking) => {
          const locationId =
            booking._originalBooking.accommodationId?.rentalLocationId?._id;
          return locationId === selectedLocation;
        });
        setFilteredBookings(filtered);
      }
    } else {
      setFilteredBookings([]);
    }
  }, [selectedLocation, bookings]);

  const handleLocationSelect = (locationId) => {
    setSelectedLocation(locationId);
  };

  const handleStatusChange = async (bookingId, payload) => {
    try {
      const currentBooking = bookings.find(
        b => b._originalBooking._id === bookingId
      );
  
      const updateData = {
        id: bookingId,
        ...payload,
        ...(payload.status === BOOKING_STATUS.CANCELLED && currentBooking?._originalBooking.paymentStatus === PAYMENT_STATUS.PAID && {
          paymentStatus: PAYMENT_STATUS.REFUND
        })
      };
  
      await updateBooking(updateData).unwrap();
      refetchBookings();
      
      const successMessage = payload.status === BOOKING_STATUS.CANCELLED 
        ? `Đã hủy booking${currentBooking?._originalBooking.paymentStatus === PAYMENT_STATUS.PAID ? ' và yêu cầu hoàn tiền' : ''}`
        : "Cập nhật trạng thái thành công";
      
      message.success(successMessage);
    } catch (error) {
      message.error(error?.data?.message || "Cập nhật thất bại");
      throw error;
    }
  };

  const handleSelectBookingDetail = (bookingId) => {
    setSelectedBookingId(bookingId);
  };

  if (isLoadingOwnerDetail || isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <>
      {ownerDetailData?.approvalStatus == 2 || isAdmin ? (
        <div className={styles.bookingDashboard}>
          <ListPlace
            locations={locations}
            onSelectLocation={handleLocationSelect}
            selectedLocation={selectedLocation}
          />
          <ListBooking
            bookings={filteredBookings}
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
      ) : (
        <NotApprove />
      )}
    </>
  );
}
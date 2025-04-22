import { useState, useEffect } from "react";
import styles from "./Booking.module.scss";
import ListBooking from "./Components/ListBooking/ListBooking";
import ListPlace from "./Components/ListPlace/ListPlace";
import { message, Spin } from "antd";
import {
  useGetBookingsByOwnerIdQuery,
  useUpdateBookingMutation,
  useGetBookingByIdQuery,
  useGenerateBookingPasswordMutation,
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
    [BOOKING_STATUS.COMPLETED]: "Completed",
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
  const [effectiveOwnerId, setEffectiveOwnerId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  const [generatePassword] = useGenerateBookingPasswordMutation();
  const userRole = localStorage.getItem("user_role")?.toLowerCase(); // "owner" | "admin"
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

  const handleStatusChange = async (bookingId, newStatusDisplay) => {
    try {
      const statusCodeKey = Object.keys(BOOKING_STATUS).find(
        (key) =>
          getBookingStatusDisplay(BOOKING_STATUS[key]) === newStatusDisplay
      );

      if (!statusCodeKey) {
        throw new Error(`Invalid status: ${newStatusDisplay}`);
      }

      const statusCode = BOOKING_STATUS[statusCodeKey];

      const result = await updateBooking({
        id: bookingId,
        status: statusCode,
      }).unwrap();

      message.success("Cập nhật trạng thái booking thành công");
      refetchBookings();

      return result;
    } catch (error) {
      message.error(
        error?.data?.message || "Cập nhật trạng thái booking thất bại"
      );
      console.error("Error updating booking status:", error);
      throw error;
    }
  };

  const handleGeneratePassword = async ({ bookingId, passwordRoomInput }) => {
    try {
      const result = await generatePassword({
        bookingId,
        passwordRoomInput,
      }).unwrap();
      message.success("Mật khẩu phòng đã được cập nhật thành công");
      return result;
    } catch (error) {
      message.error(error?.data?.message || "Cập nhật mật khẩu phòng thất bại");
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
            onStatusChange={handleStatusChange}
            isUpdating={isUpdating}
            bookingDetailData={bookingDetailData}
            onSelectBookingDetail={handleSelectBookingDetail}
            generatePassword={handleGeneratePassword}
          />
        </div>
      ) : (
        <NotApprove />
      )}
    </>
  );
}

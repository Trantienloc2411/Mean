import React from 'react';
import { Modal, Button, message } from 'antd';
import styles from './UpdateBookingStatus.module.scss';
import { useCreateNotificationMutation } from '../../../../redux/services/notificationApi';

const UpdateBookingStatus = ({
  booking,
  visible,
  onClose,
  bookingStatusCodes,
  paymentStatusCodes,
  onStatusChange,
  isLoading
}) => {
  const [createNotification] = useCreateNotificationMutation();

  const getBookingStatusDisplay = (statusCode) => {
    const statusMap = {
      [bookingStatusCodes.CONFIRMED]: "Confirmed",
      [bookingStatusCodes.PENDING]: "Pending",
      [bookingStatusCodes.NEEDCHECKIN]: "Need Check-in",
      [bookingStatusCodes.CHECKEDIN]: "Checked In",
      [bookingStatusCodes.NEEDCHECKOUT]: "Need Check-out",
      [bookingStatusCodes.CHECKEDOUT]: "Checked Out",
      [bookingStatusCodes.CANCELLED]: "Cancelled",
      [bookingStatusCodes.COMPLETED]: "Completed"
    };
    return statusMap[statusCode] || "Unknown Status";
  };

  const getPaymentStatusDisplay = (statusCode) => {
    const statusMap = {
      [paymentStatusCodes.BOOKING]: "Booking",
      [paymentStatusCodes.PENDING]: "Pending",
      [paymentStatusCodes.PAID]: "Paid",
      [paymentStatusCodes.REFUND]: "Refund",
      [paymentStatusCodes.FAILED]: "Failed",
    };
    return statusMap[statusCode] || "Unpaid";
  };

  const isCancelled = booking?._originalBooking?.status === bookingStatusCodes.CANCELLED;
  const isNotRefunded = booking?._originalBooking?.paymentStatus !== paymentStatusCodes.REFUND;

  const handleRefund = async () => {
    if (!isCancelled) {
      message.warning("Chỉ có thể hoàn tiền cho booking đã hủy");
      return;
    }

    try {
      await onStatusChange({
        paymentStatus: paymentStatusCodes.REFUND
      });
      const notificationData = {
        userId: booking._originalBooking.customerId.userId._id,
        bookingId: booking._originalBooking._id,
        title: "Hoàn tiền được chấp nhận",
        content: "Yêu cầu hoàn tiền cho đơn đặt chỗ của bạn đã được chấp nhận. Khoản tiền sẽ được hoàn trong thời gian sớm nhất, vui lòng đợi trong vòng 14 ngày làm việc. Nếu cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi.",
        isRead: false,
        type: 1
      };

      await createNotification(notificationData).unwrap();

      message.success("Hoàn tiền thành công");
      onClose();
    } catch (error) {
      message.error(error?.message || "Hoàn tiền thất bại");
      console.error('Error processing refund:', error);
    }
  };

  return (
    <Modal
      title="Hoàn Tiền Booking"
      open={visible}
      onCancel={onClose}
      className={styles.modalContainer}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Đóng
        </Button>,
        isCancelled && isNotRefunded && (
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={handleRefund}
            className={styles.refundButton}
          >
            Xác Nhận Hoàn Tiền
          </Button>
        ),
      ]}
      width={600}
    >
      <div className={styles.bookingInfoSection}>
        <h3>Thông Tin Booking</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Mã Booking:</span>
          <span className={styles.infoValue}>{booking?._originalBooking?._id || 'N/A'}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Khách Hàng:</span>
          <span className={styles.infoValue}>
            {booking?._originalBooking?.customerId?.userId?.fullName || 'Không xác định'}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Trạng Thái:</span>
          <span className={`${styles.statusValue} ${isCancelled ? styles.cancelled : ''}`}>
            {getBookingStatusDisplay(booking?._originalBooking?.status)}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Thanh Toán:</span>
          <span className={`${styles.paymentValue} ${booking?._originalBooking?.paymentStatus === paymentStatusCodes.REFUND ? styles.refunded : ''
            }`}>
            {getPaymentStatusDisplay(booking?._originalBooking?.paymentStatus)}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Số Tiền:</span>
          <span className={styles.infoValue}>
            {booking?._originalBooking?.basePrice
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking._originalBooking.basePrice)
              : 'N/A'}
          </span>
        </div>
      </div>

      {!isCancelled && (
        <div className={styles.warningMessage}>
          <p>⚠️ Chỉ có thể hoàn tiền cho booking có trạng thái "Đã hủy"</p>
        </div>
      )}

      {isCancelled && isNotRefunded && (
        <div className={styles.confirmationMessage}>
          <p>Bạn có chắc chắn muốn hoàn tiền cho booking này?</p>
          <ul>
            <li>Số tiền hoàn: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking._originalBooking.basePrice)}</li>
            <li>Phương thức thanh toán: {booking?._originalBooking?.paymentMethod || 'Chưa xác định'}</li>
          </ul>
        </div>
      )}

      {isCancelled && !isNotRefunded && (
        <div className={styles.successMessage}>
          <p>✅ Booking này đã được hoàn tiền vào ngày {new Date(booking?._originalBooking?.updatedAt).toLocaleDateString()}</p>
        </div>
      )}
    </Modal>
  );
};

export default UpdateBookingStatus;
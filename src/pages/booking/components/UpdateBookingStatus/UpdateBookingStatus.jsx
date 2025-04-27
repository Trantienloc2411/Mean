import React, { useEffect, useState } from 'react';
import { Modal, Button, message, Spin } from 'antd';
import { CreditCardOutlined, DollarOutlined, BankOutlined, WalletOutlined } from '@ant-design/icons';
import styles from './UpdateBookingStatus.module.scss';
import { useCreateNotificationMutation } from '../../../../redux/services/notificationApi';
import { useCreateTransactionMutation } from '../../../../redux/services/transactionApi';
import { useGetCustomerByIdQuery } from '../../../../redux/services/customerApi';
import momoIcon from '../../../../../src/assets/momo.png';

const UpdateBookingStatus = ({
  booking,
  visible,
  onClose,
  bookingStatusCodes,
  paymentStatusCodes,
  paymentMethodCodes,
  onStatusChange,
  isLoading
}) => {
  const [createNotification] = useCreateNotificationMutation();
  const [createTransaction] = useCreateTransactionMutation();
  const [customerPaymentInfo, setCustomerPaymentInfo] = useState(null);

  const customerId = booking?._originalBooking?.customerId?._id;

  const {
    data: customerData,
    isLoading: isLoadingCustomer,
    error: customerError
  } = useGetCustomerByIdQuery(customerId, {
    skip: !customerId
  });

  useEffect(() => {
    if (customerData?.paymentInformationId) {
      setCustomerPaymentInfo(customerData.paymentInformationId);
    }
  }, [customerData]);

  const getPaymentMethodDisplay = (methodCode) => {
    const methodMap = {
      [paymentMethodCodes.MOMO]: "MoMo",
    };
    return methodMap[methodCode] || "Không xác định";
  };

  const getPaymentIcon = (method) => {
    if (method === paymentMethodCodes.MOMO) {
      return <img src={momoIcon} alt="MoMo" style={{ width: '16px', height: '16px', marginRight: '8px' }} />;
    } else if (typeof method === 'string') {
      const methodStr = method.toLowerCase();
      if (methodStr.includes("visa") || methodStr.includes("card")) {
        return <CreditCardOutlined style={{ marginRight: '8px' }} />;
      } else if (methodStr.includes("cash")) {
        return <DollarOutlined style={{ marginRight: '8px' }} />;
      } else if (methodStr.includes("bank") || methodStr.includes("transfer")) {
        return <BankOutlined style={{ marginRight: '8px' }} />;
      } else {
        return <WalletOutlined style={{ marginRight: '8px' }} />;
      }
    } else {
      return <WalletOutlined style={{ marginRight: '8px' }} />;
    }
  };

  const getBookingStatusDisplay = (statusCode) => {
    const statusMap = {
      [bookingStatusCodes.CONFIRMED]: "Đã xác nhận",
      [bookingStatusCodes.PENDING]: "Đang chờ",
      [bookingStatusCodes.NEEDCHECKIN]: "Cần check-in",
      [bookingStatusCodes.CHECKEDIN]: "Đã check-in",
      [bookingStatusCodes.NEEDCHECKOUT]: "Cần check-out",
      [bookingStatusCodes.CHECKEDOUT]: "Đã check-out",
      [bookingStatusCodes.CANCELLED]: "Đã hủy",
      [bookingStatusCodes.COMPLETED]: "Hoàn thành",
      [bookingStatusCodes.REFUND]: "Đã hoàn tiền"
    };
    return statusMap[statusCode] || "Không xác định";
  };

  const getPaymentStatusDisplay = (statusCode) => {
    const statusMap = {
      [paymentStatusCodes.BOOKING]: "Đặt cọc",
      [paymentStatusCodes.PENDING]: "Đang chờ",
      [paymentStatusCodes.PAID]: "Đã thanh toán",
      [paymentStatusCodes.REFUND]: "Đã hoàn tiền",
      [paymentStatusCodes.FAILED]: "Thất bại",
    };
    return statusMap[statusCode] || "Chưa thanh toán";
  };

  const isCancelled = booking?._originalBooking?.status === bookingStatusCodes.CANCELLED;
  const isPaymentRefund = booking?._originalBooking?.paymentStatus === paymentStatusCodes.REFUND;

  const handleRefund = async () => {
    try {
      await onStatusChange({
        id: booking._originalBooking._id,
        status: bookingStatusCodes.REFUND
      });

      const transactionData = {
        bookingId: booking._originalBooking._id,
        paymentCode: `PAY${Date.now().toString().substring(0, 7)}`,
        transactionEndDate: new Date().toISOString(),
        transactionStatus: true,
        description: `Payment refund for booking ID ${booking._originalBooking._id}`,
        type: 1,
        amount: booking._originalBooking.totalPrice,
      };

      await createTransaction(transactionData).unwrap();
      const notificationData = {
        userId: booking._originalBooking.customerId.userId._id,
        bookingId: booking._originalBooking._id,
        title: "Hoàn tiền thành công",
        content: `Đơn đặt phòng ${booking._originalBooking._id} đã được hoàn tiền thành công. Số tiền ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking._originalBooking.basePrice)} đã được chuyển về tài khoản của bạn.`,
        isRead: false,
        type: 1
      };

      await createNotification(notificationData).unwrap();

      message.success("Cập nhật trạng thái hoàn tiền thành công");
      onClose();
    } catch (error) {
      message.error(error?.message || "Thao tác thất bại");
      console.error('Lỗi khi hoàn tiền:', error);
    }
  };

  return (
    <Modal
      title="Xử Lý Hoàn Tiền"
      open={visible}
      onCancel={onClose}
      className={styles.modalContainer}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Đóng
        </Button>,
        isCancelled && isPaymentRefund && (
          <Button
            key="submit"
            loading={isLoading}
            onClick={handleRefund}
            className={`ant-btn refundButton ${styles.refundButton}`} 
          >
            Xác Nhận Hoàn Tiền
          </Button>
        )
      ]}
      width={600}
    >
      <div className={styles.bookingInfoSection}>
        <h3>Thông Tin Chi Tiết</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Mã Booking:</span>
            <span className={styles.infoValue}>{booking?._originalBooking?._id}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Khách hàng:</span>
            <span className={styles.infoValue}>
              {booking?._originalBooking?.customerId?.userId?.fullName}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Trạng thái booking:</span>
            <span className={`${styles.statusValue} ${styles[getBookingStatusDisplay(booking?._originalBooking?.status).toLowerCase()]}`}>
              {getBookingStatusDisplay(booking?._originalBooking?.status)}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Trạng thái thanh toán:</span>
            <span className={`${styles.paymentValue} ${styles[getPaymentStatusDisplay(booking?._originalBooking?.paymentStatus).toLowerCase()]}`}>
              {getPaymentStatusDisplay(booking?._originalBooking?.paymentStatus)}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Phương thức thanh toán:</span>
            <span className={styles.infoValue}>
              {getPaymentIcon(booking?._originalBooking?.paymentMethod)}
              {getPaymentMethodDisplay(booking?._originalBooking?.paymentMethod)}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Số tiền:</span>
            <span className={styles.infoValue}>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(booking._originalBooking?.totalPrice || 0)}
            </span>
          </div>
        </div>
      </div>

      {isCancelled && isPaymentRefund && (
        <div className={styles.refundSection}>
          <div className={styles.refundWarning}>
            <p>⚠️ Thao tác này sẽ chuyển trạng thái booking sang <strong>"Đã hoàn tiền"</strong></p>
            <ul className={styles.refundDetails}>
              <li>
                Phương thức hoàn tiền:
                <span className={styles.paymentMethodDisplay}>
                  {getPaymentIcon(booking?._originalBooking?.paymentMethod)}
                  {getPaymentMethodDisplay(booking?._originalBooking?.paymentMethod)}
                </span>
              </li>
              <li>Thời gian dự kiến: 3-5 ngày làm việc</li>
            </ul>
          </div>

          <div className={styles.paymentInfoSection}>
            <h3>Thông Tin Tài Khoản Nhận Hoàn Tiền</h3>
            {isLoadingCustomer ? (
              <Spin tip="Đang tải thông tin..." />
            ) : customerError ? (
              <div className={styles.errorMessage}>Không thể tải thông tin tài khoản</div>
            ) : !customerPaymentInfo ? (
              <div className={styles.noPaymentInfo}>Khách hàng chưa cung cấp thông tin tài khoản</div>
            ) : (
              <div className={styles.paymentInfoGrid}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Tên ngân hàng:</span>
                  <span className={styles.infoValue}>{customerPaymentInfo.bankName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Số tài khoản:</span>
                  <span className={styles.infoValue}>{customerPaymentInfo.bankNo}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Tên chủ tài khoản:</span>
                  <span className={styles.infoValue}>{customerPaymentInfo.bankAccountName}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isCancelled && !isPaymentRefund && (
        <div className={styles.alertMessage}>
          <p>❗ Không thể hoàn tiền. Đơn hàng cần có trạng thái thanh toán là "Đã hoàn tiền" trước khi thực hiện.</p>
        </div>
      )}
    </Modal>
  );
};

export default UpdateBookingStatus;
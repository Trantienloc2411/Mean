import React, { useEffect, useState } from 'react';
import { Modal, Button, message, Spin, Tag, Divider, Timeline, Card, Typography } from 'antd';
import { CreditCardOutlined, DollarOutlined, BankOutlined, WalletOutlined, ClockCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import styles from './UpdateBookingStatus.module.scss';
import { useCreateNotificationMutation } from '../../../../redux/services/notificationApi';
import { useCreateTransactionMutation } from '../../../../redux/services/transactionApi';
import { useGetCustomerByIdQuery } from '../../../../redux/services/customerApi';
import momoIcon from '../../../../../src/assets/momo.png';

const { Text, Title } = Typography;

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
      [bookingStatusCodes.PENDING]: "Chờ xác nhận",
      [bookingStatusCodes.NEEDCHECKIN]: "Cần check-in",
      [bookingStatusCodes.CHECKEDIN]: "Đã check-in",
      [bookingStatusCodes.NEEDCHECKOUT]: "Cần check-out",
      [bookingStatusCodes.CHECKEDOUT]: "Đã check-out",
      [bookingStatusCodes.CANCELLED]: "Đã huỷ",
      [bookingStatusCodes.COMPLETED]: "Hoàn tất",
      [bookingStatusCodes.REFUND]: "Đã hoàn tiền",
    }
    return statusMap[statusCode] || "Trạng thái không xác định"
  }

  const getPaymentStatusDisplay = (statusCode) => {
    const statusMap = {
      [paymentStatusCodes.BOOKING]: "Đã đặt",
      [paymentStatusCodes.PENDING]: "Chờ thanh toán",
      [paymentStatusCodes.PAID]: "Đã thanh toán",
      [paymentStatusCodes.REFUND]: "Yêu cầu hoàn tiền",
      [paymentStatusCodes.FAILED]: "Thanh toán thất bại",
    }
    return statusMap[statusCode] || "Chưa thanh toán"
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const calculateRefundDeadline = () => {
    if (!booking?._originalBooking?.timeExpireRefund) return "N/A";
    return formatDate(booking._originalBooking.timeExpireRefund);
  };

  const isCancelled = booking?._originalBooking?.status === bookingStatusCodes.CANCELLED;
  const isPaymentRefund = booking?._originalBooking?.paymentStatus === paymentStatusCodes.REFUND;
  const refundDeadline = calculateRefundDeadline();

  const handleRefund = async () => {
    try {
      await onStatusChange({
        id: booking._originalBooking._id,
        status: bookingStatusCodes.REFUND
      });

      const transactionData = {
        bookingId: booking._originalBooking._id,
        paymentCode: `REFUND${Date.now().toString().substring(0, 13)}`,
        transactionEndDate: new Date().toISOString(),
        transactionStatus: 2, 
        description: `Hoàn tiền cho đơn đặt phòng ${booking._originalBooking._id}`,
        typeTransaction: 1, 
        amount: booking._originalBooking.totalPrice,
      };

      await createTransaction(transactionData).unwrap();
      const notificationData = {
        userId: booking._originalBooking.customerId.userId._id,
        bookingId: booking._originalBooking._id,
        title: "Xác nhận hoàn tiền thành công",
        content: `Đơn đặt phòng ${booking._originalBooking._id} đã được hoàn tiền thành công. Số tiền ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking._originalBooking.totalPrice)} đã được chuyển về tài khoản của bạn.`,
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

  const renderStatusTag = (status) => {
    const statusColorMap = {
      [bookingStatusCodes.CONFIRMED]: "blue",
      [bookingStatusCodes.PENDING]: "orange",
      [bookingStatusCodes.NEEDCHECKIN]: "cyan",
      [bookingStatusCodes.CHECKEDIN]: "green",
      [bookingStatusCodes.NEEDCHECKOUT]: "purple",
      [bookingStatusCodes.CHECKEDOUT]: "geekblue",
      [bookingStatusCodes.CANCELLED]: "red",
      [bookingStatusCodes.COMPLETED]: "success",
      [bookingStatusCodes.REFUND]: "volcano"
    };
    
    return (
      <Tag color={statusColorMap[status] || "default"}>
        {getBookingStatusDisplay(status)}
      </Tag>
    );
  };

  const renderPaymentStatusTag = (status) => {
    const statusColorMap = {
      [paymentStatusCodes.BOOKING]: "blue",
      [paymentStatusCodes.PENDING]: "orange",
      [paymentStatusCodes.PAID]: "green",
      [paymentStatusCodes.REFUND]: "volcano",
      [paymentStatusCodes.FAILED]: "red",
    };
    
    return (
      <Tag color={statusColorMap[status] || "default"}>
        {getPaymentStatusDisplay(status)}
      </Tag>
    );
  };

  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          <ExclamationCircleFilled className={styles.refundIcon} />
          <span>Xử Lý Hoàn Tiền</span>
        </div>
      }
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
            type="primary"
            loading={isLoading}
            onClick={handleRefund}
            className={`ant-btn refundButton ${styles.refundButton}`}
            danger
          >
            Xác Nhận Hoàn Tiền
          </Button>
        )
      ]}
      width={700}
    >
      <div className={styles.bookingInfoSection}>
        <div className={styles.sectionHeader}>
          <Title level={4}>Thông Tin Đơn Đặt Phòng</Title>
        </div>

        <Card className={styles.bookingCard}>
          <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Mã đơn:</span>
              <span className={styles.infoValue}>{booking?._originalBooking?._id}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Khách hàng:</span>
              <span className={styles.infoValue}>
                {booking?._originalBooking?.customerId?.userId?.fullName}
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Phòng:</span>
              <span className={styles.infoValue}>
                {booking?._originalBooking?.accommodationId?.accommodationTypeId?.name} - 
                {booking?._originalBooking?.accommodationId?.roomNo}
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Thời gian:</span>
              <span className={styles.infoValue}>
                Check-in: {formatDate(booking?._originalBooking?.checkInHour)}<br />
                Check-out: {formatDate(booking?._originalBooking?.checkOutHour)}
              </span>
            </div>

            <div className={styles.statusRow}>
              <div className={styles.statusGroup}>
                <span className={styles.infoLabel}>Trạng thái đặt phòng:</span>
                {renderStatusTag(booking?._originalBooking?.status)}
              </div>

              <div className={styles.statusGroup}>
                <span className={styles.infoLabel}>Trạng thái thanh toán:</span>
                {renderPaymentStatusTag(booking?._originalBooking?.paymentStatus)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Divider />

      <div className={styles.paymentSection}>
        <div className={styles.sectionHeader}>
          <Title level={4}>Chi Tiết Thanh Toán</Title>
        </div>

        <Card className={styles.paymentCard}>
          <div className={styles.paymentDetails}>
            <div className={styles.paymentMethod}>
              <div className={styles.methodInfo}>
                <span className={styles.infoLabel}>Phương thức thanh toán:</span>
                <span className={styles.methodValue}>
                  {getPaymentIcon(booking?._originalBooking?.paymentMethod)}
                  {getPaymentMethodDisplay(booking?._originalBooking?.paymentMethod)}
                </span>
              </div>
            </div>

            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span>Giá cơ bản:</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking?._originalBooking?.basePrice || 0)}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Thời gian sử dụng:</span>
                <span>{booking?._originalBooking?.durationBookingHour || 0} giờ</span>
              </div>
              <Divider className={styles.priceDivider} />
              <div className={styles.totalPrice}>
                <span>Tổng tiền cần hoàn:</span>
                <span className={styles.totalAmount}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking?._originalBooking?.totalPrice || 0)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {isCancelled && isPaymentRefund && (
        <>
          <Divider />
          <div className={styles.refundSection}>
            <div className={styles.sectionHeader}>
              <Title level={4}>Thông Tin Hoàn Tiền</Title>
            </div>

            <Card className={styles.refundCard}>
              <Timeline
                className={styles.refundTimeline}
                items={[
                  {
                    color: 'green',
                    children: (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineTitle}>Đơn đã hủy</div>
                        <div className={styles.timelineDesc}>Đơn đặt phòng đã được hủy và yêu cầu hoàn tiền</div>
                      </div>
                    ),
                  },
                  {
                    color: 'orange',
                    children: (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineTitle}>Phương thức hoàn tiền</div>
                        <div className={styles.timelineDesc}>
                          {getPaymentIcon(booking?._originalBooking?.paymentMethod)}
                          {getPaymentMethodDisplay(booking?._originalBooking?.paymentMethod)}
                        </div>
                      </div>
                    ),
                  },
                ]}
              />

              <div className={styles.refundWarning}>
                <Text type="warning">⚠️ Thời gian dự kiến hoàn tiền: 3-5 ngày làm việc</Text>
              </div>
            </Card>
          </div>

          <Divider />

          <div className={styles.paymentInfoSection}>
            <div className={styles.sectionHeader}>
              <Title level={4}>Thông Tin Tài Khoản Nhận Hoàn Tiền</Title>
            </div>

            <Card className={styles.accountCard}>
              {isLoadingCustomer ? (
                <Spin tip="Đang tải thông tin..." />
              ) : customerError ? (
                <div className={styles.errorMessage}>Không thể tải thông tin tài khoản</div>
              ) : !customerPaymentInfo ? (
                <div className={styles.noPaymentInfo}>
                  <ExclamationCircleFilled className={styles.warningIcon} />
                  <Text type="warning">Khách hàng chưa cung cấp thông tin tài khoản</Text>
                </div>
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
            </Card>
          </div>
        </>
      )}

      {isCancelled && !isPaymentRefund && (
        <div className={styles.alertMessage}>
          <ExclamationCircleFilled className={styles.alertIcon} />
          <Text type="danger">Không thể hoàn tiền. Đơn hàng cần có trạng thái thanh toán là "Yêu cầu hoàn tiền" trước khi thực hiện.</Text>
        </div>
      )}
    </Modal>
  );
};

export default UpdateBookingStatus;
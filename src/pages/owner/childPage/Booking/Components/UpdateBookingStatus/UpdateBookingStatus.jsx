import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, message, Input, Divider, Card, Typography, Tag } from 'antd';
import { CreditCardOutlined, DollarOutlined, BankOutlined, WalletOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import styles from './UpdateBookingStatus.module.scss';
import momoIcon from "../../../../../../../src/assets/momo.png" 
import { useCreateNotificationMutation } from '../../../../../../../src/redux/services/notificationApi';

const { TextArea } = Input;
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
  const [status, setStatus] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [createNotification] = useCreateNotificationMutation();

  const getBookingStatusDisplay = (statusCode) => {
    console.log('Status code received:', statusCode);
    const statusMap = {
      [bookingStatusCodes.CONFIRMED]: "Xác nhận",
      [bookingStatusCodes.PENDING]: "Đang chờ",
      [bookingStatusCodes.NEEDCHECKIN]: "Cần check-in",
      [bookingStatusCodes.CHECKEDIN]: "Đã check-in",
      [bookingStatusCodes.NEEDCHECKOUT]: "Cần check-out",
      [bookingStatusCodes.CHECKEDOUT]: "Đã check-out",
      [bookingStatusCodes.CANCELLED]: "Hủy",
      [bookingStatusCodes.COMPLETED]: "Hoàn thành",
      [bookingStatusCodes.REFUND]: "Đã hoàn tiền" 
    };
    console.log('Status map:', statusMap);
    console.log('Mapped status:', statusMap[statusCode]);
    return statusMap[statusCode] || "Không xác định";
  };

  const getPaymentStatusDisplay = (statusCode) => {
    const statusMap = {
      [paymentStatusCodes.BOOKING]: "Đã đặt",
      [paymentStatusCodes.PENDING]: "Chờ thanh toán",
      [paymentStatusCodes.PAID]: "Đã thanh toán",
      [paymentStatusCodes.REFUND]: "Yêu cầu hoàn tiền",
      [paymentStatusCodes.FAILED]: "Thanh toán thất bại",
    }
    return statusMap[statusCode] || "Chưa thanh toán"
  };

  const getPaymentMethodDisplay = (methodCode) => {
    const methodMap = {
      [paymentMethodCodes.MOMO]: "MoMo",
    };
    return methodMap[methodCode] || "Không xác định";
  };

  const getPaymentIcon = (method) => {
    if (method === paymentMethodCodes.MOMO) {
      return <img src={momoIcon} alt="MoMo" style={{ width: '16px', height: '16px', marginRight: '8px' }} />;
    } else {
      return <WalletOutlined style={{ marginRight: '8px' }} />;
    }
  };

  const getAvailableNextStatuses = (currentStatus) => {
    const statusFlow = {
      [bookingStatusCodes.PENDING]: [bookingStatusCodes.CONFIRMED, bookingStatusCodes.CANCELLED],
      [bookingStatusCodes.CONFIRMED]: [bookingStatusCodes.CANCELLED],
    };
    
    return [currentStatus, ...(statusFlow[currentStatus] || [])];
  };

  useEffect(() => {
    if (booking) {
      const currentStatusCode = booking._originalBooking.status;
      setStatus(currentStatusCode);
      setCancelReason(''); 
    }
  }, [booking]);

  const handleStatusChange = (value) => {
    setStatus(value);
    if (value !== bookingStatusCodes.CANCELLED) {
      setCancelReason('');
    }
  };

  const handleCancelReasonChange = (e) => {
    setCancelReason(e.target.value);
  };

  const handleSubmit = async () => {
    if (status === bookingStatusCodes.CANCELLED && !cancelReason.trim()) {
      message.error('Vui lòng nhập lý do hủy đặt phòng');
      return;
    }
    try {
      const payload = {
        status: status
      };
      
      if (status === bookingStatusCodes.CANCELLED) {
        payload.note = cancelReason;
      }

      await onStatusChange(
        booking._originalBooking._id,
        payload
      );

      if (status === bookingStatusCodes.CONFIRMED) {
        try {
          await createNotification({
            userId: booking._originalBooking.customerId.userId._id,
            title: "Đặt phòng đã được xác nhận",
            content: `Đơn đặt phòng ${booking._originalBooking.accommodationId.accommodationTypeId.name} - ${booking._originalBooking.accommodationId.roomNo} của bạn đã được xác nhận. Vui lòng kiểm tra thông tin và chuẩn bị cho chuyến đi của bạn.`,
            type: 1,
            bookingId: booking._originalBooking._id,
            isRead: false
          });
          message.success('Đã cập nhật trạng thái và gửi thông báo thành công');
        } catch (error) {
          console.error("Error creating notification:", error);
          message.warning('Cập nhật trạng thái thành công nhưng không thể gửi thông báo');
        }
      } else {
        message.success('Đã cập nhật trạng thái thành công');
      }

      onClose();
    } catch (error) {
      message.error(error?.data?.message || 'Cập nhật thất bại');
    }
  };

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

  const currentStatus = booking?._originalBooking?.status;
  const availableStatuses = currentStatus ? getAvailableNextStatuses(currentStatus) : [];

  const statusOptions = Object.entries(bookingStatusCodes)
    .filter(([_, value]) => availableStatuses.includes(value) && value !== currentStatus)
    .map(([key, value]) => ({
      label: getBookingStatusDisplay(value),
      value: value,
    }));

  const currentStatusDisplay = getBookingStatusDisplay(booking?._originalBooking?.status);
  const isCancelSelected = status === bookingStatusCodes.CANCELLED;
  
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
          <span>Cập Nhật Trạng Thái Booking</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      className={styles.modalContainer}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
          className={isCancelSelected ? `${styles.refundButton}` : ''}
          danger={isCancelSelected}
        >
          Cập Nhật
        </Button>,
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
                {booking?._originalBooking?.customerId?.userId?.fullName || 'Không xác định'}
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
                <span>Tổng tiền:</span>
                <span className={styles.totalAmount}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking?._originalBooking?.totalPrice || 0)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Divider />

      <div className={styles.statusUpdateSection}>
        <div className={styles.sectionHeader}>
          <Title level={4}>Cập Nhật Trạng Thái</Title>
        </div>

        <Card className={styles.statusCard}>
          <div className={styles.statusSelectContainer}>
            <div className={styles.infoLabel}>Trạng thái hiện tại:</div>
            <div style={{ marginTop: 8, marginBottom: 16 }}>
              {booking?._originalBooking?.status && (
                <Text>{getBookingStatusDisplay(booking._originalBooking.status)}</Text>
              )}
            </div>
            <div className={styles.infoLabel}>Chọn Trạng Thái Mới:</div>
            <Select
              style={{ width: '100%', marginTop: 8, marginBottom: 16 }}
              placeholder="Chọn trạng thái mới"
              value={getBookingStatusDisplay(status)}
              onChange={handleStatusChange}
              options={statusOptions}
            />
          </div>

          {isCancelSelected && (
            <div className={styles.cancelReasonContainer}>
              <div className={styles.infoLabel}>Lý Do Hủy Đặt Phòng:</div>
              <TextArea
                rows={4}
                placeholder="Nhập lý do hủy đặt phòng"
                value={cancelReason}
                onChange={handleCancelReasonChange}
                style={{ marginTop: 8 }}
                className={styles.cancelTextarea}
              />
              <div className={styles.refundWarning}>
                <Text type="warning">⚠️ Lưu ý: Việc hủy đơn có thể dẫn đến yêu cầu hoàn tiền từ khách hàng</Text>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Modal>
  );
};

export default UpdateBookingStatus;
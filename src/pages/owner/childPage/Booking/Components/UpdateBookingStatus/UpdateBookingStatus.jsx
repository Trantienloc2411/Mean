import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, message, Input } from 'antd';

const { TextArea } = Input;

const UpdateBookingStatus = ({ 
  booking, 
  visible, 
  onClose, 
  bookingStatusCodes,
  onStatusChange,
  isLoading 
}) => {
  const [status, setStatus] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

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
      await onStatusChange(
        booking._originalBooking._id, 
        getBookingStatusDisplay(status),
        cancelReason 
      );
      message.success('Đã cập nhật trạng thái thành công');
      onClose();
    } catch (error) {
      message.error(error?.data?.message || 'Cập nhật thất bại');
    }
  };

  const currentStatus = booking?._originalBooking?.status;
  
  const availableStatuses = currentStatus ? getAvailableNextStatuses(currentStatus) : [];

  const statusOptions = Object.entries(bookingStatusCodes)
    .filter(([_, value]) => availableStatuses.includes(value))
    .map(([key, value]) => ({
      label: getBookingStatusDisplay(value),
      value: value,
    }));

  const currentStatusDisplay = getBookingStatusDisplay(booking?._originalBooking?.status);
  const isCancelSelected = status === bookingStatusCodes.CANCELLED;

  return (
    <Modal
      title="Cập Nhật Trạng Thái Booking"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
        >
          Cập Nhật
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <h4>Trạng Thái Hiện Tại: {currentStatusDisplay}</h4>
        <p>Mã Booking: {booking?._originalBooking?._id}</p>
        <p>Khách Hàng: {booking?._originalBooking?.customerId?.userId?.fullName || 'Không xác định'}</p>
      </div>

      <div>
        <label>Chọn Trạng Thái Mới:</label>
        <Select
          style={{ width: '100%', marginTop: 8, marginBottom: 16 }}
          placeholder="Chọn trạng thái mới"
          value={status}
          onChange={handleStatusChange}
          options={statusOptions}
        />
      </div>

      {isCancelSelected && (
        <div style={{ marginTop: 16 }}>
          <label>Lý Do Hủy Đặt Phòng:</label>
          <TextArea
            rows={4}
            placeholder="Nhập lý do hủy đặt phòng"
            value={cancelReason}
            onChange={handleCancelReasonChange}
            style={{ marginTop: 8 }}
          />
        </div>
      )}
    </Modal>
  );
};

export default UpdateBookingStatus;
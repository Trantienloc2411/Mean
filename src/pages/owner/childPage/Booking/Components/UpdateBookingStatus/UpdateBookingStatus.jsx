import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, message, Form, Input } from 'antd';

const UpdateBookingStatus = ({ 
  booking, 
  visible, 
  onClose, 
  bookingStatusCodes,
  onStatusChange,
  onGeneratePassword,
  isLoading 
}) => {
  const [status, setStatus] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);

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

  useEffect(() => {
    if (booking) {
      const currentStatusCode = booking._originalBooking.status;
      setStatus(currentStatusCode);
      setPasswordInput('');
      setShowPasswordField(currentStatusCode === bookingStatusCodes.CONFIRMED);
    }
  }, [booking, bookingStatusCodes.CONFIRMED]);

  useEffect(() => {
    setShowPasswordField(status === bookingStatusCodes.CONFIRMED);
  }, [status, bookingStatusCodes.CONFIRMED]);

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!status) {
      message.error('Vui lòng chọn trạng thái');
      return;
    }

    try {
      await onStatusChange(getBookingStatusDisplay(status));
      
      if (status === bookingStatusCodes.CONFIRMED && passwordInput.trim()) {
        await onGeneratePassword({
          bookingId: booking._originalBooking._id,
          passwordRoomInput: passwordInput
        });
        message.success('Đã cập nhật trạng thái và mật khẩu phòng thành công');
      } else {
        message.success('Đã cập nhật trạng thái thành công');
      }
      onClose();
    } catch (error) {
      message.error(error?.data?.message || 'Cập nhật thất bại');
    }
  };

  const statusOptions = Object.entries(bookingStatusCodes).map(([key, value]) => ({
    label: getBookingStatusDisplay(value),
    value: value,
  }));

  const currentStatusDisplay = getBookingStatusDisplay(booking?._originalBooking?.status);

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

      {showPasswordField && (
        <div style={{ marginTop: 16 }}>
          <Form.Item
            label="Mật Khẩu Phòng"
            help="Nhập mật khẩu phòng (bắt buộc khi xác nhận booking)"
          >
            <Input.Password
              placeholder="Nhập mật khẩu phòng"
              value={passwordInput}
              onChange={handlePasswordChange}
              maxLength={20}
              required={status === bookingStatusCodes.CONFIRMED}
            />
          </Form.Item>
        </div>
      )}
    </Modal>
  );
};

export default UpdateBookingStatus;
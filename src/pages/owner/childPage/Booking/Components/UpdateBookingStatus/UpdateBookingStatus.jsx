import React, { useState } from 'react';
import { Modal, Select, Button, message } from 'antd';
import { useUpdateBookingMutation } from '../../../../../../redux/services/bookingApi';

const UpdateBookingStatus = ({ booking, visible, onClose, bookingStatusCodes }) => {
  const [status, setStatus] = useState(
    booking?.Status ? getStatusCodeFromDisplay(booking.Status, bookingStatusCodes) : null
  );
  const [updateBooking, { isLoading }] = useUpdateBookingMutation();

  function getStatusCodeFromDisplay(displayStatus, statusCodes) {
    for (const [key, value] of Object.entries(statusCodes)) {
      if (getBookingStatusDisplay(value) === displayStatus) {
        return value;
      }
    }
    return null;
  }

  function getBookingStatusDisplay(statusCode) {
    switch (statusCode) {
      case bookingStatusCodes.CONFIRMED:
        return "Confirmed";
      case bookingStatusCodes.NEEDCHECKIN:
        return "Pending Check-in";
      case bookingStatusCodes.CHECKEDIN:
        return "Checked In";
      case bookingStatusCodes.NEEDCHECKOUT:
        return "Pending Check-out";
      case bookingStatusCodes.CHECKEDOUT:
        return "Checked Out";
      case bookingStatusCodes.CANCELLED:
        return "Canceled";
      case bookingStatusCodes.COMPLETED:
        return "Complete";
      default:
        return "Pending";
    }
  }

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleSubmit = async () => {
    if (!status) {
      message.error('Please select a status');
      return;
    }

    try {
      await updateBooking({
        id: booking._originalBooking._id,
        status: status
      }).unwrap();

      message.success('Booking status updated successfully');
      onClose();
    } catch (error) {
      message.error(error?.data?.message || 'Failed to update booking status');
    }
  };

  const statusOptions = Object.entries(bookingStatusCodes).map(([key, value]) => ({
    label: getBookingStatusDisplay(value),
    value: value,
  }));

  return (
    <Modal
      title="Update Booking Status"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
        >
          Update Status
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <h4>Current Status: {booking?.Status}</h4>
        <p>Booking ID: {booking?.No}</p>
        <p>Customer: {booking?.["Customer Name"]}</p>
      </div>

      <div>
        <label>Select New Status:</label>
        <Select
          style={{ width: '100%', marginTop: 8 }}
          placeholder="Select new status"
          value={status}
          onChange={handleStatusChange}
          options={statusOptions}
        />
      </div>
    </Modal>
  );
};

export default UpdateBookingStatus;
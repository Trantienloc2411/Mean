import styles from "./ListBooking.module.scss";
import { Dropdown, Tag, Input, Button, Menu, message } from "antd";
import TableModify from "../../../../../dashboard/components/Table";
import { FilterOutlined, MoreOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import Filter from "../../../../../../components/Filter/Filter";
import UpdateBookingStatus from "../UpdateBookingStatus/UpdateBookingStatus";

export default function ListBooking({ 
  bookings, 
  bookingStatusCodes, 
  paymentStatusCodes,
  onStatusChange,
  onCancelBooking,
  onConfirmBooking,
  onCheckInBooking,
  onCheckOutBooking,
  isUpdating,
  isCancelling,
  isConfirming,
  isCheckingIn,
  isCheckingOut
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(bookings || []);
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    payment: [],
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    setFilteredData(bookings || []);
  }, [bookings]);

  useEffect(() => {
    setActionInProgress(isUpdating || isCancelling || isConfirming || isCheckingIn || isCheckingOut);
  }, [isUpdating, isCancelling, isConfirming, isCheckingIn, isCheckingOut]);

  const statusOptions = [
    { label: <Tag color="blue">Confirmed</Tag>, value: "Confirmed" },
    { label: <Tag color="orange">Pending Check-in</Tag>, value: "Pending Check-in" },
    { label: <Tag color="purple">Checked In</Tag>, value: "Checked In" },
    { label: <Tag color="gold">Pending Check-out</Tag>, value: "Pending Check-out" },
    { label: <Tag color="cyan">Checked Out</Tag>, value: "Checked Out" },
    { label: <Tag color="red">Canceled</Tag>, value: "Canceled" },
    { label: <Tag color="green">Complete</Tag>, value: "Complete" },
  ];

  const paymentOptions = [
    { label: <Tag color="blue">Booking</Tag>, value: "Booking" },
    { label: <Tag color="orange">Pending</Tag>, value: "Pending" },
    { label: <Tag color="green">Fully Paid</Tag>, value: "Fully Paid" },
    { label: <Tag color="purple">Refunded</Tag>, value: "Refunded" },
    { label: <Tag color="red">Failed</Tag>, value: "Failed" },
    { label: <Tag color="default">Unpaid</Tag>, value: "Unpaid" },
  ];

  const filterGroups = [
    {
      name: "status",
      title: "Trạng thái",
      options: statusOptions,
    },
    {
      name: "payment",
      title: "Thanh toán",
      options: paymentOptions,
    },
  ];

  const applyFilters = (filters) => {
    let filtered = [...bookings];

    if (filters.status.length > 0) {
      filtered = filtered.filter((item) =>
        filters.status.includes(item.Status)
      );
    }

    if (filters.payment.length > 0) {
      filtered = filtered.filter((item) =>
        filters.payment.includes(item.Payment)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item["Customer Name"].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (filterName, newValues) => {
    const updatedFilters = {
      ...selectedValues,
      [filterName]: newValues,
    };
    
    setSelectedValues(updatedFilters);
    applyFilters(updatedFilters);
  };

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
    applyFilters({
      ...selectedValues,
      searchTerm: value,
    });
  }, 500);

  const handleSearch = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const handleViewDetails = (booking) => {
    console.log("View details:", booking);
  };

  const handleStatusUpdate = (booking) => {
    setSelectedBooking(booking);
    setStatusModalVisible(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalVisible(false);
    setSelectedBooking(null);
  };

  const handleCustomStatusChange = async (booking, newStatus) => {
    if (actionInProgress) {
      message.warning("Another action is in progress. Please wait.");
      return;
    }
    
    try {
      await onStatusChange(booking._originalBooking._id, newStatus);
      message.success("Booking status updated successfully");
    } catch (error) {
      message.error("Failed to update booking status");
    }
  };

  const handleCancel = async (booking) => {
    if (actionInProgress) {
      message.warning("Another action is in progress. Please wait.");
      return;
    }
    
    try {
      await onCancelBooking(booking._originalBooking._id);
      message.success("Booking canceled successfully");
    } catch (error) {
      message.error("Failed to cancel booking");
    }
  };

  const handleConfirm = async (booking) => {
    if (actionInProgress) {
      message.warning("Another action is in progress. Please wait.");
      return;
    }
    
    try {
      await onConfirmBooking(booking._originalBooking._id);
      message.success("Booking confirmed successfully");
    } catch (error) {
      message.error("Failed to confirm booking");
    }
  };

  const handleCheckIn = async (booking) => {
    if (actionInProgress) {
      message.warning("Another action is in progress. Please wait.");
      return;
    }
    
    try {
      await onCheckInBooking(booking._originalBooking._id);
      message.success("Check-in successful");
    } catch (error) {
      message.error("Failed to check in");
    }
  };

  const handleCheckOut = async (booking) => {
    if (actionInProgress) {
      message.warning("Another action is in progress. Please wait.");
      return;
    }
    
    try {
      await onCheckOutBooking(booking._originalBooking._id);
      message.success("Check-out successful");
    } catch (error) {
      message.error("Failed to check out");
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      "Confirmed": "confirmed",
      "Pending Check-in": "pending",
      "Checked In": "inprogress",
      "Pending Check-out": "pending",
      "Checked Out": "checkedout",
      "Canceled": "canceled",
      "Complete": "complete"
    };
    
    return statusMap[status] || "pending";
  };

  const getPaymentClass = (payment) => {
    const paymentMap = {
      "Booking": "deposited",
      "Pending": "pending",
      "Fully Paid": "fullypaid",
      "Refunded": "depositreturned",
      "Failed": "depositforfeited",
      "Unpaid": "unpaid"
    };
    
    return paymentMap[payment] || "unpaid";
  };

  const translateStatus = (status) => {
    const translations = {
      "Confirmed": "Đã xác nhận",
      "Pending Check-in": "Đợi nhận phòng",
      "Checked In": "Đã nhận phòng",
      "Pending Check-out": "Đợi trả phòng",
      "Checked Out": "Đã trả phòng",
      "Canceled": "Đã huỷ",
      "Complete": "Hoàn tất"
    };
    
    return translations[status] || status;
  };

  const translatePayment = (payment) => {
    const translations = {
      "Booking": "Đã đặt",
      "Pending": "Đang xử lý",
      "Fully Paid": "Thanh toán hoàn tất",
      "Refunded": "Đã hoàn tiền",
      "Failed": "Thanh toán thất bại",
      "Unpaid": "Chưa thanh toán"
    };
    
    return translations[payment] || payment;
  };

  const getActionMenuItems = (booking) => {
    const items = [
      {
        key: '1',
        label: 'Xem chi tiết',
        onClick: () => handleViewDetails(booking)
      }
    ];

    const status = booking.Status;
    const bookingId = booking._originalBooking._id;

    if (status === "Confirmed") {
      items.push({
        key: '2',
        label: 'Nhận phòng',
        onClick: () => handleCustomStatusChange(booking, bookingStatusCodes.NEEDCHECKIN)
      });
      items.push({
        key: '3',
        label: 'Huỷ đặt phòng',
        onClick: () => handleCancel(booking)
      });
    } else if (status === "Pending Check-in") {
      items.push({
        key: '2',
        label: 'Xác nhận nhận phòng',
        onClick: () => handleCheckIn(booking)
      });
    } else if (status === "Checked In") {
      items.push({
        key: '2',
        label: 'Trả phòng',
        onClick: () => handleCustomStatusChange(booking, bookingStatusCodes.NEEDCHECKOUT)
      });
    } else if (status === "Pending Check-out") {
      items.push({
        key: '2',
        label: 'Xác nhận trả phòng',
        onClick: () => handleCheckOut(booking)
      });
    } else if (status === "Checked Out") {
      items.push({
        key: '2',
        label: 'Hoàn tất đặt phòng',
        onClick: () => handleCustomStatusChange(booking, bookingStatusCodes.COMPLETED)
      });
    }

    items.push({
      key: '9',
      label: 'Cập nhật trạng thái',
      onClick: () => handleStatusUpdate(booking)
    });

    return items;
  };

  const tableColumn = [
    {
      title: <span className="titleTable">No</span>,
      dataIndex: "No",
      key: "No",
    },
    {
      title: <span className="titleTable">Tên Khách Hàng</span>,
      dataIndex: "Customer Name",
      key: "customerName",
    },
    {
      title: <span className="titleTable">Tên Địa Điểm</span>,
      dataIndex: "Location",
      key: "Location",
    },
    {
      title: <span className="titleTable">Thời gian đặt</span>,
      dataIndex: "Booking Time",
      key: "bookingTime",
      sorter: (a, b) => {
        const dateA = new Date(a["Booking Time"]);
        const dateB = new Date(b["Booking Time"]);
        return dateA - dateB;
      },
    },
    {
      title: <span className="titleTable">Thời gian sử dụng</span>,
      dataIndex: "Usage Time",
      key: "usageTime",
      sorter: (a, b) => {
        const dateA = new Date(a["Usage Time"].split(" - ")[0]);
        const dateB = new Date(b["Usage Time"].split(" - ")[0]);
        return dateA - dateB;
      },
    },
    {
      title: <span className="titleTable">Tổng hoá đơn</span>,
      dataIndex: "Total Price",
      key: "totalPrice",
      sorter: (a, b) => a["Total Price"] - b["Total Price"],
      render: (value) => {
        return `${parseInt(value, 10).toLocaleString("en-US")} vnđ`;
      },
    },
    {
      title: <span className="titleTable">Trạng thái</span>,
      dataIndex: "Status",
      key: "status",
      align: "center",
      render: (Status) => {
        if (!Status) return null;
        
        const statusClass = getStatusClass(Status);
        
        return (
          <span className={`${styles.statusTag} ${styles[statusClass]}`}>
            {translateStatus(Status)}
          </span>
        );
      },
    },
    {
      title: <span className="titleTable">Thanh toán</span>,
      dataIndex: "Payment",
      key: "payment",
      align: "center",
      render: (Payment) => {
        const paymentClass = getPaymentClass(Payment);
        
        return (
          <span className={`${styles.paymentTag} ${styles[paymentClass]}`}>
            {translatePayment(Payment)}
          </span>
        );
      },
    },
    {
      title: <span className="titleTable">Action</span>,
      key: "operation",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu items={getActionMenuItems(record)} />
          }
          trigger={["click"]}
          disabled={actionInProgress}
        >
          <Button type="text" icon={<MoreOutlined />} loading={actionInProgress} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="content">
      <h2>Danh sách đặt phòng:</h2>
      <div className="list-booking">
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            flexDirection: "row",
            gap: "10px"
          }}
        >
          <Input
            placeholder="Tìm kiếm tên khách hàng"
            onChange={handleSearch}
            style={{ width: "250px" }}
          />

          <Dropdown
            overlay={
              <Filter
                filterGroups={filterGroups}
                selectedValues={selectedValues}
                onFilterChange={handleFilterChange}
              />
            }
            trigger={["click"]}
            placement="bottomRight"
            overlayStyle={{
              padding: "8px",
            }}
          >
            <Button icon={<FilterOutlined />}>
              Lọc
              {Object.values(selectedValues).flat().length > 0 &&
                ` (${Object.values(selectedValues).flat().length})`}
            </Button>
          </Dropdown>
        </div>

        <TableModify
          tableColumn={tableColumn}
          tableData={filteredData}
          isPagination={true}
          loading={actionInProgress}
        />
      </div>

      {selectedBooking && (
        <UpdateBookingStatus
          booking={selectedBooking}
          visible={statusModalVisible}
          onClose={handleCloseStatusModal}
          bookingStatusCodes={bookingStatusCodes}
          onStatusChange={(status) => handleCustomStatusChange(selectedBooking, status)}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}
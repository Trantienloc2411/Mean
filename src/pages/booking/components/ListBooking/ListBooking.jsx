import { useState, useEffect } from "react";
import { Dropdown, Input, Button, Menu, message, Spin } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { CreditCardOutlined, DollarOutlined, BankOutlined, WalletOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import TableModify from "../../../dashboard/components/Table";
import Filter from "../../../../components/Filter/Filter";
import UpdateBookingStatus from "../UpdateBookingStatus/UpdateBookingStatus";
import BookingDetail from "../BookingDetail/BookingDetail";
import styles from "./ListBooking.module.scss";
import { useGetBookingByIdQuery } from "../../../../redux/services/bookingApi";

const HorizontalEllipsisIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3" cy="8" r="1.5" fill="currentColor" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    <circle cx="13" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

export default function ListBooking({
  bookings,
  bookingStatusCodes,
  paymentStatusCodes,
  onStatusChange,
  isUpdating,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(bookings || []);
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    payment: [],
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isBookingDetailVisible, setIsBookingDetailVisible] = useState(false);

  const {
    data: bookingDetailData,
    isLoading: isDetailLoading,
    isError: isDetailError
  } = useGetBookingByIdQuery(selectedBookingId, {
    skip: !selectedBookingId,
  });

  useEffect(() => {
    setFilteredData(bookings || []);
  }, [bookings]);

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

  const statusOptions = Object.entries(bookingStatusCodes).map(([key, value]) => ({
    label: <span className={`${styles.statusTag} ${styles[key.toLowerCase()]}`}>
      {getBookingStatusDisplay(value, bookingStatusCodes)}
    </span>,
    value: getBookingStatusDisplay(value, bookingStatusCodes)
  }));

  const paymentOptions = Object.entries(paymentStatusCodes).map(([key, value]) => ({
    label: <span className={`${styles.paymentTag} ${styles[key.toLowerCase()]}`}>
      {getPaymentStatusDisplay(value)}
    </span>,
    value: getPaymentStatusDisplay(value)
  }));

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

    if (filters.bookingStatus && filters.bookingStatus.length > 0) {
      filtered = filtered.filter((item) =>
        filters.bookingStatus.includes(item.Status)
      );
    }

    if (filters.paymentStatus && filters.paymentStatus.length > 0) {
      filtered = filtered.filter((item) =>
        filters.paymentStatus.includes(item.Payment)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const customerName = item._originalBooking.customerId?.userId?.fullName || "";
        return customerName.toLowerCase().includes(searchTerm.toLowerCase());
      });
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

  const getStatusClass = (status) => {
    const statusMap = {
      "Confirmed": "confirmed",
      "Pending": "pending",
      "Need Check-in": "pending",
      "Checked In": "inprogress",
      "Need Check-out": "pending",
      "Checked Out": "checkedout",
      "Cancelled": "canceled",
      "Completed": "complete",
    };

    return statusMap[status] || "pending";
  };

  const getPaymentClass = (payment) => {
    const paymentMap = {
      "Booking": "confirmed",
      "Pending": "pending",
      "Paid": "complete",
      "Refund": "canceled",
      "Failed": "canceled",
      "Unpaid": "pending",
    };

    return paymentMap[payment] || "pending";
  };

  const getPaymentIcon = (method) => {
    // Đảm bảo method là string trước khi gọi toLowerCase()
    const methodStr = String(method || '').toLowerCase();

    if (methodStr.includes("visa") || methodStr.includes("card")) {
      return <CreditCardOutlined />;
    } else if (methodStr.includes("cash")) {
      return <DollarOutlined />;
    } else if (methodStr.includes("bank") || methodStr.includes("transfer")) {
      return <BankOutlined />;
    } else if (methodStr.includes("paypal")) {
      return <WalletOutlined />;
    } else {
      return <WalletOutlined />;
    }
  };

  const tableColumn = [
    {
      title: <span className={styles.tableHeader}>No.</span>,
      dataIndex: "no",
      key: "no",
      render: (_, record, index) => <span className={styles.bookingId}>{index + 1}</span>,
    },
    {
      title: <span className={styles.tableHeader}>Khách Hàng</span>,
      dataIndex: "customerName",
      key: "customerName",
      render: (_, record) => record._originalBooking.customerId?.userId?.fullName || "Không xác định",
    },
    {
      title: <span className={styles.tableHeader}>Loại Phòng</span>,
      dataIndex: "roomType",
      key: "roomType",
      render: (_, record) => record._originalBooking.accommodationId?.accommodationTypeId?.name || "Không xác định",
    },
    {
      title: <span className={styles.tableHeader}>Check-in / Check-out</span>,
      dataIndex: "bookingTime",
      key: "bookingTime",
      render: (_, record) => {
        const booking = record._originalBooking;
        return (
          <div className={styles.timeInfo}>
            {booking.checkInHour} - {booking.checkOutHour}
          </div>
        );
      },
    },
    {
      title: <span className={styles.tableHeader}>Số Người</span>,
      dataIndex: "peopleCount",
      key: "peopleCount",
      render: (_, record) => {
        const booking = record._originalBooking;
        return (
          <div className={styles.peopleInfo}>
            <span>NL: {booking.adultNumber}</span>
            <span>TE: {booking.childNumber}</span>
          </div>
        );
      },
    },
    {
      title: <span className={styles.tableHeader}>Thanh Toán</span>,
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (_, record) => {
        const booking = record._originalBooking;
        const paymentStatus = getPaymentStatusDisplay(booking.paymentStatus);
        const paymentMethod = booking.paymentMethod ? String(booking.paymentMethod) : "Chưa xác định";

        return (
          <div className={styles.paymentInfo}>
            <div className={styles.method}>
              <span className={styles.paymentMethodIcon}>{getPaymentIcon(paymentMethod)}</span>
              {paymentMethod}
            </div>
            <div>
              <span className={`${styles.paymentTag} ${styles[getPaymentClass(paymentStatus)]}`}>
                {paymentStatus}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: <span className={styles.tableHeader}>Trạng Thái</span>,
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        const statusCode = record._originalBooking.status;
        const statusText = getBookingStatusDisplay(statusCode, bookingStatusCodes);

        return <span className={`${styles.statusTag} ${styles[getStatusClass(statusText)]}`}>
          {statusText}
        </span>;
      },
    },
    {
      title: <span className={styles.tableHeader}>Thao Tác</span>,
      key: "operation",
      render: (_, record) => {
        const isCancelled = record._originalBooking.status === bookingStatusCodes.CANCELLED;
        const menuItems = [
          {
            key: "1",
            label: "Xem Chi Tiết",
            onClick: () => handleViewDetails(record),
          }
        ];

        if (record._originalBooking.status === bookingStatusCodes.CANCELLED &&
          record._originalBooking.paymentStatus !== paymentStatusCodes.REFUND) {
          menuItems.push({
            key: "2",
            label: "Hoàn Tiền",
            onClick: () => handleStatusUpdate(record),
          });
        }

        return (
          <Dropdown overlay={<Menu items={menuItems} />} trigger={["click"]}>
            <Button type="text" className={styles.actionButton}>
              <span className={styles.horizontalEllipsis}>⋯</span>
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const handleViewDetails = (booking) => {
    const bookingId = booking._originalBooking._id || booking._originalBooking.id;
    setSelectedBookingId(bookingId);
    setIsBookingDetailVisible(true);
  };

  const handleCloseBookingDetail = () => {
    setIsBookingDetailVisible(false);
    setSelectedBookingId(null);
  };

  const handleStatusUpdate = (booking) => {
    setSelectedBooking(booking);
    setStatusModalVisible(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalVisible(false);
    setSelectedBooking(null);
  };

  const handleCustomStatusChange = async (booking) => {
    try {
      if (booking._originalBooking.status !== bookingStatusCodes.CANCELLED) {
        message.warning("Chỉ có thể hoàn tiền cho booking đã hủy");
        return;
      }

      await onStatusChange(booking._originalBooking._id, {
        paymentStatus: paymentStatusCodes.REFUND
      });

      message.success("Hoàn tiền thành công");
      handleCloseStatusModal();
    } catch (error) {
      message.error(error?.message || "Hoàn tiền thất bại");
    }
  };

  return (
    <div className={styles.contentContainer}>
      <h2>Danh Sách Booking</h2>
      <div className={styles.listBooking}>
        <div className={styles.filterContainer}>
          <Input
            placeholder="Tìm kiếm tên khách hàng"
            onChange={handleSearch}
            className={styles.searchInput}
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
          />

          <Dropdown
            overlay={
              <Filter
                filterGroups={filterGroups}
                selectedValues={selectedValues}
                onFilterChange={handleFilterChange}
                bookingStatusCodes={bookingStatusCodes}
                paymentStatusCodes={paymentStatusCodes}
              />
            }
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button icon={<FilterOutlined />} className={styles.filterButton}>
              Lọc
              {Object.values(selectedValues).flat().length > 0 && (
                <span className={styles.filterBadge}>{Object.values(selectedValues).flat().length}</span>
              )}
            </Button>
          </Dropdown>
        </div>
        <div className={styles.tableContainer}>
          <TableModify
            tableColumn={tableColumn}
            tableData={filteredData}
            isPagination={true}
            loading={isUpdating}
          />
        </div>
      </div>

      {selectedBooking && (
        <UpdateBookingStatus
          booking={selectedBooking}
          visible={statusModalVisible}
          onClose={handleCloseStatusModal}
          bookingStatusCodes={bookingStatusCodes}
          paymentStatusCodes={paymentStatusCodes}
          onStatusChange={(status) => handleCustomStatusChange(selectedBooking, status)}
          isLoading={isUpdating}
        />
      )}

      <BookingDetail
        bookingId={selectedBookingId}
        visible={isBookingDetailVisible}
        onClose={handleCloseBookingDetail}
        bookingData={bookingDetailData}
        isLoading={isDetailLoading}
        isError={isDetailError}
      />
    </div>
  );
}
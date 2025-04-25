import { useState, useEffect } from "react";
import { Dropdown, Input, Button, Menu, message, Table } from "antd";
import { FilterOutlined, SearchOutlined, MoreOutlined, WalletOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import Filter from "../../../../../../components/Filter/Filter";
import UpdateBookingStatus from "../UpdateBookingStatus/UpdateBookingStatus";
import BookingDetail from "../BookingDetail/BookingDetail";
import styles from "./ListBooking.module.scss";
import { useGetBookingByIdQuery } from "../../../../../../redux/services/bookingApi";
import momoIcon from '../../../../../../../src/assets/momo.png';

export default function ListBooking({
  bookings = [],
  bookingStatusCodes = {},
  paymentStatusCodes = {},
  paymentMethodCodes = {},
  onStatusChange,
  isUpdating,
  onSelectBookingDetail,
  generatePassword,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(bookings);
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    payment: [],
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isBookingDetailVisible, setIsBookingDetailVisible] = useState(false);
  const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 7,
      total: bookings.length,
    });

  const {
    data: bookingDetailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetBookingByIdQuery(selectedBookingId, {
    skip: !selectedBookingId,
  });

  useEffect(() => {
    setFilteredData(bookings);
    setPagination(prev => ({
      ...prev,
      total: bookings.length,
    }));
  }, [bookings]);


  const getBookingStatusDisplay = (statusCode) => {
    const statusMap = {
      [bookingStatusCodes.CONFIRMED]: "Đã xác nhận",
      [bookingStatusCodes.PENDING]: "Chờ xác nhận",
      [bookingStatusCodes.NEEDCHECKIN]: "Cần check-in",
      [bookingStatusCodes.CHECKEDIN]: "Đã check-in",
      [bookingStatusCodes.NEEDCHECKOUT]: "Cần check-out",
      [bookingStatusCodes.CHECKEDOUT]: "Đã check-out",
      [bookingStatusCodes.CANCELLED]: "Đã hủy",
      [bookingStatusCodes.COMPLETED]: "Hoàn tất",
      [bookingStatusCodes.REFUND]: "Hoàn tiền"
    }
    return statusMap[statusCode] || "Trạng thái không xác định"
  }

  const getPaymentStatusDisplay = (statusCode) => {
    const statusMap = {
      [paymentStatusCodes.BOOKING]: "Đã đặt",
      [paymentStatusCodes.PENDING]: "Chờ thanh toán",
      [paymentStatusCodes.PAID]: "Đã thanh toán",
      [paymentStatusCodes.REFUND]: "Đã hoàn tiền",
      [paymentStatusCodes.FAILED]: "Thanh toán thất bại",
    }
    return statusMap[statusCode] || "Chưa thanh toán"
  }

  const getPaymentMethod = (method) => {
    const methods = {
      [paymentMethodCodes.MOMO]: "MoMo",
    };
    return methods[method] || "Không xác định";
  };
  
  const statusOptions = Object.entries(bookingStatusCodes).map(([key, value]) => ({
    label: <span className={`${styles.statusTag} ${styles[key.toLowerCase()]}`}>{getBookingStatusDisplay(value)}</span>,
    value: getBookingStatusDisplay(value),
  }));
  
  const paymentOptions = Object.entries(paymentStatusCodes).map(([key, value]) => ({
    label: (
      <span className={`${styles.paymentTag} ${styles[key.toLowerCase()]}`}>{getPaymentStatusDisplay(value)}</span>
    ),
    value: getPaymentStatusDisplay(value),
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
  ]

  const applyFilters = (filters) => {
    if (!bookings || bookings.length === 0) {
      setFilteredData([]);
      return;
    }
  
    let filtered = [...bookings];
  
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((item) => {
        if (!item || !item._originalBooking) return false;
        const statusCode = item._originalBooking.status;
        const statusText = getBookingStatusDisplay(statusCode);
        return filters.status.includes(statusText);
      });
    }
  
    // Apply payment filter
    if (filters.payment && filters.payment.length > 0) {
      filtered = filtered.filter((item) => {
        if (!item || !item._originalBooking) return false;
        const paymentCode = item._originalBooking.paymentStatus;
        const paymentText = getPaymentStatusDisplay(paymentCode);
        return filters.payment.includes(paymentText);
      });
    }
  
    const search = filters.searchTerm || searchTerm;
    if (search) {
      filtered = filtered.filter((item) => {
        if (!item || !item._originalBooking || !item._originalBooking.customerId) return false;
        const customerName = item._originalBooking.customerId.userId?.fullName || "";
        return customerName.toLowerCase().includes(search.toLowerCase());
      });
    }
  
    setFilteredData(filtered);
    setPagination(prev => ({
      ...prev, 
      current: 1, 
      total: filtered.length,
    }));
  }

  const handleFilterChange = (filterName, newValues) => {
    if (filterName === "reset") {
      setSelectedValues(newValues);
      setSearchTerm("");
      setFilteredData(bookings);
      return;
    }
  
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
  }

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    }
  }, [debouncedSearch]);

  const getStatusClass = (status) => {
    const statusMap = {
      "Đã xác nhận": "confirmed",
      "Chờ xác nhận": "pending",
      "Cần check-in": "needcheckin",
      "Đã check-in": "inprogress",
      "Cần check-out": "needcheckout",
      "Đã check-out": "checkedout",
      "Đã hủy": "canceled",
      "Hoàn tất": "complete",
      "Hoàn tiền": "refund"
    }

    return statusMap[status] || "pending"
  }

  const getPaymentClass = (payment) => {
    const paymentMap = {
      "Đã đặt": "booked",
      "Chờ thanh toán": "pending",
      "Đã thanh toán": "paid",
      "Đã hoàn tiền": "refund",
      "Thanh toán thất bại": "cancelled",
    }

    return paymentMap[payment] || "pending"
  }

  const getPaymentIcon = (method) => {
    const iconMap = {
      [paymentMethodCodes.MOMO]: (
        <img 
          src={momoIcon}
          alt="MoMo" 
          className={styles.paymentIcon}
        />
      ),
    };
    return iconMap[method] || <WalletOutlined />;
  };

  const columns = [
    {
      title: "No.",
      key: "no",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: <span className={styles.tableHeader}>Khách Hàng</span>,
      key: "customerName",
      render: (_, record) => {
        if (!record || !record._originalBooking || !record._originalBooking.customerId) {
          return "Không xác định";
        }
        return record._originalBooking.customerId.userId?.fullName || "Không xác định";
      }
    },
    {
      title: <span className={styles.tableHeader}>Loại Phòng</span>,
      key: "roomType",
      render: (_, record) => {
        if (!record || !record._originalBooking || !record._originalBooking.accommodationId) {
          return "Không xác định";
        }
        return record._originalBooking.accommodationId.accommodationTypeId?.name || "Không xác định";
      }
    },
    {
      title: <span className={styles.tableHeader}>Check-in / Check-out</span>,
      key: "bookingTime",
      render: (_, record) => {
        if (!record || !record._originalBooking) {
          return "N/A";
        }
        const booking = record._originalBooking;
        return (
          <div className={styles.timeInfo}>
            {booking.checkInHour || "N/A"} - {booking.checkOutHour || "N/A"}
          </div>
        );
      },
    },
    {
      title: <span className={styles.tableHeader}>Số Người</span>,
      key: "peopleCount",
      render: (_, record) => {
        if (!record || !record._originalBooking) {
          return "N/A";
        }
        const booking = record._originalBooking;
        return (
          <div className={styles.peopleInfo}>
            <span>NL: {booking.adultNumber || 0}</span>
            <span>TE: {booking.childNumber || 0}</span>
          </div>
        );
      },
    },
    {
      title: <span className={styles.tableHeader}>Thanh Toán</span>,
      key: "paymentMethod",
      render: (_, record) => {
        if (!record || !record._originalBooking) {
          return "N/A";
        }
        const booking = record._originalBooking;
        const paymentStatus = getPaymentStatusDisplay(booking.paymentStatus);
        const paymentMethod = booking.paymentMethod;
    
        return (
          <div className={styles.paymentInfo}>
            <div className={styles.method}>
              <span className={styles.paymentMethodIcon}>
                {getPaymentIcon(paymentMethod)}
              </span>
              {getPaymentMethod(paymentMethod)}
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
      key: "status",
      render: (_, record) => {
        if (!record || !record._originalBooking) {
          return "N/A";
        }
        const statusCode = record._originalBooking.status;
        const statusText = getBookingStatusDisplay(statusCode);

        return <span className={`${styles.statusTag} ${styles[getStatusClass(statusText)]}`}>{statusText}</span>;
      },
    },
    {
      title: "",
      key: "operation",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: menuItems(record).map((item) => ({
              ...item,
              onClick: () => item.onClick(record),
            })),
          }}
        >
          <MoreOutlined 
            onClick={(e) => e.preventDefault()}
            style={{ fontSize: 18, cursor: "pointer" }}
          />
        </Dropdown>
      ),
    },
  ];

  const menuItems = (record) => {
    if (!record || !record._originalBooking) {
      return [
        {
          key: "1",
          label: "Xem Chi Tiết",
          onClick: () => {},
          disabled: true
        }
      ];
    }

    const currentStatus = record._originalBooking.status;
    const allowedStatuses = [bookingStatusCodes.CONFIRMED, bookingStatusCodes.PENDING];
    
    const items = [
      {
        key: "1",
        label: "Xem Chi Tiết",
        onClick: handleViewDetails,
      }
    ];

    if (allowedStatuses.includes(currentStatus)) {
      items.push({
        key: "2",
        label: "Cập Nhật Trạng Thái",
        onClick: handleStatusUpdate,
      });
    }

    return items;
  };

  const handleViewDetails = (booking) => {
    if (!booking || !booking._originalBooking) return;
    
    const bookingId = booking._originalBooking._id || booking._originalBooking.id;
    if (!bookingId) return;

    setSelectedBookingId(bookingId);
    setIsBookingDetailVisible(true);

    if (onSelectBookingDetail) {
      onSelectBookingDetail(bookingId);
    }
  }

  const handleCloseBookingDetail = () => {
    setIsBookingDetailVisible(false);
    setSelectedBookingId(null);
  }

  const handleStatusUpdate = (booking) => {
    if (!booking) return;
    setSelectedBooking(booking);
    setStatusModalVisible(true);
  }

  const handleCloseStatusModal = () => {
    setStatusModalVisible(false);
    setSelectedBooking(null);
  }

  const handleCustomStatusChange = async (bookingId, newStatusDisplay, cancelReason) => {
    if (!onStatusChange) return;
    
    try {
      await onStatusChange(bookingId, newStatusDisplay, cancelReason);
      handleCloseStatusModal();
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
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
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => 
              (record && record._originalBooking) ? 
                (record._originalBooking._id || record._originalBooking.id || `row-${Math.random()}`) : 
                `row-${Math.random()}`
            }
            loading={isUpdating}
            pagination={{
              ...pagination,
              total: filteredData.length,
              pageSize: pagination.pageSize,
              showSizeChanger: false,
              className: styles.customPagination,
              itemRender: (page, type, originalElement) => {
                const totalPages = Math.ceil(filteredData.length / pagination.pageSize);
                if (type === "prev") {
                  return (
                    <button
                      className={styles.paginationButton}
                      disabled={page === 0}
                    >
                      « Trước
                    </button>
                  );
                }
                if (type === "next") {
                  return (
                    <button
                      className={styles.paginationButton}
                      disabled={page >= totalPages}
                    >
                      Tiếp »
                    </button>
                  );
                }
                return originalElement;
              },
            }}
            onChange={handleTableChange}
            className={styles.bookingTable}
            scroll={{ x: "max-content" }}
          />
        </div>
      </div>

      {selectedBooking && (
        <UpdateBookingStatus
          booking={selectedBooking}
          visible={statusModalVisible}
          onClose={handleCloseStatusModal}
          bookingStatusCodes={bookingStatusCodes}
          onStatusChange={(bookingId, statusDisplay, cancelReason) =>
            handleCustomStatusChange(bookingId, statusDisplay, cancelReason)
          }
          onGeneratePassword={generatePassword}
          isLoading={isUpdating}
          className={styles.modalContainer}
        />
      )}

      <BookingDetail
        bookingId={selectedBookingId}
        visible={isBookingDetailVisible}
        onClose={handleCloseBookingDetail}
        bookingData={bookingDetailData}
        isLoading={isDetailLoading}
        isError={isDetailError}
        bookingStatusCodes={bookingStatusCodes}
        paymentStatusCodes={paymentStatusCodes}
        paymentMethodCodes={paymentMethodCodes}
      />
    </div>
  );
}
import { useState, useEffect } from "react"
import { Dropdown, Input, Button, Menu, message } from "antd"
import { FilterOutlined, SearchOutlined } from "@ant-design/icons"
import { CreditCardOutlined, DollarOutlined, BankOutlined, WalletOutlined } from "@ant-design/icons"
import debounce from "lodash/debounce"
import TableModify from "../../../dashboard/components/Table"
import Filter from "../../../../components/Filter/Filter"
import UpdateBookingStatus from "../UpdateBookingStatus/UpdateBookingStatus"
import BookingDetail from "../BookingDetail/BookingDetail"
import styles from "./ListBooking.module.scss"
import { useGetBookingByIdQuery } from "../../../../redux/services/bookingApi"
import momoIcon from '../../../../../src/assets/momo.png';

const HorizontalEllipsisIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3" cy="8" r="1.5" fill="currentColor" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    <circle cx="13" cy="8" r="1.5" fill="currentColor" />
  </svg>
)

export default function ListBooking({ bookings, bookingStatusCodes, paymentStatusCodes, paymentMethodCodes, onStatusChange, isUpdating }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState(bookings || [])
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    payment: [],
  })
  const [dateRange, setDateRange] = useState(null)
  const [filterVisible, setFilterVisible] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const [isBookingDetailVisible, setIsBookingDetailVisible] = useState(false)

  const {
    data: bookingDetailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetBookingByIdQuery(selectedBookingId, {
    skip: !selectedBookingId,
  })

  useEffect(() => {
    setFilteredData(bookings || [])
  }, [bookings])

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
      [bookingStatusCodes.REFUND]: "Đã hoàn tiền"
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

  const statusOptions = Object.entries(bookingStatusCodes).map(([key, value]) => ({
    label: getBookingStatusDisplay(value),
    value: getBookingStatusDisplay(value),
  }))

  const paymentOptions = Object.entries(paymentStatusCodes).map(([key, value]) => ({
    label: getPaymentStatusDisplay(value),
    value: getPaymentStatusDisplay(value),
  }))

  const filterGroups = [
    {
      name: "status",
      title: "Trạng thái đặt phòng",
      options: statusOptions,
    },
    {
      name: "payment",
      title: "Trạng thái thanh toán",
      options: paymentOptions,
    },
  ]

  const applyFilters = () => {
    let filtered = [...bookings]

    if (selectedValues.status && selectedValues.status.length > 0) {
      filtered = filtered.filter((item) => selectedValues.status.includes(item.Status))
    }

    if (selectedValues.payment && selectedValues.payment.length > 0) {
      filtered = filtered.filter((item) => selectedValues.payment.includes(item.Payment))
    }

    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const customerName = item._originalBooking.customerId?.userId?.fullName || ""
        return customerName.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf("day")
      const endDate = dateRange[1].endOf("day")

      filtered = filtered.filter((item) => {
        const bookingDate = new Date(item._originalBooking.createdAt)
        return bookingDate >= startDate.toDate() && bookingDate <= endDate.toDate()
      })
    }

    setFilteredData(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [selectedValues, searchTerm, dateRange, bookings])

  const handleFilterChange = (filterName, newValues) => {
    if (filterName === "reset") {
      setSelectedValues(newValues)
      setDateRange(null)
      setSearchTerm("")
      return
    }

    if (filterName === "dateRange") {
      setDateRange(newValues)
      return
    }

    if (filterName === "search") {
      setSearchTerm(newValues)
      return
    }

    setSelectedValues({
      ...selectedValues,
      [filterName]: newValues,
    })
  }

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value)
  }, 500)

  const handleSearch = (e) => {
    const value = e.target.value
    debouncedSearch(value)
  }

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [])

  const getStatusClass = (status) => {
    const statusMap = {
      "Đã xác nhận": "confirmed",
      "Chờ xác nhận": "pending",
      "Cần check-in": "pending",
      "Đã check-in": "inprogress",
      "Cần check-out": "pending",
      "Đã check-out": "checkedout",
      "Đã huỷ": "canceled",
      "Hoàn tất": "complete",
      "Đã hoàn tiền": "refund"
    }

    return statusMap[status] || "pending"
  }

  const getPaymentClass = (payment) => {
    const paymentMap = {
      "Đã đặt": "confirmed",
      "Chờ thanh toán": "pending",
      "Đã thanh toán": "complete",
      "Đã hoàn tiền": "refund",
      "Thanh toán thất bại": "canceled",
      "Chưa thanh toán": "pending",
    }

    return paymentMap[payment] || "pending"
  }
  const getPaymentIcon = (method) => {
    if (method == paymentMethodCodes.MOMO) {
      return <img src={momoIcon} alt="MoMo" style={{ width: '16px', height: '16px' }} />;
    } else if (typeof method === 'string') {
      const methodStr = method.toLowerCase();
      if (methodStr.includes("visa") || methodStr.includes("card")) {
        return <CreditCardOutlined />;
      } else if (methodStr.includes("cash")) {
        return <DollarOutlined />;
      } else if (methodStr.includes("bank") || methodStr.includes("transfer")) {
        return <BankOutlined />;
      } else {
        return <WalletOutlined />;
      }
    } else {
      return <WalletOutlined />;
    }
  }

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
        const booking = record._originalBooking
        return (
          <div className={styles.timeInfo}>
            {booking.checkInHour} - {booking.checkOutHour}
          </div>
        )
      },
    },
    {
      title: <span className={styles.tableHeader}>Số Người</span>,
      dataIndex: "peopleCount",
      key: "peopleCount",
      render: (_, record) => {
        const booking = record._originalBooking
        return (
          <div className={styles.peopleInfo}>
            <span>NL: {booking.adultNumber}</span>
            <span>TE: {booking.childNumber}</span>
          </div>
        )
      },
    },
    {
      title: <span className={styles.tableHeader}>Thanh Toán</span>,
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (_, record) => {
        const booking = record._originalBooking;
        const paymentStatus = getPaymentStatusDisplay(booking.paymentStatus);
        const paymentMethodValue = booking.paymentMethod;

        const paymentMethodText = paymentMethodValue === paymentMethodCodes.MOMO
          ? "MoMo"
          : (paymentMethodValue ? String(paymentMethodValue) : "Chưa xác định");

        return (
          <div className={styles.paymentInfo}>
            <div className={styles.method}>
              <span className={styles.paymentMethodIcon}>
                {getPaymentIcon(paymentMethodValue)}
              </span>
              {paymentMethodText}
            </div>
            <div>
              <span className={`${styles.paymentTag} ${styles[getPaymentClass(paymentStatus)]}`}>{paymentStatus}</span>
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
        const statusCode = record._originalBooking.status
        const statusText = getBookingStatusDisplay(statusCode)

        return <span className={`${styles.statusTag} ${styles[getStatusClass(statusText)]}`}>{statusText}</span>
      },
    },
    {
      title: <span className={styles.tableHeader}>Thao Tác</span>,
      key: "operation",
      render: (_, record) => {
        const menuItems = [
          {
            key: "1",
            label: "Xem Chi Tiết",
            onClick: () => handleViewDetails(record),
          },
        ]

        if (
          record._originalBooking.status === bookingStatusCodes.CANCELLED &&
          record._originalBooking.paymentStatus === paymentStatusCodes.REFUND 
        ) {
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
        )
      },
    },
  ]

  const handleViewDetails = (booking) => {
    const bookingId = booking._originalBooking._id || booking._originalBooking.id
    setSelectedBookingId(bookingId)
    setIsBookingDetailVisible(true)
  }

  const handleCloseBookingDetail = () => {
    setIsBookingDetailVisible(false)
    setSelectedBookingId(null)
  }

  const handleStatusUpdate = (booking) => {
    setSelectedBooking(booking)
    setStatusModalVisible(true)
  }

  const handleCloseStatusModal = () => {
    setStatusModalVisible(false)
    setSelectedBooking(null)
  }

  const handleCustomStatusChange = async (booking) => {
    try {
      await onStatusChange(booking._originalBooking._id, {
        status: bookingStatusCodes.REFUND
      });

      message.success("Cập nhật trạng thái hoàn tiền thành công");
      handleCloseStatusModal();
    } catch (error) {
      message.error(error?.message || "Thao tác thất bại");
    }
  };

  const activeFilterCount =
    selectedValues.status.length + selectedValues.payment.length + (dateRange && dateRange[0] && dateRange[1] ? 1 : 0)

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
            allowClear
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
            visible={filterVisible}
            onVisibleChange={setFilterVisible}
          >
            <Button
              icon={<FilterOutlined />}
              className={styles.filterButton}
              type={activeFilterCount > 0 ? "primary" : "default"}
            >
              Lọc
              {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
            </Button>
          </Dropdown>
        </div>

        {activeFilterCount > 0 && (
          <div className={styles.activeTags}>
            {selectedValues.status.map((status) => (
              <div key={`status-${status}`} className={styles.activeTag}>
                {status}
                <Button
                  type="text"
                  size="small"
                  className={styles.removeTag}
                  onClick={() => {
                    const newValues = selectedValues.status.filter((s) => s !== status)
                    handleFilterChange("status", newValues)
                  }}
                >
                  ×
                </Button>
              </div>
            ))}

            {selectedValues.payment.map((payment) => (
              <div key={`payment-${payment}`} className={styles.activeTag}>
                {payment}
                <Button
                  type="text"
                  size="small"
                  className={styles.removeTag}
                  onClick={() => {
                    const newValues = selectedValues.payment.filter((p) => p !== payment)
                    handleFilterChange("payment", newValues)
                  }}
                >
                  ×
                </Button>
              </div>
            ))}

            {dateRange && dateRange[0] && dateRange[1] && (
              <div className={styles.activeTag}>
                {`${dateRange[0].format("DD/MM/YYYY")} - ${dateRange[1].format("DD/MM/YYYY")}`}
                <Button
                  type="text"
                  size="small"
                  className={styles.removeTag}
                  onClick={() => handleFilterChange("dateRange", null)}
                >
                  ×
                </Button>
              </div>
            )}

            <Button
              type="link"
              size="small"
              onClick={() =>
                handleFilterChange("reset", {
                  status: [],
                  payment: [],
                })
              }
            >
              Xóa tất cả
            </Button>
          </div>
        )}

        <div className={styles.tableContainer}>
          <TableModify tableColumn={tableColumn} tableData={filteredData} isPagination={true} loading={isUpdating} />
        </div>
      </div>

      {selectedBooking && (
        <UpdateBookingStatus
          booking={selectedBooking}
          visible={statusModalVisible}
          onClose={handleCloseStatusModal}
          bookingStatusCodes={bookingStatusCodes}
          paymentStatusCodes={paymentStatusCodes}
          paymentMethodCodes={paymentMethodCodes}
          onStatusChange={() => handleCustomStatusChange(selectedBooking)}
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
  )
}

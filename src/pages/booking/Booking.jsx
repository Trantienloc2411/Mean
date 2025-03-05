import { Dropdown, Tag, Input, Checkbox, Button, Table, Card } from "antd";
import TableModify from "../dashboard/components/Table";
import Overview from "./components/Overview";
import { FilterOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import Filter from "../../components/Filter/Filter";
import styles from "./Booking.module.scss";
import { useGetBookingsQuery } from "../../redux/services/bookingApi";
import moment from "moment";

export default function Booking() {
  const { data: bookings, error, isLoading } = useGetBookingsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    payment: [],
  });

  // Add pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0
  });

  // Define filterGroups
  const filterGroups = [
    {
      name: "status",
      title: "Trạng thái",
      options: [
        {
          label: <Tag color="blue">Đã xác nhận</Tag>,
          value: "Confirmed",
        },
        {
          label: <Tag color="orange">Chờ xác nhận</Tag>,
          value: "Pending",
        },
        {
          label: <Tag color="green">Hoàn tất</Tag>,
          value: "Complete",
        },
        {
          label: <Tag color="red">Đã huỷ</Tag>,
          value: "Canceled",
        },
        {
          label: <Tag color="purple">Đang sử dụng</Tag>,
          value: "In Progress",
        },
      ],
    },
    {
      name: "payment",
      title: "Thanh toán",
      options: [
        {
          label: <Tag color="blue">Đã đặt cọc</Tag>,
          value: "Deposited",
        },
        {
          label: <Tag color="green">Thanh toán hoàn tất</Tag>,
          value: "Fully Paid",
        },
        {
          label: <Tag color="orange">Chưa thanh toán</Tag>,
          value: "Unpaid",
        },
        {
          label: <Tag color="red">Trả cọc</Tag>,
          value: "Deposit Returned",
        },
        {
          label: <Tag color="purple">Mất cọc</Tag>,
          value: "Deposit Forfeited",
        },
      ],
    },
  ];

  // Update useEffect to handle data initialization
  useEffect(() => {
    if (bookings && Array.isArray(bookings)) {
      const formattedBookings = bookings.map((booking) => ({
        ...booking,
        key: booking._id, // Use _id as the key
      }));
      setFilteredData(formattedBookings);
      setPagination(prev => ({
        ...prev,
        total: formattedBookings.length
      }));
    }
  }, [bookings]);

  // Update search function
  const debouncedSearch = debounce((value) => {
    if (!bookings) return;
    
    const filtered = bookings.filter((booking) =>
      booking.customerId.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  }, 1000);

  // Update filter function to match the filter values
  const applyFilters = (filters) => {
    if (!bookings) return;
    
    let filtered = [...bookings];

    if (filters.status.length > 0) {
      filtered = filtered.filter((booking) => {
        let status = "";
        if (booking.isCancel) status = "Canceled";
        else if (booking.completedDate) status = "Complete";
        else if (booking.confirmDate) status = "Confirmed";
        else if (booking.checkInHour && !booking.checkOutHour) status = "In Progress";
        else status = "Pending";

        return filters.status.includes(status);
      });
    }

    if (filters.payment.length > 0) {
      filtered = filtered.filter((booking) => {
        let paymentStatus = "";
        if (booking.isFullPay) paymentStatus = "Fully Paid";
        else if (booking.isPayOnlyDeposit) paymentStatus = "Deposited";
        else if (booking.isCancel && booking.isPayOnlyDeposit) paymentStatus = "Deposit Returned";
        else if (booking.isCancel && !booking.isPayOnlyDeposit) paymentStatus = "Deposit Forfeited";
        else paymentStatus = "Unpaid";

        return filters.payment.includes(paymentStatus);
      });
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (filterName, newValues) => {
    const updatedValues = {
      ...selectedValues,
      [filterName]: newValues,
    };
    setSelectedValues(updatedValues);
    applyFilters(updatedValues);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Clean up debounce on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const items = [
    {
      key: "1",
      label: "Xem chi tiết",
    },
  ];

  // Update table columns to match the actual data structure
  const tableColumn = [
    {
      title: <span className={styles.titleTable}>STT</span>,
      key: 'index',
      render: (text, record, index) => index + 1,
      width: 70,
    },
    {
      title: <span className={styles.titleTable}>Mã đặt phòng</span>,
      dataIndex: "_id",
      key: "_id",
      width: 150,
    },
    {
      title: <span className={styles.titleTable}>Mã khách hàng</span>,
      dataIndex: "customerId",
      key: "customerId",
      width: 150,
    },
    {
      title: <span className={styles.titleTable}>Thời gian đặt</span>,
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
    },
    {
      title: <span className={styles.titleTable}>Thời gian check-in</span>,
      dataIndex: "checkInHour",
      key: "checkInHour",
      width: 150,
    },
    {
      title: <span className={styles.titleTable}>Số giờ thuê</span>,
      dataIndex: "durationBookingHour",
      key: "durationBookingHour",
      width: 100,
      render: (hours) => `${hours} giờ`,
    },
    {
      title: <span className={styles.titleTable}>Tổng tiền</span>,
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 150,
      render: (value) => `${parseInt(value).toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: <span className={styles.titleTable}>Trạng thái</span>,
      key: "status",
      width: 130,
      align: "center",
      render: (record) => {
        let status = "";
        let statusClass = "";

        if (record.isCancel) {
          status = "Đã huỷ";
          statusClass = "canceled";
        } else if (record.completedDate) {
          status = "Hoàn tất";
          statusClass = "complete";
        } else if (record.confirmDate) {
          status = "Đã xác nhận";
          statusClass = "confirmed";
        } else if (record.checkInHour && !record.checkOutHour) {
          status = "Đang sử dụng";
          statusClass = "inprogress";
        } else {
          status = "Chờ xác nhận";
          statusClass = "pending";
        }

        return (
          <span className={`${styles.statusTag} ${styles[statusClass]}`}>
            {status}
          </span>
        );
      },
    },
    {
      title: <span className={styles.titleTable}>Thanh toán</span>,
      key: "payment",
      width: 150,
      align: "center",
      render: (record) => {
        let paymentStatus = "";
        let paymentClass = "";

        if (record.isFullPay) {
          paymentStatus = "Thanh toán hoàn tất";
          paymentClass = "fullypaid";
        } else if (record.isPayOnlyDeposit) {
          paymentStatus = "Đã đặt cọc";
          paymentClass = "deposited";
        } else if (record.isCancel && record.isPayOnlyDeposit) {
          paymentStatus = "Trả cọc";
          paymentClass = "depositreturned";
        } else if (record.isCancel && !record.isPayOnlyDeposit) {
          paymentStatus = "Mất cọc";
          paymentClass = "depositforfeited";
        } else {
          paymentStatus = "Chưa thanh toán";
          paymentClass = "unpaid";
        }

        return (
          <span className={`${styles.paymentTag} ${styles[paymentClass]}`}>
            {paymentStatus}
          </span>
        );
      },
    },
    {
      title: <span className={styles.titleTable}>Thao tác</span>,
      key: "operation",
      width: 100,
      render: () => (
        <Dropdown menu={{ items }}>
          <MoreOutlined />
        </Dropdown>
      ),
    },
  ];

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div className={styles.contentContainer}>
      <h1 className={styles.sectionTitle}>Quản lý đặt phòng</h1>
      
      <div className={styles.overviewSection}>
        <Overview />
      </div>

      <div className={styles.bookingSection}>
        <h2 className={styles.sectionTitle}>Danh sách đặt phòng</h2>
        <Card className={styles.bookingCard} bordered={false}>
          <div className={styles.toolbarContainer}>
            <div className={styles.searchFilterGroup}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm theo mã khách hàng"
                className={styles.searchInput}
                value={searchTerm}
                onChange={handleSearch}
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
              >
                <Button 
                  icon={<FilterOutlined />}
                  className={styles.filterButton}
                >
                  Lọc
                  {Object.values(selectedValues).flat().length > 0 &&
                    ` (${Object.values(selectedValues).flat().length})`}
                </Button>
              </Dropdown>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <Table 
              columns={tableColumn}
              dataSource={filteredData}
              loading={isLoading}
              pagination={{
                ...pagination,
                showSizeChanger: false,
                className: styles.customPagination,
                onChange: (page) => {
                  setPagination(prev => ({ ...prev, current: page }));
                },
                itemRender: (page, type, originalElement) => {
                  const totalPages = Math.ceil(filteredData.length / pagination.pageSize);
                  if (type === "prev") {
                    return (
                      <button
                        className={styles.paginationButton}
                        disabled={page === 1} // First page starts at 1
                      >
                        « Trước
                      </button>
                    );
                  }
                  if (type === "next") {
                    return (
                      <button
                        className={styles.paginationButton}
                        disabled={page === totalPages} // Disable when on the last page
                      >
                        Tiếp »
                      </button>
                    );
                  }
                  return originalElement;
                },
              }}
              className={styles.bookingTable}
              scroll={{ x: 1300 }} // Add horizontal scroll for better mobile view
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

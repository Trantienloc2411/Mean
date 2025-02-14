import styles from "../coupon/Coupon.module.scss";
import { couponData } from "./data/fakeData.js";
import TableModify from "../dashboard/components/Table";
import { MoreOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Dropdown, Input, Button, DatePicker, Tag } from "antd";
import debounce from "lodash/debounce";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Filter from "../../components/Filter/Filter.jsx";
import DeleteCouponModal from "./components/DeleteCouponModal.jsx";
import AddCouponModal from "./components/AddCoupon/AddCouponModal.jsx";
const { RangePicker } = DatePicker;


export default function Coupon() {
  dayjs.extend(isBetween);
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    discountType: [],
    dateRange: [], // Store the date range
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(couponData);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter configuration
  const filterGroups = [
    {
      name: "discountType",
      title: "Hình thức giảm",
      options: [
        { key: '1', label: "Phần trăm", value: "Percentage" },
        { key: '2', label: "Cố định", value: "Fixed" },
      ],
    },
    {
      name: 'status',
      title: 'Trạng thái',
      options: [
        {
          label: <Tag color="green">Đang hoạt động</Tag>,
          value: 'Active'
        },
        {
          label: <Tag color="red">Hết hạn</Tag>,
          value: 'Inactive'
        }
      ]
    },

  ];

  const items = [
    {
      key: '1',
      label: 'Xem chi tiết',
    },
    {
      key: '2',
      label: 'Chỉnh sửa'
    },
    {
      key: '3',
      label: 'Vô hiệu hoá',
      danger: true
    }
  ];


  const handleAddCoupon = (values) => {
    console.log('New Coupon Values:', values);
    // Add your logic to handle the new coupon data
    setIsAddModalOpen(false);
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

  const handleMenuClick = (key, record) => {
    if (key === '3') { // Vô hiệu hoá option
      setSelectedCoupon(record);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    // Handle the deletion logic here

    console.log(`Deleting coupon: ${selectedCoupon?.Name}`);
    setIsDeleteModalOpen(false);
    setSelectedCoupon(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedCoupon(null);
  };

  // Handle filter changes
  const applyFilters = (filters) => {
    let filtered = [...couponData];

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter((item) =>
        filters.status.some((status) => status.toLowerCase() === item.Status.toLowerCase())
      );
    }

    // Apply discount type filter
    if (filters.discountType.length > 0) {
      filtered = filtered.filter((item) =>
        filters.discountType.includes(item.DiscountType)
      );
    }

    // Apply date range filter
    if (filters.dateRange?.length === 2) {
      const [start, end] = filters.dateRange;
      filtered = filtered.filter((item) => {
        const itemStart = new Date(item.StartTime);
        const itemEnd = new Date(item.EndTime);
        return itemStart >= new Date(start) && itemEnd <= new Date(end);
      });
    }

    setFilteredData(filtered);
  };




  const handleFilterChange = (filterName, newValues) => {
    const updatedValues = {
      ...selectedValues,
      [filterName]: newValues,
    };

    setSelectedValues(updatedValues); // Update state
    applyFilters(updatedValues); // Use updated state
  };



  // Handle date range filter change
  const handleDateRangeChange = (dates, dateStrings) => {
    setSelectedValues((prev) => ({
      ...prev,
      dateRange: dates ? dateStrings : [],
    }));
  };

  // Handle search input change
  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  // Filter data based on selected filters and search term

  // Filter data based on selected filters and search term
  useEffect(() => {
    let filtered = [...couponData];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item["Name"].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedValues.status?.length > 0) {
      filtered = filtered.filter((item) =>
        selectedValues.status.some((status) =>
          status.toLowerCase() === item["Status"].toLowerCase()
        )
      );
    }

    if (selectedValues.discountType?.length > 0) {
      filtered = filtered.filter((item) =>
        selectedValues.discountType.includes(item["DiscountType"])
      );
    }

    // In your useEffect:
    if (selectedValues.dateRange?.length === 2) {
      const [start, end] = selectedValues.dateRange;
      // Parse selected dates and set time range
      const startDate = dayjs(start).startOf('day');
      const endDate = dayjs(end).endOf('day');

      filtered = filtered.filter((item) => {
        // Parse dates from your specific format "HH:mm:ss DD/MM/YYYY"
        const [time, date] = item.StartTime.split(' ');
        const [endTime, endDate] = item.EndTime.split(' ');

        const itemStartTime = dayjs(date + ' ' + time, "DD/MM/YYYY HH:mm:ss");
        const itemEndTime = dayjs(endDate + ' ' + endTime, "DD/MM/YYYY HH:mm:ss");

        return itemStartTime.isSame(startDate) ||
          itemEndTime.isSame(endDate) ||
          (itemStartTime.isAfter(startDate) && itemEndTime.isBefore(endDate)) ||
          (itemStartTime.isBefore(startDate) && itemEndTime.isAfter(endDate));
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedValues]);




  const tableColumn = [
    { title: "No.", dataIndex: "No", key: "No" },
    { title: "Tên mã", dataIndex: "Name", key: "Name" },
    { title: "Hình thức giảm", dataIndex: "DiscountType", key: "DiscountType" },
    { title: "Giá trị", dataIndex: "Value", key: "Value" },
    { title: "Khuyến mãi tối đa", dataIndex: "MaxDiscount", key: "MaxDiscount" },
    { title: "Ngày bắt đầu", dataIndex: "StartTime", key: "StartTime" },
    { title: "Ngày kết thúc", dataIndex: "EndTime", key: "EndTime" },
    {
      title: <span className="titleTable">Trạng thái</span>,
      dataIndex: "Status",
      key: "status",
      align: 'center',
      render: ( Status ) => {
        return (
          <span className={`${styles.status} ${styles[Status.toLowerCase()]}`}>
            {Status === "Active" ? "Đang hoạt động" : "Hết hạn"}
          </span>
        );
      },
    },
    {
      title: "",
      key: "operation",
      render: (_, record) => (  // Add record parameter here
        <Dropdown menu={{
          items,
          onClick: ({ key }) => handleMenuClick(key, record)  // Now record is available
        }}>
          <MoreOutlined />
        </Dropdown>
      ),
    }
  ];

  return (
    <div className={styles.contentContainer}>
      <h1>Quản lí mã giảm giá</h1>
      <h2>Danh sách mã giảm giá</h2>
      <div className={styles.contentTable}>
        <div className={styles.tool}>
          <div className={styles.searchFilter}>
            {/* Search Input */}
            <Input
              placeholder="Tìm kiếm tên mã"
              onChange={handleSearch}
              style={{ width: "250px", marginRight: "10px" }}
            />

            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              dropdownRender={() => (
                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  <Filter
                    filterGroups={filterGroups}
                    selectedValues={selectedValues}
                    onFilterChange={handleFilterChange}
                    onDateRangeChange={handleDateRangeChange}
                  />
                </div>
              )}
            >
              <Button icon={<FilterOutlined />}>
                Lọc
                {Object.values(selectedValues).flat().length > 0 &&
                  ` (${Object.values(selectedValues).flat().length})`}
              </Button>
            </Dropdown>

            <DeleteCouponModal
              isOpen={isDeleteModalOpen}
              onCancel={handleDeleteCancel}
              onConfirm={handleDeleteConfirm}
              couponName={selectedCoupon?.Name}
            />


            <DatePicker.RangePicker
              style={{ width: "300px", margin: "16px 0", marginLeft: 10 }}
              onChange={handleDateRangeChange}
              placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
              format="DD/MM/YYYY"
              value={
                selectedValues.dateRange?.length === 2
                  ? [
                    dayjs(selectedValues.dateRange[0], "DD/MM/YYYY"),
                    dayjs(selectedValues.dateRange[1], "DD/MM/YYYY")
                  ]
                  : null
              }
            />
          </div>

          <Button
            color="default"
            variant="outlined"
            type="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<PlusOutlined />}
          >
            Tạo mã giảm giá
          </Button>

          <AddCouponModal
            isOpen={isAddModalOpen}
            onCancel={handleAddCancel}
            onConfirm={handleAddCoupon}
          />


        </div>

        {/* Table */}
        <TableModify tableColumn={tableColumn} tableData={filteredData} />

      </div>
    </div>
  );
}

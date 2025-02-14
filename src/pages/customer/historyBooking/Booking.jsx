import { debounce } from "lodash";
import React from "react";
import { useState, useEffect   } from "react";
import { useCallback } from "react";
import { Table, Input, Button, Dropdown, Tag } from "antd";
import {
  FilterOutlined,
  MoreOutlined,
  LeftOutlined,
  RightOutlined,  
} from "@ant-design/icons";
import styles from "./Booking.module.scss";

export default function Booking() {
  const data = [
    {
      id: 1,
      customer: "Nguyễn Lê Vỹ Kha",
      location: "Nha Trang Resort",
      bookingTime: "14:30:45 21/12/2023",
      usageTime: "14:30 21/12/2023",
      total: "200,000 vnđ",
      eKey: "Have",
      status: "Confirmed",
      payment: "Deposited",
    },
    {
      id: 2,
      customer: "Pegasus",
      location: "Hữu Duyên Home",
      bookingTime: "14:30:45 21/12/2023",
      usageTime: "14:30 21/12/2023",
      total: "200,000 vnđ",
      eKey: "Have",
      status: "Confirmed",
      payment: "Deposited",
    },
    {
      id: 3,
      customer: "Martin",
      location: "Vitamin Bed",
      bookingTime: "14:30:45 21/12/2023",
      usageTime: "14:30 21/12/2023",
      total: "200,000 vnđ",
      eKey: "Have",
      status: "Confirmed",
      payment: "Deposited",
    },
    {
      id: 4,
      customer: "Cecil",
      location: "Bed Style",
      bookingTime: "14:30:45 21/12/2023",
      usageTime: "14:30 21/12/2023",
      total: "200,000 vnđ",
      eKey: "None",
      status: "Pending",
      payment: "Unpaid",
    },
    {
      id: 5,
      customer: "Luke",
      location: "Lười Coffee",
      bookingTime: "14:30:45 21/12/2023",
      usageTime: "14:30 21/12/2023",
      total: "200,000 vnđ",
      eKey: "Have",
      status: "Confirmed",
      payment: "Deposited",
    },
    {
      id: 6,
      customer: "Yadrin",
      location: "Hải Home",
      bookingTime: "14:30:45 21/12/2023",
      usageTime: "14:30 21/12/2023",
      total: "200,000 vnđ",
      eKey: "Have",
      status: "Complete",
      payment: "Fully Paid",
    },
    {
      id: 7,
      customer: "Kiand",
      location: "Bed Home",
      bookingTime: "14:30:45 21/12/2023",
      usageTime: "14:30 21/12/2023",
      total: "200,000 vnđ",
      eKey: "Have",
      status: "Confirmed",
      payment: "Deposited",
    },
    {
      id: 8,
      customer: "Kiand",
      location: "Long Bed",
      bookingTime: "14:30:45 21/12/2023",
      usageTime: "14:30 21/12/2023",
      total: "200,000 vnđ",
      eKey: "Have",
      status: "Confirmed",
      payment: "Deposited",
    },
    {
      id: 9,
      customer: "Turen",
      location: "Con Sen",
      bookingTime: "14:30:45 21/12/2023",
      usageTime: "14:30 21/12/2023",
      total: "200,000 vnđ",
      eKey: "Have",
      status: "Confirmed",
      payment: "Deposited",
    },
    {
      id: 10,
      customer: "Turen",
      location: "Trạm Nhà",
      bookingTime: "14:30:45 21/12/2023",
      usageTime: "14:30 21/12/2023",
      total: "200,000 vnđ",
      eKey: "None",
      status: "Cancel",
      payment: "Refund",
    },
    {
      id: 11,
      customer: "Alex",
      location: "Sunrise Villa",
      bookingTime: "15:00:00 22/12/2023",
      usageTime: "15:30 22/12/2023",
      total: "250,000 vnđ",
      eKey: "Have",
      status: "Confirmed",
      payment: "Deposited",
    },
    {
      id: 12,
      customer: "James",
      location: "Ocean View",
      bookingTime: "16:00:00 22/12/2023",
      usageTime: "16:30 22/12/2023",
      total: "180,000 vnđ",
      eKey: "Have",
      status: "Pending",
      payment: "Unpaid",
    },
    {
      id: 13,
      customer: "Sophia",
      location: "Mountain Retreat",
      bookingTime: "17:00:00 22/12/2023",
      usageTime: "17:30 22/12/2023",
      total: "300,000 vnđ",
      eKey: "Have",
      status: "Complete",
      payment: "Fully Paid",
    },
    {
      id: 14,
      customer: "Daniel",
      location: "City Inn",
      bookingTime: "18:00:00 22/12/2023",
      usageTime: "18:30 22/12/2023",
      total: "150,000 vnđ",
      eKey: "None",
      status: "Pending",
      payment: "Unpaid",
    },
    {
      id: 15,
      customer: "Emily",
      location: "Green Hills",
      bookingTime: "19:00:00 22/12/2023",
      usageTime: "19:30 22/12/2023",
      total: "220,000 vnđ",
      eKey: "Have",
      status: "Confirmed",
      payment: "Deposited",
    },
    {
      id: 16,
      customer: "Oliver",
      location: "Skyline Hotel",
      bookingTime: "20:00:00 22/12/2023",
      usageTime: "20:30 22/12/2023",
      total: "270,000 vnđ",
      eKey: "Have",
      status: "Confirmed",
      payment: "Deposited",
    },
    {
      id: 17,
      customer: "Ava",
      location: "Palm Resort",
      bookingTime: "21:00:00 22/12/2023",
      usageTime: "21:30 22/12/2023",
      total: "200,000 vnđ",
      eKey: "None",
      status: "Cancel",
      payment: "Refund",
    },
    {
      id: 18,
      customer: "Lucas",
      location: "Moonlight Inn",
      bookingTime: "22:00:00 22/12/2023",
      usageTime: "22:30 22/12/2023",
      total: "190,000 vnđ",
      eKey: "Have",
      status: "Confirmed",
      payment: "Deposited",
    },
    {
      id: 19,
      customer: "Mia",
      location: "Starry Night B&B",
      bookingTime: "23:00:00 22/12/2023",
      usageTime: "23:30 22/12/2023",
      total: "210,000 vnđ",
      eKey: "Have",
      status: "Complete",
      payment: "Fully Paid",
    },
    {
      id: 20,
      customer: "Ethan",
      location: "Blue Lagoon",
      bookingTime: "00:00:00 23/12/2023",
      usageTime: "00:30 23/12/2023",
      total: "230,000 vnđ",
      eKey: "Have",
      status: "Confirmed",
      payment: "Deposited",
    },
  ];

  

  const [searchText, setSearchText] = useState("");
  const columns = [
    { title: "No.", dataIndex: "id", key: "id", width: 70 },
    { title: "Tên khách hàng", dataIndex: "customer", key: "customer" },
    { title: "Tên địa điểm", dataIndex: "location", key: "location" },
    { title: "Thời gian đặt", dataIndex: "bookingTime", key: "bookingTime" },
    { title: "Thời gian sử dụng", dataIndex: "usageTime", key: "usageTime" },
    {
      title: "Tổng hóa đơn",
      dataIndex: "total",
      key: "total",
      render: (amount) => <span className="amount">{amount}</span>,
    },
    {
      title: "E-Key",
      dataIndex: "eKey",
      key: "eKey",
      render: (eKey) => {
        return (
          <span className={`${styles.eKey} ${styles[eKey.toLowerCase()]}`}>
            {eKey === "Have" ? "Có" : "Không có"}
          </span>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return (
          <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>
            {status === "Confirmed"
              ? "Đã xác nhận"
              : status === "Pending"
              ? "Chờ xác nhận"
              : status === "Cancel"
              ? "Huỷ"
              : "Hoàn tất"}
          </span>
        );
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "payment",
      key: "payment",
      render: (payment) => {
        return (
          <span
            className={`${styles.payment} ${
              styles[payment.replace(/\s/g, '').toLowerCase()]
            }`}
          >
            {payment === "Deposited"
              ? "Đã đặt cọc"
              : payment === "Fully Paid"
              ? "Đã thanh toán"
              : payment === "Unpaid"
              ? "Chờ thanh toán"
              : payment === "Refund"
              ? "Huỷ"
              : "Không xác định"}
          </span>
        );
      },
    },
    {
      title: "",
      key: "action",
      width: 50,
      render: () => (
        <Dropdown menu={{ items: actionItems }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];
  const [filteredData, setFilteredData] = useState(data);
  const debouncedSearch = useCallback(
    debounce((value) => {
      const filtered = data.filter((item) =>
        item.customer.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }, 300),
    [data]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    
    // Direct filtering for immediate response
    const filtered = data.filter((item) =>
      item.customer.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };
  
    

  const actionItems = [
    { key: "1", label: "Xem chi tiết",  },
    { key: "2", label: "Chỉnh sửa"},
    { key: "3", label: "Xoá", danger: true },
  ];

  return (
    <div className={styles.bookingInformation}>
      <h1>Thông tin đặt phòng</h1>

      <div className={styles.searchSection}>
        <Input
          style={{maxWidth: 250}}
          placeholder="Tìm kiếm tên khách hàng"
          value={searchText}
          onChange={handleSearchChange}
          prefix={<span className="search-icon">🔍</span>}
        />
        <Button icon={<FilterOutlined />}>Lọc</Button>
      </div>

      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            total: 50,
            pageSize: 10,
            showTotal: (total) => `Total ${total} items`,
            itemRender: (page, type, originalElement) => {
              if (type === "prev") {
                return <Button icon={<LeftOutlined />}>Previous</Button>
              }
              if (type === "next") {
                return <Button icon={<RightOutlined />}>Next</Button>
              }
              return originalElement
            },
          }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}

//customer history booking screen


import { Card, Table, Input, Space } from "antd";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import styles from "./OwnerRevenue.module.scss";
import { Select } from "antd";
dayjs.extend(customParseFormat);
const DATE_FORMAT = "DD/MM/YYYY HH:mm:ss";

const BOOKING_STATUS_LABELS = {
  8: { text: "Đang xử lý", color: "gold" },
  1: { text: "Đã xác nhận", color: "blue" },
  2: { text: "Chờ nhận phòng", color: "processing" },
  3: { text: "Đã nhận phòng", color: "geekblue" },
  4: { text: "Chờ trả phòng", color: "orange" },
  5: { text: "Đã trả phòng", color: "cyan" },
  6: { text: "Đã hủy", color: "red" },
  7: { text: "Hoàn tất", color: "green" },
  9: { text: "Đã hoàn tiền", color: "volcano" },
};
const PAYMENT_STATUS_LABELS = {
  1: { text: "Đã xác nhận", color: "blue" },
  2: { text: "Chờ", color: "processing" },
  3: { text: "Đã Thanh toán", color: "geekblue" },
  4: { text: "Yêu cầu hoàn tiền", color: "orange" },
  5: { text: "Thất bại", color: "red" },
};

export default function BookingTable({ bookings = [], loading }) {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 👈 Thêm state trang hiện tại
  const pageSize = 6;

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) =>
        booking?.id?.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((booking) =>
        statusFilter.length > 0 ? statusFilter.includes(booking.status) : true
      )
      .filter((booking) =>
        paymentStatusFilter.length > 0
          ? paymentStatusFilter.includes(booking.paymentStatus)
          : true
      )

      .sort(
        (a, b) =>
          dayjs(b.createdAt, DATE_FORMAT).valueOf() -
          dayjs(a.createdAt, DATE_FORMAT).valueOf()
      );
  }, [bookings, searchText, statusFilter, paymentStatusFilter]);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Mã đơn",
      dataIndex: "id",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerId",
      render: (customer) => customer?.userId?.fullName || "Không rõ",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "totalPrice",
      render: (price) => price?.toLocaleString() + " vnđ" || "0 vnđ",
    },

    {
      title: "Ngày tạo đơn",
      dataIndex: "createdAt",
      render: (date) =>
        dayjs(date, DATE_FORMAT).format("DD/MM/YYYY HH:mm") || "Không rõ",
    },
    {
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      render: (status) => {
        const label = BOOKING_STATUS_LABELS[status]?.text || "Không rõ";
        const className = status
          ? `${styles.bookingStatus} ${styles[`status-${status}`]}`
          : `${styles.bookingStatus} ${styles.unknown}`;
        return <span className={className}>{label}</span>;
      },
    },
    {
      title: "Thanh toán",
      align: "center",
      dataIndex: "paymentStatus",
      render: (paymentStatus) => {
        const label = PAYMENT_STATUS_LABELS[paymentStatus]?.text || "Không rõ";
        const className = paymentStatus
          ? `${styles.paymentStatus} ${styles[`status-${paymentStatus}`]}`
          : `${styles.paymentStatus} ${styles.unknown}`;
        return <span className={className}>{label}</span>;
      },
    },
  ];

  return (
    <Card
      title="Danh sách đơn đặt phòng"
      extra={
        <Space>
          <Input.Search
            placeholder="Tìm theo mã đơn"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            mode="multiple"
            placeholder="Lọc trạng thái"
            allowClear
            style={{ width: 250 }}
            onChange={(value) => setStatusFilter(value)}
          >
            {Object.entries(BOOKING_STATUS_LABELS).map(([key, value]) => (
              <Select.Option key={key} value={Number(key)}>
                {value.text}
              </Select.Option>
            ))}
          </Select>
          <Select
            mode="multiple"
            placeholder="Lọc trạng thái thanh toán"
            allowClear
            style={{ width: 250 }}
            onChange={(value) => setPaymentStatusFilter(value)}
          >
            {Object.entries(PAYMENT_STATUS_LABELS).map(([key, value]) => (
              <Select.Option key={key} value={Number(key)}>
                {value.text}
              </Select.Option>
            ))}
          </Select>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredBookings}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </Card>
  );
}

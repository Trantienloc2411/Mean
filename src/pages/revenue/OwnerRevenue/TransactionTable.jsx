import { Space, Input, Select, Card, Table } from "antd"; // Gộp các import
import dayjs from "dayjs";
import { useState, useMemo } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
import styles from "./OwnerRevenue.module.scss";

dayjs.extend(customParseFormat);

const DATE_FORMAT = "DD/MM/YYYY HH:mm:ss";

const TRANSACTION_STATUS_MAP = {
  1: "Chờ xử lý",
  2: "Hoàn tất",
  3: "Thất bại",
};

export default function TransactionTable({ transactions }) {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 👈 Thêm state trang hiện tại
  const pageSize = 6;

  const filterTransactionCode = useMemo(() => {
    return transactions
      .filter((transaction) =>
        transaction?.id?.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((transaction) =>
        statusFilter.length > 0
          ? statusFilter.includes(transaction.transactionStatus)
          : true
      )
      .sort(
        (a, b) =>
          dayjs(b.transactionCreatedDate, DATE_FORMAT).valueOf() -
          dayjs(a.transactionCreatedDate, DATE_FORMAT).valueOf()
      );
  }, [transactions, searchText, statusFilter]);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Mã giao dịch",
      dataIndex: "paymentCode",
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "transactionCreatedDate",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      render: (v) => `${v.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "transactionStatus",
      render: (status) => (
        <span
          className={`${styles.transactionStatus} ${
            styles[`status-${status}`] || styles.unknown
          }`}
        >
          {TRANSACTION_STATUS_MAP[status] || "Không xác định"}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "transactionCreatedDate",
      render: (date) => dayjs(date, DATE_FORMAT).format(DATE_FORMAT),
    },
    {
      title: "Nội dung",
      dataIndex: "description",
    },
  ];

  return (
    <Card
      title="Danh sách giao dịch"
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
            {Object.entries(TRANSACTION_STATUS_MAP).map(([key, value]) => (
              <Select.Option key={key} value={Number(key)}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filterTransactionCode}
        rowKey="id"
        pagination={{
          pageSize,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </Card>
  );
}

import { Space } from "antd";
import { Input } from "antd";
import { Select } from "antd";
import { Card, Table } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useMemo } from "react";

dayjs.extend(customParseFormat);
const DATE_FORMAT = "DD/MM/YYYY HH:mm:ss";
const TRANSACTION_STATUS_MAP = {
  1: "Chờ xử lý",
  2: "Hoàn tất",
  3: "Thất bại",
};

const TRANSACTION_TYPE_MAP = {
  1: "Thanh toán Momo",
};

export default function TransactionTable({ transactions }) {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);

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
          dayjs(b.createdAt, DATE_FORMAT).valueOf() -
          dayjs(a.createdAt, DATE_FORMAT).valueOf()
      );
  });
  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
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
      render: (status) => TRANSACTION_STATUS_MAP[status] || "Không xác định",
    },
    {
      title: "Hình thức",
      dataIndex: "typeTransaction",
      render: (type) => TRANSACTION_TYPE_MAP[type] || "Không xác định",
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
                {value.text}
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
        pagination={{ pageSize: 6 }}
      />
    </Card>
  );
}

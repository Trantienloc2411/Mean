import React from "react";
import { Table, Tag, Button, Tooltip, Badge } from "antd";
import { EyeOutlined, BookOutlined } from "@ant-design/icons";
import { useState } from "react";
import styles from "./Revenue.module.scss";

const RevenueTable = ({ data, handleViewDetail }) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: data.length,
  });
  const columns = [
    {
      title: "Chủ sở hữu",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <span style={{ fontWeight: "500" }}>{name || "Chưa có tên"}</span>
      ),
    },
    {
      title: "Số booking",
      dataIndex: "bookingCount",
      key: "bookingCount",
      render: (count) => (
        <Badge
          count={count}
          showZero
          style={{
            backgroundColor: count > 0 ? "#108ee9" : "#d9d9d9",
            fontSize: "12px",
            padding: "0 8px",
          }}
          overflowCount={999}
        />
      ),
      sorter: (a, b) => a.bookingCount - b.bookingCount,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "ACTIVE"
              ? "green"
              : status === "PENDING"
              ? "orange"
              : "red"
          }
        >
          {status === "ACTIVE" ? "ĐANG HOẠT ĐỘNG" : "CHƯA CÓ BOOKING"}
        </Tag>
      ),
      // filters: [
      //   { text: "Đang hoạt động", value: "ACTIVE" },
      //   { text: "Chưa có booking", value: "PENDING" },
      // ],
      // onFilter: (value, record) => record.status === value,
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (val) => val.toLocaleString() + " VND",
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: "Phí nền tảng",
      dataIndex: "platformFee",
      key: "platformFee",
      render: (val) => val.toLocaleString() + " VND",
    },
    {
      title: "Lợi nhuận Owner",
      key: "profit",
      render: (_, record) =>
        (record.revenue - record.platformFee).toLocaleString() + " VND",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết booking">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
            disabled={record.bookingCount === 0}
          >
            Chi tiết
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
        <BookOutlined
          style={{ marginRight: 8, fontSize: 18, color: "#1890ff" }}
        />
        <span style={{ fontWeight: "500", fontSize: 16 }}>
          Danh sách doanh thu theo owner
        </span>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: pagination.current,
          pageSize: 7,
          total: data.length,
          showSizeChanger: false,
          onChange: (page) =>
            setPagination((prev) => ({ ...prev, current: page })),
          itemRender: (page, type, originalElement) => {
            const totalPages = Math.ceil(data.length / 7);
            if (type === "prev") {
              return (
                <button
                  className={styles.paginationButton}
                  disabled={pagination.current === 1}
                >
                  « Trước
                </button>
              );
            }
            if (type === "next") {
              return (
                <button
                  className={styles.paginationButton}
                  disabled={pagination.current >= totalPages}
                >
                  Tiếp »
                </button>
              );
            }
            return originalElement;
          },
        }}
        rowKey="id"
        // bordered
        size="middle"
      />
    </>
  );
};

export default RevenueTable;

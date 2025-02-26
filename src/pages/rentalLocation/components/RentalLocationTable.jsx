import { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";

import { Dropdown, Menu, Table } from "antd";
import { useNavigate } from "react-router-dom";
import ModalViewDetailRental from "./ModalViewDetailRental";
import styles from "./RentalLocationTable.module.scss";
export default function RentalLocationTable({ data, loading }) {
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const navigate = useNavigate();
  console.log(data);

  const RENTALLOCATION_STATUS = {
    PENDING: 1,
    INACTIVE: 2,
    ACTIVE: 3,
    PAUSE: 4,
  };

  const STATUS_LABELS = {
    [RENTALLOCATION_STATUS.PENDING]: {
      label: "Chờ duyệt",
      bgColor: "#e2e3e5",
      color: "#6c757d",
    },
    [RENTALLOCATION_STATUS.INACTIVE]: {
      label: "Không hoạt động",
      bgColor: "#FEECEB",
      color: "#F36960",
    },
    [RENTALLOCATION_STATUS.ACTIVE]: {
      label: "Hoạt động",
      bgColor: "#E7F8F0",
      color: "#41C588",
    },
    [RENTALLOCATION_STATUS.PAUSE]: {
      label: "Tạm dừng",
      bgColor: "#FEF4E6",
      color: "#F9A63A",
    },
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: data.length,
  });

  const handleViewDetails = (record) => {
    setSelectedRental(record);
    setIsDetailModalVisible(true);
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => {
        const { current, pageSize } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    { title: "Tên địa điểm", dataIndex: "name", key: "name" },
    {
      title: "Người đại diện",
      key: "no",

      render: (_, record) => record?.ownerId?.userId?.fullName || "N/A",
    },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (status) => {
        const statusInfo = STATUS_LABELS[status] || {};
        return (
          <span
            style={{
              backgroundColor: statusInfo.bgColor,
              color: statusInfo.color,
              padding: "4px 12px",
              borderRadius: "16px",
              fontSize: "12px"
            }}
          >
            {statusInfo.label || "Không xác định"}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={() => handleViewDetails(record)}>
                Xem
              </Menu.Item>
              <Menu.Item
                key="2"
                onClick={() => navigate(`/rental-location/${record.id}`)}
              >
                Xem chi tiết
              </Menu.Item>
              {/* <Menu.Item key="3" onClick={() => handleChangeStatus(record)}>
                {record.status === RENTALLOCATION_STATUS.ACTIVE
                  ? "Ngưng hoạt động"
                  : "Hoạt động lại"}
              </Menu.Item> */}
            </Menu>
          }
          trigger={["click"]}
        >
          <MoreOutlined />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <Table
        scroll={{ x: "max-content" }}
        dataSource={data}
        loading={loading}
        columns={columns}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: false,
          className: styles.customPagination,
          onChange: (page) => {
            setPagination(prev => ({ ...prev, current: page }));
          },
          itemRender: (page, type, originalElement) => {
            const totalPages = Math.ceil(data.length / 7);
            if (type === "prev") {
              return (
                <button
                  className={styles.paginationButton}
                  disabled={page === 1}
                >
                  « Trước
                </button>
              );
            }
            if (type === "next") {
              return (
                <button
                  className={styles.paginationButton}
                  disabled={page === totalPages}
                >
                  Tiếp »
                </button>
              );
            }
            return originalElement;
          },
        }}
        className={styles.rentalLocationTable}
      />

      <ModalViewDetailRental
        visible={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
        data={selectedRental}
      />
    </>
  );
}

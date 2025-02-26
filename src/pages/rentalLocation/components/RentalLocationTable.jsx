import { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";

import { Dropdown, Menu, Table } from "antd";
import { useNavigate } from "react-router-dom";
import ModalViewDetailRental from "./ModalViewDetailRental";

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
      bgColor: "#FFF3CD",
      color: "#856404",
    },
    [RENTALLOCATION_STATUS.INACTIVE]: {
      label: "Không hoạt động",
      bgColor: "#F8D7DA",
      color: "#721C24",
    },
    [RENTALLOCATION_STATUS.ACTIVE]: {
      label: "Hoạt động",
      bgColor: "#D4EDDA",
      color: "#155724",
    },
    [RENTALLOCATION_STATUS.PAUSE]: {
      label: "Tạm dừng",
      bgColor: "#D1ECF1",
      color: "#0C5460",
    },
  };

  const handleViewDetails = (record) => {
    setSelectedRental(record);
    setIsDetailModalVisible(true);
  };

  // const handleChangeStatus = (record) => {
  //   console.log(
  //     `${
  //       record.status === RENTALLOCATION_STATUS.ACTIVE
  //         ? "Ngưng hoạt động"
  //         : "Kích hoạt lại"
  //     } địa điểm:`,
  //     record.name
  //   );
  // };

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    { title: "Tên địa điểm", dataIndex: "name", key: "name" },
    {
      title: "Người đại diện",
      key: "no",

      render: (_, record) => record?.ownerId?.userId?.fullName,
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
              padding: "5px 10px",
              borderRadius: "5px",
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
      />
      <ModalViewDetailRental
        visible={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
        data={selectedRental}
      />
    </>
  );
}

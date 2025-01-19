import React from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Table, Tag } from "antd";
import { RentalLocationStatusEnum } from "../../../enums/rentalLocationEnums"; // Import enum

export default function RentalLocationTable({ data, loading }) {
  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên địa điểm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Người đại diện",
      dataIndex: "representative",
      key: "representative",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số phòng",
      dataIndex: "roomCount",
      key: "roomCount",
      render: (roomCount) => roomCount || "Không có thông tin",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusData = RentalLocationStatusEnum[status];
        return statusData ? (
          <Tag color={statusData.color}>{statusData.label}</Tag>
        ) : (
          <Tag color="default">Không xác định</Tag>
        );
      },
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={() => handleViewDetails(record)}>
                Xem chi tiết
              </Menu.Item>
              <Menu.Item key="2" onClick={() => handleChangeStatus(record)}>
                Thay đổi trạng thái
              </Menu.Item>
              <Menu.Item key="3" onClick={() => handleDelete(record)}>
                Xóa
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <MoreOutlined />
        </Dropdown>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    console.log("Xem chi tiết:", record);
  };

  const handleChangeStatus = (record) => {
    console.log("Thay đổi trạng thái cho:", record);
  };

  const handleDelete = (record) => {
    console.log("Xóa địa điểm:", record);
  };

  return (
    <Table
      scroll={{ x: "max-content" }}
      dataSource={data}
      loading={loading}
      columns={columns}
      rowKey="id"
    />
  );
}

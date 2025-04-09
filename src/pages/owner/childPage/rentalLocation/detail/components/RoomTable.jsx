import React from "react";
import { Tag, Dropdown, Menu, Button, Tooltip } from "antd";
import { EllipsisOutlined, TagsOutlined } from "@ant-design/icons";

// Enum
const STATUS_MAP = {
  1: { label: "Có Sẵn", color: "green" },
  2: { label: "Đã đặt", color: "blue" },
  3: { label: "Đang dọn dẹp", color: "orange" },
  4: { label: "Đang chuẩn bị", color: "purple" },
  5: { label: "Bảo trì", color: "red" },
  6: { label: "Đóng", color: "gray" },
  7: { label: "Đang sử dụng", color: "cyan" }
};

export default function RoomTableColumns({ onDetailClick, onEditClick }) {
  const handleMenuClick = (key, record) => {
    if (key === "detail") {
      onDetailClick?.(record);
    } else if (key === "edit") {
      onEditClick?.(record);
    }
  };

  const actionMenu = (record) => (
    <Menu onClick={({ key }) => handleMenuClick(key, record)}>
      <Menu.Item key="detail">Xem chi tiết</Menu.Item>
      <Menu.Item key="edit">Sửa</Menu.Item>
    </Menu>
  );

  return [
    {
      title: 'Số phòng',
      dataIndex: 'roomNo',
      key: 'roomNo',
      render: (text) => text || 'N/A',
    },
    {
      title: "Loại phòng",
      dataIndex: ["accommodationTypeId", "name"],
      key: "type",
    },
    {
      title: "Số người tối đa",
      dataIndex: ["accommodationTypeId", "maxPeopleNumber"],
      key: "maxPeople",
    },
    {
      title: "Giá ban đầu",
      dataIndex: ["accommodationTypeId", "basePrice"],
      key: "initialPrice",
      render: (price) => `${price?.toLocaleString() || 0} VND`,
    },
    {
      title: "Giá theo giờ",
      dataIndex: ["accommodationTypeId", "overtimeHourlyPrice"],
      key: "hourlyPrice",
      render: (price) => `${price?.toLocaleString() || 0} VND/giờ`,
    },
    {
      title: "Số lượng dịch vụ",
      dataIndex: ["accommodationTypeId", "serviceIds"],
      key: "serviceCount",
      render: (serviceIds) => {
        const count = serviceIds?.length || 0;
        return (
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '5px', 
              justifyContent: 'flex-start' 
            }}>
              {count} tiện ích
            </div>
        );
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = STATUS_MAP[status] || { label: "Không xác định", color: "default" };
        return (
          <Tag color={statusInfo.color}>
            {statusInfo.label}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Dropdown overlay={() => actionMenu(record)} trigger={["click"]}>
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];
}
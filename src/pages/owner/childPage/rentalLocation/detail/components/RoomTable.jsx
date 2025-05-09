import { Tag, Dropdown } from "antd"
import { MoreOutlined } from "@ant-design/icons"

// Enum
const STATUS_MAP = {
  1: { label: "Có Sẵn", color: "green" },
  2: { label: "Đã đặt", color: "blue" },
  3: { label: "Đang dọn dẹp", color: "orange" },
  4: { label: "Đang chuẩn bị", color: "purple" },
  5: { label: "Bảo trì", color: "red" },
  6: { label: "Đóng", color: "gray" },
  7: { label: "Đang sử dụng", color: "cyan" },
}

export default function RoomTableColumns({ onDetailClick, onEditClick }) {
  const handleMenuClick = (key, record) => {
    if (key === "detail") {
      onDetailClick?.(record)
    } else if (key === "edit") {
      onEditClick?.(record)
    }
  }

  const menuItems = [
    {
      key: "detail",
      label: "Xem chi tiết",
      onClick: (record) => {
        onDetailClick?.(record)
      },
    },
    {
      key: "edit",
      label: "Sửa",
      onClick: (record) => {
        onEditClick?.(record)
      },
    },
  ]

  return [
    {
      title: "Số phòng",
      dataIndex: "roomNo",
      key: "roomNo",
      render: (text) => text || "N/A",
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
        const count = serviceIds?.length || 0
        return (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "5px",
              justifyContent: "flex-start",
            }}
          >
            {count} tiện ích
          </div>
        )
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = STATUS_MAP[status] || { label: "Không xác định", color: "default" }
        return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
      },
    },
    {
      title: "",
      key: "operation",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: menuItems.map((item) => ({
              ...item,
              onClick: () => item.onClick(record),
            })),
          }}
        >
          <MoreOutlined onClick={(e) => e.preventDefault()} />
        </Dropdown>
      ),
    },
  ]
}

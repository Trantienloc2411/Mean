import { Tag, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import styles from "./RoomTable.module.scss";

// Enum
const STATUS_MAP = {
  1: { label: "Có Sẵn", color: "green" },
  2: { label: "Đã đặt", color: "blue" },
  3: { label: "Đang dọn dẹp", color: "orange" },
  4: { label: "Đang chuẩn bị", color: "purple" },
  5: { label: "Bảo trì", color: "red" },
  6: { label: "Đóng", color: "gray" },
  7: { label: "Đang sử dụng", color: "cyan" },
};

export default function RoomTableColumns({
  onDetailClick,
  onEditClick,
  canEdit,
}) {
  const handleMenuClick = (key, record) => {
    if (key === "detail") {
      onDetailClick?.(record);
    } else if (key === "edit") {
      onEditClick?.(record);
    }
  };

  const menuItems = [
    {
      key: "detail",
      label: "Xem chi tiết",
      onClick: (record) => {
        onDetailClick?.(record);
      },
    },
    ...(canEdit
      ? [
          {
            key: "edit",
            label: "Sửa",
            onClick: (record) => {
              onEditClick?.(record);
            },
          },
        ]
      : []),
  ];

  return [
    {
      title: "Số phòng",
      dataIndex: "roomNo",
      key: "roomNo",
      render: (text) => (
        <div className={styles.roomNumber}>
          {text || "N/A"}
        </div>
      ),
    },
    {
      title: "Loại phòng",
      dataIndex: ["accommodationTypeId", "name"],
      key: "type",
      render: (text) => (
        <div className={styles.roomType}>
          {text}
        </div>
      ),
    },
    {
      title: "Số người tối đa",
      dataIndex: ["accommodationTypeId", "maxPeopleNumber"],
      key: "maxPeople",
      render: (number) => (
        <div className={styles.maxPeople}>
          {number}
        </div>
      ),
    },
    {
      title: "Giá ban đầu",
      dataIndex: ["accommodationTypeId", "basePrice"],
      key: "initialPrice",
      render: (price) => (
        <div className={styles.price}>
          {`${price?.toLocaleString() || 0} VND`}
        </div>
      ),
    },
    {
      title: "Giá theo giờ",
      dataIndex: ["accommodationTypeId", "overtimeHourlyPrice"],
      key: "hourlyPrice",
      render: (price) => (
        <div className={styles.price}>
          {`${price?.toLocaleString() || 0} VND/giờ`}
        </div>
      ),
    },
    {
      title: "Số lượng dịch vụ",
      dataIndex: ["accommodationTypeId", "serviceIds"],
      key: "serviceCount",
      render: (serviceIds) => {
        const count = serviceIds?.length || 0;
        return (
          <div className={styles.serviceCount}>
            {count} dịch vụ
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = STATUS_MAP[status] || {
          label: "Không xác định",
          color: "default",
        };
        return (
          <Tag color={statusInfo.color} className={styles.statusTag}>
            {statusInfo.label}
          </Tag>
        );
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
          className={styles.actionDropdown}
        >
          <MoreOutlined className={styles.actionIcon} onClick={(e) => e.preventDefault()} />
        </Dropdown>
      ),
    },
  ];
}

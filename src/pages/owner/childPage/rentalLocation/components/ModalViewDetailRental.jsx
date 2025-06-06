import { Modal, Descriptions, Tag } from "antd";
import styles from "./RentalLocationTable.module.scss";
import { Typography } from "antd";
import { FaMapLocationDot } from "react-icons/fa6";
const { Text } = Typography;
const RENTALLOCATION_STATUS = {
  PENDING: 1,
  INACTIVE: 2,
  ACTIVE: 3,
  PAUSE: 4,
  DELETED: 5,
  NEEDS_UPDATE: 6,
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
  [RENTALLOCATION_STATUS.DELETED]: {
    label: "Đã xóa",
    bgColor: "#F8D7DA",
    color: "#721C24",
  },
  [RENTALLOCATION_STATUS.NEEDS_UPDATE]: {
    label: "Cần cập nhật",
    bgColor: "#FFF3CD",
    color: "#856404",
  },
};

export default function ModalViewDetailRental({ visible, onClose, data }) {
  console.log(data);

  if (!data) return null;
  const statusInfo = STATUS_LABELS[data.status] || {
    label: "Không xác định",
    bgColor: "#E0E0E0",
    color: "#000000",
  };
  // const handleViewOwner = () => {
  //   navigate(`/owner/${data?.ownerId?.userId?.id}/dashboard`);
  // };
  const handleViewMap = () => {
    if (data.latitude && data.longitude) {
      window.open(
        `https://www.google.com/maps?q=${data.latitude},${data.longitude}`,
        "_blank"
      );
    } else {
      const address = encodeURIComponent(data.address);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${address}`,
        "_blank"
      );
    }
  };
  return (
    <Modal
      title={`Chi tiết - ${data.name}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Tên địa điểm">{data.name}</Descriptions.Item>
        {/* <Descriptions.Item label="Người đại diện">
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Text>{data?.ownerId?.userId?.fullName || "Chưa cập nhật"}</Text>
            <span
              className={styles.iconViewDetail}
              onClick={() => handleViewOwner()}
            >
              <FaEye />
            </span>
          </div>
        </Descriptions.Item> */}
        <Descriptions.Item label="Địa chỉ">
          <div style={{ display: "flex ", gap: 10, alignItems: "center" }}>
            <Text className={styles.addressDetail}>
              {data?.address} {data?.ward} {data?.district} {data?.city}
            </Text>
            <span
              className={styles.iconViewDetail}
              onClick={() => handleViewMap()}
            >
              <FaMapLocationDot />
            </span>
          </div>
        </Descriptions.Item>
        {/* <Descriptions.Item label="Số phòng">
          {data.roomCount || "Không có thông tin"}
        </Descriptions.Item> */}
        <Descriptions.Item label="Trạng thái">
          <Tag
            style={{
              backgroundColor: statusInfo.bgColor,
              color: statusInfo.color,
            }}
          >
            {statusInfo.label}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Giờ hoạt động">
          {`${data.openHour} - ${data.closeHour}`}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          <span className={styles.descriptionText}>
            {data.description || "Không có mô tả"}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {data.createdAt || "Không có mô tả"}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian cập nhật">
          {data.updatedAt || "Không có mô tả"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

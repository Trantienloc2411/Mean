import { Modal, Descriptions, Tag } from "antd";
import { useNavigate } from "react-router-dom";

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

export default function ModalViewDetailRental({ visible, onClose, data }) {
  const navigate = useNavigate();
  if (!data) return null;
  const statusInfo = STATUS_LABELS[data.status] || {
    label: "Không xác định",
    bgColor: "#E0E0E0",
    color: "#000000",
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
        <Descriptions.Item label="Người đại diện">
          <div
            onClick={() =>
              navigate(`/owner/${data?.ownerId?.userId?.id}/dashboard`)
            }
            style={{ cursor: "pointer" }}
          >
            {data?.ownerId?.userId?.fullName || "Chưa cập nhật"}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{data.address}</Descriptions.Item>
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
          {data.description || "Không có mô tả"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

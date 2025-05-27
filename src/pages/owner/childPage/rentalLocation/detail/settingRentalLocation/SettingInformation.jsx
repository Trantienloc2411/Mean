import { useState } from "react";
import { Button, message, Tag, Typography, Col, Divider } from "antd";
import { EditOutlined, EnvironmentOutlined } from "@ant-design/icons";
import EditRentalLocationInformationModal from "./EditRentalLocationInformationModal";
import EditAddressModal from "./EditAddressModal";
import { Card } from "antd";
import LocationMap from "../components/LocationMap";

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

export default function SettingInformation({ rentalData, canEdit }) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [data, setData] = useState(rentalData);

  const handleViewOnMap = () => {
    if (data.latitude && data.longitude) {
      const mapUrl = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
      window.open(mapUrl, "_blank");
    } else {
      message.warning("Không có tọa độ hợp lệ để xem trên Google Maps.");
    }
  };

  const handleUpdate = (updatedData) => {
    setData(updatedData);
  };

  return (
    <div style={{ borderRadius: 12, padding: 0 }}>
      <Card
        title="Thông tin"
        extra={
          canEdit && <EditOutlined onClick={() => setIsInfoModalOpen(true)} />
        }
      >
        <div>
          <Text strong style={{ fontSize: 22 }}>
            {data.name}
          </Text>
        </div>
        <div>
          <Text strong>Thời gian hoạt động:</Text>

          <Text>
            {data.openHour} - {data.closeHour}
          </Text>
        </div>
        <div>
          <Text strong>Hoạt động qua đêm: </Text>

          <Text>{data.isOverNight ? "Có" : "Không"}</Text>
        </div>
        <div>
          <Text strong>Trạng thái:</Text>
          <Tag
            style={{
              background: STATUS_LABELS[data.status]?.bgColor,
              color: STATUS_LABELS[data.status]?.color,
              marginLeft: 8,
            }}
          >
            {STATUS_LABELS[data.status]?.label || "Không xác định"}
          </Tag>
        </div>
        <div>
          <Text strong>Mô tả:</Text> <Text>{data.description}</Text>
        </div>
      </Card>
      <br />
      <Card
        title="Địa chỉ"
        extra={
          canEdit && <EditOutlined onClick={() => setIsMapModalOpen(true)} />
        }
      >
        <Col span={24}>
          <Text strong>Địa chỉ:</Text>{" "}
          <Text>
            {data.address}, {data.ward}, {data.district}, {data.city}
          </Text>
        </Col>
        <Col span={24}>
          <Text strong>Vị trí bản đồ:</Text>{" "}
          <Text>
            {data.latitude},{data.longitude}
          </Text>
        </Col>
        <LocationMap latitude={data?.latitude} longitude={data?.longitude} />
      </Card>
      <Divider />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {canEdit && (
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => setIsInfoModalOpen(true)}
          >
            Chỉnh sửa thông tin
          </Button>
        )}
        {canEdit && (
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => setIsMapModalOpen(true)}
          >
            Chỉnh sửa vị trí
          </Button>
        )}

        <Button
          type="primary"
          icon={<EnvironmentOutlined />}
          onClick={handleViewOnMap}
        >
          Xem trên Google Maps
        </Button>
      </div>
      <EditRentalLocationInformationModal
        visible={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        rentalData={data}
        onUpdate={handleUpdate}
      />
      <EditAddressModal
        visible={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        addressData={data}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

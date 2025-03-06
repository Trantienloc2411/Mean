import React, { useState } from "react";
import {
  Button,
  message,
  Tag,
  Card,
  Typography,
  Row,
  Col,
  Divider,
} from "antd";
import { EditOutlined, EnvironmentOutlined } from "@ant-design/icons";
import EditRentalLocationModal from "./EditRentalLocationModal";
import { useUpdateRentalLocationMutation } from "../../../../../../redux/services/rentalApi";
import { Flex } from "antd";

const { Title, Text } = Typography;

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

export default function SettingInformation({ rentalData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(rentalData);
  const { updateRentalLocation } = useUpdateRentalLocationMutation();
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
  const statusInfo = STATUS_LABELS[data.status] || {};

  return (
    <div
      style={{
        borderRadius: 12,
        padding: 0,
      }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        Thông tin địa điểm
      </Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Text strong style={{ fontSize: 26 }}>
              {data.name}
            </Text>
            <span
              style={{
                backgroundColor: statusInfo.bgColor,
                color: statusInfo.color,
                padding: "4px 12px",
                borderRadius: "16px",
                fontSize: "12px",
              }}
            >
              {statusInfo.label || "Không xác định"}
            </span>
          </div>
        </Col>
        <Col span={24}>
          <Text strong>Địa chỉ:</Text>{" "}
          <Text>
            {data.address}, {data.ward}, {data.district}, {data.city}
          </Text>
        </Col>
        <Col span={24}>
          <Text strong>Thời gian hoạt động:</Text>{" "}
          <Text>
            {data.openHour} - {data.closeHour}
          </Text>
        </Col>

        <Col span={12}>
          <Text strong>Hoạt động qua đêm: </Text>
          <Text>{data.isOverNight ? "Có" : "Không"}</Text>
        </Col>

        <Col span={24}>
          <Text strong>Vị trí bản đồ:</Text>{" "}
          <Text>
            {data.latitude},{data.longitude}
          </Text>
        </Col>
        <Col span={24}>
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
        </Col>
        <Col span={24}>
          <Text strong>Mô tả:</Text> <Text>{data.description}</Text>
        </Col>
      </Row>
      <Divider />
      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
        <Button
          type="default"
          icon={<EditOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Chỉnh sửa
        </Button>
        <Button
          type="primary"
          icon={<EnvironmentOutlined />}
          onClick={handleViewOnMap}
        >
          Xem trên Google Maps
        </Button>
      </div>
      <EditRentalLocationModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rentalData={data}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

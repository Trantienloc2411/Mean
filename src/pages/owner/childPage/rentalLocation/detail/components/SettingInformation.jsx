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

const { Title, Text } = Typography;

const RENTALLOCATION_STATUS = {
  PENDING: 1,
  INACTIVE: 2,
  ACTIVE: 3,
  PAUSE: 4,
};

const STATUS_LABELS = {
  [RENTALLOCATION_STATUS.PENDING]: {
    label: "Chờ duyệt",
    color: "#856404",
    bgColor: "#FFF3CD",
  },
  [RENTALLOCATION_STATUS.INACTIVE]: {
    label: "Không hoạt động",
    color: "#721C24",
    bgColor: "#F8D7DA",
  },
  [RENTALLOCATION_STATUS.ACTIVE]: {
    label: "Hoạt động",
    color: "#155724",
    bgColor: "#D4EDDA",
  },
  [RENTALLOCATION_STATUS.PAUSE]: {
    label: "Tạm dừng",
    color: "#0C5460",
    bgColor: "#D1ECF1",
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

  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        padding: 20,
      }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        Thông tin địa điểm
      </Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text strong>Tên:</Text> <Text>{data.name}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Địa chỉ:</Text> <Text>{data.address}</Text>
        </Col>
        <Col span={24}>
          <Text strong>Mô tả:</Text> <Text>{data.description}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Vĩ độ:</Text> <Text>{data.latitude}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Kinh độ:</Text> <Text>{data.longitude}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Giờ mở cửa:</Text> <Text>{data.openHour}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Giờ đóng cửa:</Text> <Text>{data.closeHour}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Qua đêm:</Text>{" "}
          <Text>{data.isOverNight ? "Có" : "Không"}</Text>
        </Col>
        <Col span={12}>
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
    </Card>
  );
}

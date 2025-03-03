import { Tag } from "antd";
import { Flex } from "antd";
import { Row, Col, Typography } from "antd"; // Sử dụng Row và Col cho layout
import { FaLocationDot } from "react-icons/fa6";
import LocationMap from "./LocationMap";
import ImageGallery from "./ImageGallery";
import { FieldTimeOutlined } from "@ant-design/icons";
import { Grid } from "antd";

const { Title, Text } = Typography;

export default function TitleAndDescription({ rentalData }) {
  const DEFAULT_IMAGE =
    "https://aqgqtxnbmgeknaojqagx.supabase.co/storage/v1/object/public/Sep-booking//No_Image_Available.jpg";
  console.log(rentalData);
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
  return (
    <div>
      <Flex gap={10} align="center">
        <h1 style={{ fontSize: 28, margin: 0, fontWeight: 700 }}>
          {rentalData?.name || "Rental Location Detail"}
        </h1>
        <Tag
          style={{
            background: STATUS_LABELS[rentalData.status]?.bgColor || "#E0E0E0",
            color: STATUS_LABELS[rentalData.status]?.color || "#333",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            padding: "2px 10px",
          }}
        >
          {STATUS_LABELS[rentalData.status]?.label || "Không xác định"}
        </Tag>
      </Flex>
      <Flex align="center" gap={5} style={{}}>
        <FaLocationDot />
        <p style={{ margin: 0 }}>{rentalData?.address || "Unknown location"}</p>
      </Flex>
      <Flex gap={5} style={{ marginTop: 5 }}>
        <FieldTimeOutlined />
        {rentalData?.openHour || "Không có giờ mở cửa"}
        {" - "}
        {rentalData?.closeHour || "Không có giờ đóng cửa"}
        {rentalData?.isOverNight ? (
          <Tag color="blue">Hoạt động qua đêm</Tag>
        ) : null}
      </Flex>
      <div style={{ marginTop: 10 }}>
        <Row>
          <Col span={12}>
            <Title level={4} style={{ margin: 0, fontSize: "16px" }}>
              Mô tả:
            </Title>
            <Text style={{ fontSize: "12px", color: "#333" }}>
              {rentalData?.description || "Không có mô tả"}
            </Text>
          </Col>
          <Col span={12}>
            {/* <ImageGallery images={rentalData?.image || []} /> */}
            <div style={{ textAlign: "center" }}>
              <img
                src={rentalData?.image?.[0] || DEFAULT_IMAGE}
                alt={rentalData.name}
                onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  maxHeight: "300px",
                  objectFit: "cover",
                  height: "auto",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Title
          level={3}
          style={{ margin: 0, fontSize: "23px", marginBottom: 10 }}
        >
          Địa chỉ:
        </Title>
        <Col span={24}>
          <LocationMap
            latitude={rentalData?.latitude}
            longitude={rentalData?.longitude}
          />
        </Col>
      </Row>
    </div>
  );
}

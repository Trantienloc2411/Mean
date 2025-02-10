import { Row, Col, Typography } from "antd"; // Sử dụng Row và Col cho layout

const { Title, Text } = Typography;

export default function TitleAndDescription({ item }) {
  return (
    <Row
      gutter={[16, 16]} // Khoảng cách giữa các cột
      style={{
        marginBottom: "20px",
        alignItems: "start", // Căn giữa theo chiều dọc
      }}
    >
      {/* Cột Mô tả */}
      <Col xs={24} sm={24} md={12} lg={12}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Mô tả
          </Title>
          <Text style={{ fontSize: "16px", color: "#555" }}>
            {item?.description || "Không có mô tả"}
          </Text>
        </div>
      </Col>

      {/* Cột Hình ảnh */}
      <Col xs={24} sm={24} md={12} lg={12}>
        <div style={{ textAlign: "center" }}>
          <img
            src={item?.image[0] || "https://intero.vn/wp-content/uploads/No_Image_Available_thum_488.jpg"}
            alt="Rental Location"
            style={{
              width: "100%",
              maxWidth: "400px", // Giới hạn kích thước tối đa
              height: "auto", // Giữ tỉ lệ ảnh
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
      </Col>
    </Row>
  );
}

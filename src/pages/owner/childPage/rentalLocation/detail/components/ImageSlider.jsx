import React from "react";
import { Image, Row, Col } from "antd";

const ImageGallery = ({ images = [] }) => {
  const validImages = Array.isArray(images) ? images : [];

  if (validImages.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Không có ảnh nào để hiển thị
      </div>
    );
  }

  const imageStyle = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: 20,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    // padding: "20px",
  };

  return (
    <div style={containerStyle}>
      <Image.PreviewGroup>
        <Row gutter={[16, 16]} justify="start">
          {validImages.map((img, index) => (
            <Col key={index} xs={24} sm={12} md={6} lg={4}>
              <Image
                src={img}
                alt={`Gallery Image ${index + 1}`}
                style={imageStyle}
                preview={{
                  mask: (
                    <div
                      style={{
                        color: "white",
                        fontSize: "16px",
                      }}
                    >
                      Xem chi tiết
                    </div>
                  ),
                }}
              />
            </Col>
          ))}
        </Row>
      </Image.PreviewGroup>
    </div>
  );
};

export default ImageGallery;

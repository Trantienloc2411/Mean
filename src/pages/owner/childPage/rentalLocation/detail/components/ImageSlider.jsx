import { useState } from "react";
import { Image, Row, Col, Button } from "antd";
import ImageUploadModal from "./ImageUploadModal";
import { useUpdateRentalLocationMutation } from "../../../../../../redux/services/rentalApi";

const ImageSlider = ({ images = [], setImages, rentalData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [updateRentalLocation, { isLoading: isUpdating }] =
    useUpdateRentalLocationMutation();
  const validImages = Array.isArray(images) ? images : [];
  if (validImages.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Không có ảnh nào để hiển thị
        <br />
        <Button
          type="primary"
          onClick={() => setModalOpen(true)}
          style={{ marginTop: 10 }}
        >
          Thêm ảnh
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <Button
        type="primary"
        onClick={() => setModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Thêm ảnh
      </Button>
      <Image.PreviewGroup>
        <Row gutter={[16, 16]} justify="start">
          {validImages.map((img, index) => (
            <Col key={index} xs={24} sm={12} md={6} lg={4}>
              <Image
                src={img}
                alt={`Gallery Image ${index + 1}`}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: 20,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease",
                }}
                preview={{
                  mask: (
                    <div style={{ color: "white", fontSize: "16px" }}>Xem</div>
                  ),
                }}
              />
            </Col>
          ))}
        </Row>
      </Image.PreviewGroup>

      <ImageUploadModal
        rentalData={rentalData}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default ImageSlider;

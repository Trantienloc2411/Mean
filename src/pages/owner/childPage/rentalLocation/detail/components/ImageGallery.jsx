import React from "react";
import { Row, Col } from "antd";

const DEFAULT_IMAGE =
  "https://aqgqtxnbmgeknaojqagx.supabase.co/storage/v1/object/public/Sep-booking//No_Image_Available.jpg";

export default function ImageGallery({ images = [] }) {
  // Nếu không có ảnh, có thể hiển thị ảnh mặc định hoặc nội dung tùy ý
  if (!images.length) {
    return (
      <div style={{ textAlign: "center" }}>
        <img
          src={DEFAULT_IMAGE}
          alt="Default"
          style={{ width: "300px", borderRadius: "8px" }}
        />
        <p>Không có hình ảnh</p>
      </div>
    );
  }

  // Ảnh đầu tiên sẽ là ảnh lớn bên trái
  const mainImage = images[0];
  // Các ảnh còn lại
  const subImages = images.slice(1);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <div
          style={{
            position: "relative",
            height: "100%",
            overflow: "hidden",
            borderRadius: "8px",
          }}
        >
          <img
            src={mainImage || DEFAULT_IMAGE}
            alt="Main"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
            }}
            onError={(e) => (e.target.src = DEFAULT_IMAGE)}
          />
        </div>
      </Col>

      <Col xs={24} md={12}>
        <Row gutter={[8, 8]}>
          {subImages.slice(0, 4).map((img, idx) => {
            // Nếu ảnh cuối cùng và vẫn còn nhiều ảnh, hiển thị "+N ảnh"
            if (idx === 3 && subImages.length > 4) {
              const remaining = subImages.length - 4;
              return (
                <Col span={12} key={idx}>
                  <div
                    style={{
                      position: "relative",
                      height: "100%",
                      overflow: "hidden",
                      borderRadius: "8px",
                    }}
                  >
                    <img
                      src={img || DEFAULT_IMAGE}
                      alt={`Sub ${idx}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(0.6)",
                      }}
                      onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "20px",
                        color: "#fff",
                        fontWeight: "bold",
                        backgroundColor: "rgba(0,0,0,0.2)",
                      }}
                    >
                      +{remaining} ảnh
                    </div>
                  </div>
                </Col>
              );
            }

            // Ngược lại, hiển thị ảnh bình thường
            return (
              <Col span={12} key={idx}>
                <div
                  style={{
                    position: "relative",
                    height: "100%",
                    overflow: "hidden",
                    borderRadius: "8px",
                  }}
                >
                  <img
                    src={img || DEFAULT_IMAGE}
                    alt={`Sub ${idx}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                  />
                </div>
              </Col>
            );
          })}
        </Row>
      </Col>
    </Row>
  );
}

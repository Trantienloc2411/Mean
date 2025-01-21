import { Flex } from "antd";

export default function RentalLocationList({ locations }) {
  return (
    <div style={{ flex: 7 }}>
      <h2>Danh sách địa điểm</h2>
      <div>
        {locations.map((item, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <Flex style={{ gap: "20px", alignItems: "center" }}>
              <div>
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <div>
                <h3>{item.name}</h3>
                <p>{item.address}</p>
                <p>
                  <strong>Giờ mở cửa:</strong> {item.openHours}
                </p>
              </div>
            </Flex>
          </div>
        ))}
      </div>
    </div>
  );
}

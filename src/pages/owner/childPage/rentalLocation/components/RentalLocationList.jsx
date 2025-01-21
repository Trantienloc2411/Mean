import { Tag, Button } from "antd";
import { Flex } from "antd";
import { RentalLocationStatusEnum } from "../../../../../enums/rentalLocationEnums"; // Import enums
import { IoLocationOutline } from "react-icons/io5";

export default function RentalLocationList({ locations }) {
  return (
    <div style={{ flex: 8 }}>
      <h2>Danh sách địa điểm</h2>
      <div>
        {locations.map((item, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <Flex gap={20} align="center" justify="space-between">
              <Flex gap={20} align="center">
                <div>
                  <img
                    src={
                      item.image ||
                      "https://intero.vn/wp-content/uploads/No_Image_Available_thum_488.jpg"
                    }
                    alt={item.name}
                    style={{
                      width: "200px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
                <Flex gap={10} vertical>
                  <Flex align="center" gap={10}>
                    <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
                      {item.name}
                    </p>
                    <Tag
                      style={{
                        background:
                          RentalLocationStatusEnum[item.status]?.color,
                        color: "#fff",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "2px 10px",
                      }}
                    >
                      {RentalLocationStatusEnum[item.status]?.label ||
                        "Không xác định"}
                    </Tag>
                  </Flex>
                  <Flex>
                    <IoLocationOutline style={{ fontSize: 16 }} />
                    <p style={{ margin: 0 }}>{item.address}</p>
                  </Flex>
                  <p style={{ margin: 0 }}>
                    <strong>Rate: 4.8 (ngôi sao)</strong> {item.openHours}
                  </p>
                </Flex>
              </Flex>
              <Button
                type="primary"
                onClick={() => alert(`Viewing details of ${item.name}`)}
              >
                View Details
              </Button>
            </Flex>
          </div>
        ))}
      </div>
    </div>
  );
}

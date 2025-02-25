import { Tag, Button } from "antd";
import { Flex } from "antd";
import { RentalLocationStatusEnum } from "../../../../../enums/rentalLocationEnums"; // Import enums
import { IoLocationOutline } from "react-icons/io5";
import { StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";

export default function RentalLocationList({ locations }) {
  const navigate = useNavigate();
  
  return (
    <div style={{ flex: 8 }}>
      <Flex justify="space-between">
        <h2>Danh sách địa điểm</h2>
        <Button
          onClick={() => navigate("/rental-location/create")}
          icon={<IoIosAdd />}
        >
          Thêm địa điểm mới
        </Button>
      </Flex>
      <div>
        {locations.map((item, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <Flex gap={20} justify="space-between">
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
                      height: "120px",
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
                        RentalLocationStatusEnum[item.status]?.bgColor,
                        color: RentalLocationStatusEnum[item.status]?.color,
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
                  <Flex gap={10} align="center">
                    <StarFilled style={{ color: "#ffc907" }} />
                    <p style={{ margin: 0 }}>4.8 (500 đánh giá) </p>
                  </Flex>
                </Flex>
              </Flex>
              <Flex justify="flex-end" align="flex-end">
                <Button
                  type="primary"
                  onClick={() => navigate(`/rental-location/${item?.id}`)}
                >
                  View Details
                </Button>
              </Flex>
            </Flex>
          </div>
        ))}
      </div>
    </div>
  );
}

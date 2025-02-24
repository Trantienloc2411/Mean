import { Tag, Button, Pagination } from "antd";
import { Flex } from "antd";
import { IoLocationOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { useState, useMemo } from "react";

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

const DEFAULT_IMAGE =
  "https://aqgqtxnbmgeknaojqagx.supabase.co/storage/v1/object/public/Sep-booking//No_Image_Available.jpg";

export default function RentalLocationList({ locations }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Tính toán danh sách địa điểm hiển thị
  const paginatedLocations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return locations.slice(startIndex, startIndex + pageSize);
  }, [locations, currentPage]);

  return (
    <div style={{ flex: 8, padding: "0 20px 20px" }}>
      <div>
        {paginatedLocations.map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Flex
              gap={20}
              justify="space-between"
              align="center"
              style={{ flexWrap: "wrap" }}
            >
              <img
                src={item.image?.[0] || DEFAULT_IMAGE}
                alt={item.name}
                onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                style={{
                  width: "100%",
                  maxWidth: "180px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  margin: "auto",
                }}
              />
              <Flex vertical style={{ flex: 1, minWidth: "250px", gap: 6 }}>
                <Flex align="center" gap={10} wrap="wrap">
                  <p style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
                    {item.name}
                  </p>
                  <Tag
                    style={{
                      background:
                        STATUS_LABELS[item.status]?.bgColor || "#E0E0E0",
                      color: STATUS_LABELS[item.status]?.color || "#333",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "2px 10px",
                    }}
                  >
                    {STATUS_LABELS[item.status]?.label || "Không xác định"}
                  </Tag>
                </Flex>
                <Flex align="center" gap={10}>
                  <IoLocationOutline style={{ fontSize: 16 }} />
                  <p style={{ margin: 0, color: "#555" }}>{item.address}</p>
                </Flex>
                <Flex gap={10} align="center">
                  <Tag
                    style={{
                      borderRadius: 20,
                      background: "#407cff",
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  >
                    {item.openHour} - {item.closeHour}
                  </Tag>
                </Flex>
              </Flex>
              <Button
                type="default"
                style={{
                  alignSelf: "center",
                  width: "100%",
                  maxWidth: "120px",
                }}
                onClick={() => navigate(`/rental-location/${item?.id}`)}
              >
                Xem chi tiết
              </Button>
            </Flex>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Flex justify="center" style={{ marginTop: 20 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={locations.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </Flex>
    </div>
  );
}

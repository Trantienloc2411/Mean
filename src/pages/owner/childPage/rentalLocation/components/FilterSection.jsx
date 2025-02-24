
import { Input, Checkbox, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;

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

export default function FilterSection({
  searchValue,
  filters,
  onSearch,
  onFilterChange,
}) {
  return (
    <div
      style={{
        flex: 2,
        background: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
        minHeight: "80vh",
      }}
    >
      <Title level={4}>Bộ lọc</Title>

      {/* Ô tìm kiếm */}
      <Input
        prefix={<SearchOutlined />}
        placeholder="Tìm kiếm theo tên địa điểm"
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
        style={{ marginBottom: "20px" }}
      />

      {/* Bộ lọc trạng thái */}
      <h3>Trạng thái</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {Object.entries(STATUS_LABELS).map(([key, { label }]) => {
          const status = Number(key);
          return (
            <Checkbox
              key={status}
              checked={filters.statuses.includes(status)}
              onChange={() => onFilterChange(status)}
            >
              {label}
            </Checkbox>
          );
        })}
      </div>
    </div>
  );
}

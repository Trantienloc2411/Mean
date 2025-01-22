import { Input, Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { RentalLocationStatusEnum } from "../../../../../enums/rentalLocationEnums"; // Import enums

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
      <h2>Bộ lọc</h2>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Tìm kiếm theo tên địa điểm"
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <h3>Trạng thái</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {Object.entries(RentalLocationStatusEnum).map(([key, { label }]) => (
          <Checkbox
            key={key}
            checked={filters.statuses.includes(key)}
            onChange={() => onFilterChange(key)}
          >
            {label}
          </Checkbox>
        ))}
      </div>
    </div>
  );
}

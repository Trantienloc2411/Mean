import { Input, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function FilterSection({
  searchValue,
  filters,
  onSearch,
  onFilterChange,
}) {
  return (
    <div
      style={{
        flex: 3,
        background: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {["Active", "Paused", "Locked"].map((status) => (
          <Tag.CheckableTag
            key={status}
            checked={filters.statuses.includes(status)}
            onChange={() => onFilterChange(status)}
          >
            {status}
          </Tag.CheckableTag>
        ))}
      </div>
    </div>
  );
}

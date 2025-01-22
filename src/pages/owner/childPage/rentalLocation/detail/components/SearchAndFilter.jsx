import { Input, Select } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function SearchAndFilter({ onSearch, onFilterChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ display: "flex", gap: "16px" }}>
        {/* Ô tìm kiếm */}
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm theo tên phòng"
          style={{ width: 300 }}
          onChange={(e) => onSearch(e.target.value)}
        />

        {/* Bộ lọc trạng thái */}
        <Select
          prefix={<FilterOutlined />}
          defaultValue="all"
          onChange={onFilterChange}
          style={{ width: 150 }}
        >
          <Option value="all">Tất cả</Option>
          <Option value="active">Hoạt động</Option>
          <Option value="rented">Đã thuê</Option>
          <Option value="inactive">Không hoạt động</Option>
        </Select>
      </div>
    </div>
  );
}

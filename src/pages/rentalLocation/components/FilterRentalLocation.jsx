import { Dropdown, Menu, Button, Checkbox, Flex } from "antd";
import { DownOutlined, FilterOutlined } from "@ant-design/icons";

// Đồng bộ với RENTALLOCATION_STATUS
const statusOptions = [
  { value: 1, label: "Chờ duyệt" }, // PENDING
  { value: 2, label: "Không hoạt động" }, // INACTIVE
  { value: 3, label: "Hoạt động" }, // ACTIVE
  { value: 4, label: "Tạm dừng" }, // PAUSE
  { value: 5, label: "Đã xóa" }, // DELETED
  { value: 6, label: "Cần cập nhật" }, // NEEDS_UPDATE
];

export default function FilterRentalLocation({
  filters,
  onFilterChange,
  onReset,
  onApplyFilters,
}) {
  const handleStatusChange = (checked, value) => {
    const updatedValues = checked
      ? [...filters.statuses, value]
      : filters.statuses.filter((item) => item !== value);
    onFilterChange("statuses", updatedValues);
  };

  const menu = (
    <Menu style={{ padding: 16, minWidth: 250 }}>
      <Menu.ItemGroup title="Trạng thái">
        <Flex vertical>
          {statusOptions.map(({ value, label }) => (
            <Checkbox
              key={value}
              checked={filters.statuses.includes(value)}
              onChange={(e) => handleStatusChange(e.target.checked, value)}
            >
              {label}
            </Checkbox>
          ))}
        </Flex>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.Item>
        <Button onClick={onReset} style={{ marginRight: 8 }}>
          Reset
        </Button>
        <Button type="primary" onClick={onApplyFilters}>
          Áp dụng
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button icon={<FilterOutlined />}>
        Lọc
      </Button>
    </Dropdown>
  );
}

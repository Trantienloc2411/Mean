import { Dropdown, Menu, Button, Checkbox, Flex } from "antd";
import { DownOutlined } from "@ant-design/icons";

const statusOptions = [
  { value: "Active", label: "Hoạt động" },
  { value: "Paused", label: "Không hoạt động" },
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
      <Button>
        Bộ lọc <DownOutlined />
      </Button>
    </Dropdown>
  );
}

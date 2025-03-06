import { Dropdown, Menu, Button, Checkbox, Flex } from "antd";
import { DownOutlined } from "@ant-design/icons";

const RENTALLOCATION_STATUS = {
  PENDING: 1,
  INACTIVE: 2,
  ACTIVE: 3,
  PAUSE: 4,
  DELETED: 5,
  NEEDS_UPDATE: 6,
};

const STATUS_LABELS = {
  [RENTALLOCATION_STATUS.PENDING]: {
    label: "Chờ duyệt",
    bgColor: "#e2e3e5",
    color: "#6c757d",
  },
  [RENTALLOCATION_STATUS.INACTIVE]: {
    label: "Không hoạt động",
    bgColor: "#FEECEB",
    color: "#F36960",
  },
  [RENTALLOCATION_STATUS.ACTIVE]: {
    label: "Hoạt động",
    bgColor: "#E7F8F0",
    color: "#41C588",
  },
  [RENTALLOCATION_STATUS.PAUSE]: {
    label: "Tạm dừng",
    bgColor: "#FEF4E6",
    color: "#F9A63A",
  },
  [RENTALLOCATION_STATUS.DELETED]: {
    label: "Đã xóa",
    bgColor: "#F8D7DA",
    color: "#721C24",
  },
  [RENTALLOCATION_STATUS.NEEDS_UPDATE]: {
    label: "Cần cập nhật",
    bgColor: "#FFF3CD",
    color: "#856404",
  },
};

const statusOptions = Object.entries(STATUS_LABELS).map(([key, value]) => ({
  value: Number(key),
  label: value.label,
}));

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

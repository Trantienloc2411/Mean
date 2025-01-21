import { Dropdown, Menu, Button, Tag } from "antd";
import { DownOutlined } from "@ant-design/icons";
const { CheckableTag } = Tag;
import { RentalLocationStatusEnum } from "../../../enums/rentalLocationEnums"; // Import enums
import { Checkbox } from "antd";
import { Flex } from "antd";

// Helper function to render CheckableTags for any enum
const renderTags = (enumData, filters, key, onFilterChange) =>
  Object.entries(enumData).map(([value, { label }]) => (
    <Checkbox
      style={
        {
          // padding: "4px 10px",
          // border: "1px solid #999",
          // fontWeight: 600,
          // marginBottom: 10,
        }
      }
      key={value}
      checked={filters[key].includes(value)} // Check based on the key
      onChange={(checked) => {
        const updatedValues = checked
          ? [...filters[key], value]
          : filters[key].filter((item) => item !== value);
        onFilterChange(key, updatedValues);
      }}
    >
      {label}
    </Checkbox>
  ));

export default function FilterRentalLocation({
  filters,
  onFilterChange,
  onReset,
  onApplyFilters,
}) {
  const menu = (
    <Menu style={{ padding: "16px", minWidth: "250px" }}>
      <Menu.ItemGroup title="Trạng thái">
        <Flex vertical>
          {renderTags(
            RentalLocationStatusEnum,
            filters,
            "statuses",
            onFilterChange
          )}
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

import  { useState } from "react";
import { Dropdown, Menu, Button, Checkbox } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { RoleEnum, StatusEnum, ApproveEnum } from "../../../enums/accountEnums"; // Import enums
import { Flex } from "antd";

// Helper function to render checkbox items for any enum
const renderCheckboxes = (enumData, selectedValues, onChange) =>
  Object.entries(enumData).map(([value, { label }]) => (
    <Menu.Item key={value}>
      <Checkbox
        checked={selectedValues.includes(value)}
        onChange={(e) => {
          const isChecked = e.target.checked;
          const updatedValues = isChecked
            ? [...selectedValues, value]
            : selectedValues.filter((item) => item !== value);
          onChange(updatedValues);
        }}
      >
        {label}
      </Checkbox>
    </Menu.Item>
  ));

export default function FilterAccount({
  filters,
  onFilterChange,
  onReset,
  onApplyFilters,
}) {
  const [visible, setVisible] = useState(false);

  const handleApply = () => {
    onApplyFilters(filters);
    setVisible(false);
  };

  const menu = (
    <Menu>
      <Flex>
        <Menu.ItemGroup title="Vai trò">
          {renderCheckboxes(RoleEnum, filters.roles, (updatedRoles) =>
            onFilterChange("roles", updatedRoles)
          )}
        </Menu.ItemGroup>
  
        <Menu.ItemGroup title="Trạng thái">
          {renderCheckboxes(StatusEnum, filters.statuses, (updatedStatuses) =>
            onFilterChange("statuses", updatedStatuses)
          )}
        </Menu.ItemGroup>
  
        <Menu.ItemGroup title="Phê duyệt">
          {renderCheckboxes(ApproveEnum, filters.approves, (updatedApproves) =>
            onFilterChange("approves", updatedApproves)
          )}
        </Menu.ItemGroup>
      </Flex>

      <Menu.Divider />

      <Menu.Item>
        <Button onClick={onReset} style={{ marginRight: 8 }}>
          Reset
        </Button>
        <Button type="primary" onClick={handleApply}>
          Áp dụng
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      visible={visible}
      onVisibleChange={(flag) => setVisible(flag)}
    >
      <Button>
        Bộ lọc <DownOutlined />
      </Button>
    </Dropdown>
  );
}

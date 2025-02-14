import { useState, useMemo } from "react";
import { Dropdown, Button, Checkbox, Divider, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

export default function FilterAccount({
  roles,
  filters,
  onFilterChange,
  onReset,
  onApplyFilters,
}) {
  const [open, setOpen] = useState(false);

  const handleRoleChange = (role) => {
    const updatedRoles = filters.roles.includes(role)
      ? filters.roles.filter((r) => r !== role)
      : [...filters.roles, role];
    onFilterChange("roles", updatedRoles);
  };

  const handleApply = () => {
    onApplyFilters(filters);
    setOpen(false);
  };

  const filterContent = useMemo(
    () => (
      <div
        style={{
          padding: "10px",
          // width: 350,
          background: "#fff",
          borderRadius: 8,
        }}
      >
        {/* Bộ lọc vai trò */}
        <strong>Vai trò</strong>
        <div style={{ gap: 20, display: "flex" }}>
          {roles.map((role) => (
            <Checkbox
              key={role}
              checked={filters.roles.includes(role)}
              onChange={() => handleRoleChange(role)}
              // style={{ display: "block", marginLeft: 8 }}
            >
              {role}
            </Checkbox>
          ))}
        </div>

        <Divider style={{ margin: "8px 0" }} />

        {/* Bộ lọc trạng thái hoạt động */}
        <strong>Trạng thái hoạt động</strong>
        <div style={{ marginBottom: 8, marginLeft: 8 }}>
          <Checkbox
            checked={filters.isActive === true}
            onChange={() =>
              onFilterChange(
                "isActive",
                filters.isActive === true ? null : true
              )
            }
          >
            Hoạt động
          </Checkbox>
          <Checkbox
            checked={filters.isActive === false}
            onChange={() =>
              onFilterChange(
                "isActive",
                filters.isActive === false ? null : false
              )
            }
            style={{ marginLeft: 8 }}
          >
            Không hoạt động
          </Checkbox>
        </div>

        <Divider style={{ margin: "8px 0" }} />

        {/* Bộ lọc xác thực tài khoản */}
        <strong>Xác thực tài khoản</strong>
        <div style={{ marginBottom: 8, marginLeft: 8 }}>
          <Checkbox
            checked={filters.isVerified === true}
            onChange={() =>
              onFilterChange(
                "isVerified",
                filters.isVerified === true ? null : true
              )
            }
          >
            Đã xác thực
          </Checkbox>
          <Checkbox
            checked={filters.isVerified === false}
            onChange={() =>
              onFilterChange(
                "isVerified",
                filters.isVerified === false ? null : false
              )
            }
            style={{ marginLeft: 8 }}
          >
            Chưa xác thực
          </Checkbox>
        </div>

        <Divider style={{ margin: "8px 0" }} />

        <Space style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onReset}>Reset</Button>
          <Button type="primary" onClick={handleApply}>
            Áp dụng
          </Button>
        </Space>
      </div>
    ),
    [roles, filters]
  );

  return (
    <Dropdown
      overlay={filterContent}
      trigger={["click"]}
      open={open}
      onOpenChange={setOpen}
    >
      <Button>
        Bộ lọc <DownOutlined />
      </Button>
    </Dropdown>
  );
}

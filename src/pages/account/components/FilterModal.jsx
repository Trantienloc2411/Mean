/* eslint-disable react/prop-types */
import { Modal, Tag, Button } from "antd";

const { CheckableTag } = Tag;

export default function FilterModal({
  visible,
  onClose,
  filters,
  onFilterChange,
  onReset,
}) {
  const roles = ["Admin", "Người dùng", "Quản lý", "role 4"];
  const statuses = ["status 1", "status 2", "status 3"];
  const approves = ["approve 1", "approve 2", "approve 3"];

  const handleTagChange = (key, value, checked) => {
    const updatedValues = checked
      ? [...filters[key], value]
      : filters[key].filter((item) => item !== value);

    onFilterChange(key, updatedValues);
  };

  return (
    <Modal
      title="Bộ lọc"
      visible={visible}
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button key="reset" onClick={onReset}>
          Reset
        </Button>,
        // <Button key="cancel" onClick={onClose}>
        //   Hủy
        // </Button>,
        <Button
          key="apply"
          style={{ background: "#4880FF", color: "#fff" }}
          onClick={onClose}
        >
          Áp dụng
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 20 }}>
        <h3>Vai trò</h3>
        <div>
          {roles.map((role) => (
            <CheckableTag
              key={role}
              checked={filters?.roles.includes(role)}
              onChange={(checked) => handleTagChange("roles", role, checked)}
            >
              {role}
            </CheckableTag>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <h3>Trạng thái</h3>
        <div>
          {statuses.map((status) => (
            <CheckableTag
              key={status}
              checked={filters.statuses.includes(status)}
              onChange={(checked) =>
                handleTagChange("statuses", status, checked)
              }
            >
              {status}
            </CheckableTag>
          ))}
        </div>
      </div>
      <div>
        <h3>Phê duyệt</h3>
        <div>
          {approves.map((approve) => (
            <CheckableTag
              key={approve}
              checked={filters.approves.includes(approve)}
              onChange={(checked) =>
                handleTagChange("approves", approve, checked)
              }
            >
              {approve}
            </CheckableTag>
          ))}
        </div>
      </div>
    </Modal>
  );
}

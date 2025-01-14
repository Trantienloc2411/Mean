import { Modal, Tag, Button } from "antd";
const { CheckableTag } = Tag;
import { RoleEnum, StatusEnum, ApproveEnum } from "../../../enums/accountEnums"; // Import enums

// Helper function to render CheckableTags for any enum
const renderTags = (enumData, filters, key, onFilterChange) => (
  <div style={{ marginBottom: 20 }}>
    {Object.entries(enumData).map(([value, { label }]) => (
      <CheckableTag
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
      </CheckableTag>
    ))}
  </div>
);

export default function FilterModal({
  visible,
  onClose,
  filters,
  onFilterChange,
  onReset,
}) {
  return (
    <Modal
      title="Bộ lọc"
      open={visible}
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button key="reset" onClick={onReset}>
          Reset
        </Button>,
        <Button
          key="apply"
          style={{ background: "#4880FF", color: "#fff" }}
          onClick={onClose}
        >
          Áp dụng
        </Button>,
      ]}
    >
      <h3>Vai trò</h3>
      {renderTags(RoleEnum, filters, "roles", onFilterChange)}{" "}
      <h3>Trạng thái</h3>
      {renderTags(StatusEnum, filters, "statuses", onFilterChange)}{" "}
      <h3>Phê duyệt</h3>
      {renderTags(ApproveEnum, filters, "approves", onFilterChange)}{" "}
    </Modal>
  );
}

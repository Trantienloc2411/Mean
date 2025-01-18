import { Modal, Tag, Button } from "antd";
const { CheckableTag } = Tag;

export default function FilterModal({
  visible,
  onClose,
  filters,
  onFilterChange,
  onReset,
  statuses,
  transactionTypes,
}) {
  const renderTags = (items, key) => (
    <div>
      {items.map((item) => (
        <CheckableTag
          style={{
            padding: "4px 10px",
            border: "1px solid #999",
            fontWeight: 600,
          }}
          key={item}
          checked={filters[key].includes(item)}
          onChange={(checked) => {
            const updatedValues = checked
              ? [...filters[key], item]
              : filters[key].filter((value) => value !== item);
            onFilterChange(key, updatedValues);
          }}
        >
          {item}
        </CheckableTag>
      ))}
    </div>
  );

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
        <h3>Trạng thái</h3>
        {renderTags(statuses, "statuses")} {/* Render trạng thái */}
      </div>
      <div style={{ marginBottom: 20 }}>
        <h3>Loại giao dịch</h3>
        {renderTags(transactionTypes, "transactionTypes")}{" "}
        {/* Render loại giao dịch */}
      </div>
    </Modal>
  );
}

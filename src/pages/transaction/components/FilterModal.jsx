import { Modal, Tag, Button } from "antd";
const { CheckableTag } = Tag;

export default function FilterModal({
  visible,
  onClose,
  filters,
  onFilterChange,
  onReset,
  statuses, // Trạng thái
  transactionTypes, // Loại giao dịch
}) {
  // const statuses = ["active", "pending", "inactive", "cancel"];
  // const transactionTypes = [
  //   "deposit",
  //   "full_payment",
  //   "refund",
  //   "final_payment",
  // ];

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
      <div style={{ marginBottom: 20 }}>
        <h3>Loại giao dịch</h3>
        <div>
          {transactionTypes.map((type) => (
            <CheckableTag
              key={type}
              checked={filters.transactionTypes.includes(type)}
              onChange={(checked) =>
                handleTagChange("transactionTypes", type, checked)
              }
            >
              {type}
            </CheckableTag>
          ))}
        </div>
      </div>
    </Modal>
  );
}

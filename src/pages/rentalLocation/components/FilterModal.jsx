import { Modal, Tag, Button } from "antd";
const { CheckableTag } = Tag;
import { RentalLocationStatusEnum } from "../../../enums/rentalLocationEnums"; // Import enums
import { ConfigProvider } from "antd";

// Helper function to render CheckableTags for any enum
const renderTags = (enumData, filters, key, onFilterChange) => (
  <div style={{ marginBottom: 20 }}>
    <ConfigProvider
      theme={{
        token: {
          // colorPrimaryHover: "#333",
          // colorPrimary: "#333",
        },
      }}
    >
      {Object.entries(enumData).map(([value, { label }]) => (
        <CheckableTag
          style={{
            padding: "4px 10px",
            border: "1px solid #999",
            fontWeight: 600,
          }}
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
    </ConfigProvider>
  </div>
);

export default function FilterModal({
  visible,
  onClose,
  filters, // filters hiện tại, sẽ được dùng để hiển thị trạng thái
  onFilterChange, // hàm dùng để thay đổi filter khi người dùng chọn
  onReset,
  onApplyFilters, // hàm áp dụng filter
}) {
  const handleApply = () => {
    onApplyFilters(); // Áp dụng bộ lọc
    onClose(); // Đóng modal sau khi áp dụng
  };

  return (
    <Modal
      title="Bộ lọc"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="reset" onClick={onReset}>
          Reset
        </Button>,
        <Button
          key="apply"
          style={{ background: "#4880FF", color: "#fff" }}
          onClick={handleApply} // Áp dụng bộ lọc khi nhấn "Áp dụng"
        >
          Áp dụng
        </Button>,
      ]}
    >
      <h3>Trạng thái</h3>
      {renderTags(
        RentalLocationStatusEnum,
        filters,
        "statuses",
        onFilterChange
      )}
      <h3>Phê duyệt</h3>
    </Modal>
  );
}

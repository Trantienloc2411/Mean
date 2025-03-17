import { useState } from "react";
import { Select, Button, message, Tag } from "antd";

const { Option } = Select;

const activityStatusOptions = [
  { value: "active", label: "Đang hoạt động" },
  { value: "paused", label: "Tạm nghỉ" },
  { value: "maintenance", label: "Đang bảo trì" },
];

const approvalStatusOptions = [
  { value: "approved", label: "Đã duyệt" },
  { value: "pending", label: "Đang duyệt" },
  { value: "inactive", label: "Không hoạt động" },
];

export default function SettingStatus() {
  const [isEditing, setIsEditing] = useState(false); // Chế độ chỉnh sửa
  const [status, setStatus] = useState({
    activityStatus: "active", // Trạng thái hoạt động
    approvalStatus: "approved", // Trạng thái duyệt
  });

  const [editStatus, setEditStatus] = useState({ ...status }); // Giá trị trong form

  const handleEdit = () => {
    setIsEditing(true); // Bật chế độ chỉnh sửa
  };

  const handleCancel = () => {
    setEditStatus({ ...status }); // Khôi phục giá trị cũ
    setIsEditing(false); // Tắt chế độ chỉnh sửa
  };

  const handleSave = () => {
    setStatus({ ...editStatus }); // Lưu trạng thái mới
    setIsEditing(false); // Tắt chế độ chỉnh sửa
    message.success("Cập nhật trạng thái thành công!");
  };

  return (
    <div>
      <h3>Trạng thái địa điểm</h3>
      {isEditing ? (
        <div style={{ marginTop: "16px" }}>
          {/* Dropdown trạng thái hoạt động */}
          <div style={{ marginBottom: "16px" }}>
            <label>
              <strong>Trạng thái hoạt động:</strong>
            </label>
            <Select
              style={{ width: "100%", marginTop: "8px" }}
              value={editStatus.activityStatus}
              onChange={(value) =>
                setEditStatus((prev) => ({ ...prev, activityStatus: value }))
              }
            >
              {activityStatusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>

          {/* Dropdown trạng thái duyệt */}
          <div style={{ marginBottom: "16px" }}>
            <label>
              <strong>Trạng thái duyệt:</strong>
            </label>
            <Select
              style={{ width: "100%", marginTop: "8px" }}
              value={editStatus.approvalStatus}
              onChange={(value) =>
                setEditStatus((prev) => ({ ...prev, approvalStatus: value }))
              }
            >
              {approvalStatusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>

          {/* Nút hành động */}
          <div style={{ display: "flex", gap: "8px" }}>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "16px" }}>
          {/* Hiển thị trạng thái hoạt động */}
          <p>
            <strong>Trạng thái hoạt động:</strong>{" "}
            <Tag
              color={
                status.activityStatus === "active"
                  ? "green"
                  : status.activityStatus === "paused"
                  ? "orange"
                  : "red"
              }
            >
              {activityStatusOptions.find(
                (option) => option.value === status.activityStatus
              )?.label || "Unknown"}
            </Tag>
          </p>

          {/* Hiển thị trạng thái duyệt */}
          <p>
            <strong>Trạng thái duyệt:</strong>{" "}
            <Tag
              color={
                status.approvalStatus === "approved"
                  ? "green"
                  : status.approvalStatus === "pending"
                  ? "blue"
                  : "volcano"
              }
            >
              {approvalStatusOptions.find(
                (option) => option.value === status.approvalStatus
              )?.label || "Unknown"}
            </Tag>
          </p>

          {/* Nút chỉnh sửa */}
          <Button
            type="default"
            onClick={handleEdit}
            style={{ marginTop: "16px" }}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}

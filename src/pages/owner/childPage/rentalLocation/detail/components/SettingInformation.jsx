import React, { useState } from "react";
import { Input, Button, Form, Upload, message } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";

export default function SettingInformation() {
  const [isEditing, setIsEditing] = useState(false); // Chế độ chỉnh sửa
  const [form] = Form.useForm();

  // Dữ liệu ban đầu
  const [data, setData] = useState({
    name: "Địa điểm ABC",
    description: "Mô tả địa điểm ABC",
    address: "123 Đường XYZ, Thành phố HCM",
    position: "10.8231, 106.6297", // Lat, Lng
  });

  const handleEdit = () => {
    setIsEditing(true); // Chuyển sang chế độ chỉnh sửa
    form.setFieldsValue(data); // Đổ dữ liệu vào form
  };

  const handleCancel = () => {
    setIsEditing(false); // Quay lại chế độ xem
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        setData(values); // Cập nhật dữ liệu
        message.success("Cập nhật thông tin thành công!");
        setIsEditing(false); // Quay lại chế độ xem
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  return (
    <div>
      <h3>Thông tin địa điểm</h3>
      {isEditing ? (
        // Chế độ chỉnh sửa
        <Form
          form={form}
          layout="vertical"
          initialValues={data}
          style={{ marginTop: "16px" }}
        >
          {/* Tên địa điểm */}
          <Form.Item
            label="Tên địa điểm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên địa điểm!" }]}
          >
            <Input placeholder="Nhập tên địa điểm" />
          </Form.Item>

          {/* Mô tả */}
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea placeholder="Nhập mô tả địa điểm" rows={4} />
          </Form.Item>

          {/* Địa chỉ */}
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ địa điểm" />
          </Form.Item>

          {/* Vị trí Google Map */}
          <Form.Item label="Vị trí Google Map" name="position">
            <Input placeholder="Nhập tọa độ (Lat, Lng)" />
          </Form.Item>

          {/* Tải tệp quyền dùng đất */}
          <Form.Item label="Tệp quyền dùng đất">
            <Upload
              beforeUpload={() => false}
              accept=".pdf,.doc,.docx,.png,.jpg"
            >
              <Button icon={<UploadOutlined />}>Chọn tệp</Button>
            </Upload>
          </Form.Item>

          {/* Nút hành động */}
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleUpdate}
            >
              Cập nhật
            </Button>
            <Button icon={<CloseOutlined />} onClick={handleCancel}>
              Hủy
            </Button>
          </div>
        </Form>
      ) : (
        // Chế độ xem
        <div style={{ marginTop: "16px" }}>
          <p>
            <strong>Tên địa điểm:</strong> {data.name}
          </p>
          <p>
            <strong>Mô tả:</strong> {data.description}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {data.address}
          </p>
          <p>
            <strong>Vị trí Google Map:</strong> {data.position}
          </p>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={handleEdit}
            style={{ marginTop: "16px" }}
          >
            Chỉnh sửa
          </Button>
        </div>
      )}
    </div>
  );
}

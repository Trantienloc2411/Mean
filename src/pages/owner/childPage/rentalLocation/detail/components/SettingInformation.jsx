import React, { useState } from "react";
import { Input, Button, Form, message } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

export default function SettingInformation({ rentalData }) {
  const [isEditing, setIsEditing] = useState(false); // Chế độ chỉnh sửa
  const [form] = Form.useForm();

  // Dữ liệu ban đầu
  const [data, setData] = useState({
    name: rentalData?.name || "",
    description: rentalData?.description || "",
    address: rentalData?.address || "",
    longitude: rentalData?.longitude || "", // Kinh độ
    latitude: rentalData?.latitude || "", // Vĩ độ
  });

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(data);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        setData(values);
        message.success("Cập nhật thông tin thành công!");
        setIsEditing(false);
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  const handleViewOnMap = () => {
    if (data.latitude && data.longitude) {
      const mapUrl = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
      window.open(mapUrl, "_blank");
    } else {
      message.warning("Không có tọa độ hợp lệ để xem trên Google Maps.");
    }
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
          <Form.Item
            label="Tên địa điểm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên địa điểm!" }]}
          >
            <Input placeholder="Nhập tên địa điểm" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea placeholder="Nhập mô tả địa điểm" rows={4} />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ địa điểm" />
          </Form.Item>

          <Form.Item label="Vĩ độ (Latitude)" name="latitude">
            <Input placeholder="Nhập vĩ độ" />
          </Form.Item>

          <Form.Item label="Kinh độ (Longitude)" name="longitude">
            <Input placeholder="Nhập kinh độ" />
          </Form.Item>

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
            <strong>Vĩ độ (Latitude):</strong> {data.latitude}
          </p>
          <p>
            <strong>Kinh độ (Longitude):</strong> {data.longitude}
          </p>

          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <Button type="default" icon={<EditOutlined />} onClick={handleEdit}>
              Chỉnh sửa
            </Button>
            <Button
              type="primary"
              icon={<EnvironmentOutlined />}
              onClick={handleViewOnMap}
            >
              Xem trên Google Maps
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

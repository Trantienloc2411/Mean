import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Switch,
  Button,
  message,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUpdateRentalLocationMutation } from "../../../../../../redux/services/rentalApi";
import { supabase } from "../../../../../../redux/services/supabase";

// Định nghĩa các trạng thái của rental location
const RENTALLOCATION_STATUS = {
  PENDING: 1,
  INACTIVE: 2,
  ACTIVE: 3,
  PAUSE: 4,
};

const statusOptions = [
  { label: "Chờ duyệt", value: RENTALLOCATION_STATUS.PENDING },
  { label: "Không hoạt động", value: RENTALLOCATION_STATUS.INACTIVE },
  { label: "Hoạt động", value: RENTALLOCATION_STATUS.ACTIVE },
  { label: "Tạm dừng", value: RENTALLOCATION_STATUS.PAUSE },
];

export default function EditRentalLocationModal({
  visible,
  onClose,
  rentalData,
  onUpdate,
}) {
  const [form] = Form.useForm();
  const [updateRentalLocation, { isLoading }] =
    useUpdateRentalLocationMutation();
  const [uploading, setUploading] = useState(false);

  // Khi mở modal, set các giá trị ban đầu từ rentalData
  useEffect(() => {
    if (visible && rentalData) {
      form.setFieldsValue({
        name: rentalData.name,
        address: rentalData.address,
        description: rentalData.description,
        image: rentalData.image,
        latitude: rentalData.latitude,
        longitude: rentalData.longitude, // Lưu ý: dùng "longitude" theo API
        openHour: rentalData.openHour,
        closeHour: rentalData.closeHour,
        isOverNight: rentalData.isOverNight,
        status: rentalData.status,
      });
    }
  }, [visible, rentalData, form]);

  // Hàm xử lý upload ảnh cho trường image
  const handleUploadImage = async (file) => {
    setUploading(true);
    // Tạo tên file với ownerId (giả sử rentalData có ownerId)
    const fileName = `rental-images/${rentalData.ownerId}-${Date.now()}-${
      file.name
    }`;
    const { data, error } = await supabase.storage
      .from("rental-images")
      .upload(fileName, file);
    if (error) {
      message.error("Upload ảnh thất bại!");
      setUploading(false);
      return null;
    }
    const { data: publicUrl } = supabase.storage
      .from("rental-images")
      .getPublicUrl(fileName);
    setUploading(false);
    if (publicUrl?.publicUrl) {
      return publicUrl.publicUrl;
    }
    return null;
  };

  const handleFinish = async (values) => {
    try {
      
      const id = rentalData.id || rentalData._id;
      const updatedData = { ...values };

      console.log("ID:", id);
      console.log("Updated Data:", updatedData);

      const result = await updateRentalLocation({ id, updatedData }).unwrap();

      console.log("API Response:", result);
      message.success("Cập nhật thành công!");

      onUpdate(result);
      onClose();
    } catch (error) {
      console.error("Update Error:", error);
      message.error("Cập nhật thất bại, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      visible={visible}
      title="Chỉnh sửa địa điểm"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Tên"
          rules={[{ required: true, message: "Vui lòng nhập tên địa điểm" }]}
        >
          <Input placeholder="Nhập tên địa điểm" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea placeholder="Nhập mô tả" rows={4} />
        </Form.Item>

        <Form.Item label="Hình ảnh" name="image">
          <Upload
            showUploadList={false}
            beforeUpload={async (file) => {
              const imageUrl = await handleUploadImage(file);
              if (imageUrl) {
                form.setFieldsValue({ image: imageUrl });
              }
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} disabled={uploading}>
              {uploading ? "Đang tải..." : "Tải hình ảnh"}
            </Button>
          </Upload>
          {form.getFieldValue("image") && (
            <img
              src={form.getFieldValue("image")}
              alt="Rental"
              style={{ marginTop: 10, maxWidth: "100%" }}
            />
          )}
        </Form.Item>

        <Form.Item
          name="latitude"
          label="Vĩ độ"
          rules={[{ required: true, message: "Vui lòng nhập vĩ độ" }]}
        >
          <Input placeholder="Nhập vĩ độ" />
        </Form.Item>

        <Form.Item
          name="longitude"
          label="Kinh độ"
          rules={[{ required: true, message: "Vui lòng nhập kinh độ" }]}
        >
          <Input placeholder="Nhập kinh độ" />
        </Form.Item>

        <Form.Item
          name="openHour"
          label="Giờ mở cửa"
          rules={[{ required: true, message: "Vui lòng nhập giờ mở cửa" }]}
        >
          <Input placeholder="Nhập giờ mở cửa" />
        </Form.Item>

        <Form.Item
          name="closeHour"
          label="Giờ đóng cửa"
          rules={[{ required: true, message: "Vui lòng nhập giờ đóng cửa" }]}
        >
          <Input placeholder="Nhập giờ đóng cửa" />
        </Form.Item>

        <Form.Item name="isOverNight" label="Qua đêm" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select options={statusOptions} placeholder="Chọn trạng thái" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

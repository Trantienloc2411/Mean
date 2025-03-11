import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Switch,
  Button,
  message,
  Select,
  Row,
  Col,
} from "antd";
import { useUpdateRentalLocationMutation } from "../../../../../../redux/services/rentalApi";

const { TextArea } = Input;

export default function EditRentalLocationModal({
  visible,
  onClose,
  rentalData,
  onUpdate,
}) {
  const [form] = Form.useForm();
  const [updateRentalLocation, { isLoading }] =
    useUpdateRentalLocationMutation();

  useEffect(() => {
    if (visible && rentalData) {
      form.setFieldsValue({
        name: rentalData.name,
        description: rentalData.description,
        openHour: rentalData.openHour,
        closeHour: rentalData.closeHour,
        isOverNight: rentalData.isOverNight,
        status: rentalData.status,
      });
    }
  }, [visible, rentalData, form]);
  console.log(rentalData.id);

  const handleFinish = async (values) => {
    try {
      const id = rentalData.id || rentalData._id;
      if (!id) {
        message.error("Không tìm thấy ID của địa điểm!");
        return;
      }

      const updatedData = {
        name: values.name,
        description: values.description,
        openHour: values.openHour,
        closeHour: values.closeHour,
        isOverNight: values.isOverNight,
        status: values.status,
      };

      const result = await updateRentalLocation({ id, updatedData }).unwrap();

      message.success("Cập nhật thành công!");
      onUpdate(result);
      onClose();
    } catch (error) {
      message.error("Cập nhật thất bại, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      open={visible}
      title="Chỉnh sửa địa điểm"
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Tên địa điểm"
          rules={[{ required: true, message: "Vui lòng nhập tên địa điểm" }]}
        >
          <Input placeholder="Nhập tên địa điểm" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea placeholder="Nhập mô tả" rows={3} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="openHour"
              label="Giờ mở cửa"
              rules={[{ required: true, message: "Vui lòng nhập giờ mở cửa" }]}
            >
              <Input placeholder="Ví dụ: 08:00" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="closeHour"
              label="Giờ đóng cửa"
              rules={[
                { required: true, message: "Vui lòng nhập giờ đóng cửa" },
              ]}
            >
              <Input placeholder="Ví dụ: 22:00" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="isOverNight" label="Cho phép qua đêm">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Select.Option value={1}>Chờ duyệt</Select.Option>
                <Select.Option value={2}>Không hoạt động</Select.Option>
                <Select.Option value={3}>Hoạt động</Select.Option>
                <Select.Option value={4}>Tạm dừng</Select.Option>
                <Select.Option value={5}>Đã xóa</Select.Option>
                <Select.Option value={6}>Cần cập nhật</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

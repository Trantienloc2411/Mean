import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import styles from './UpdateAmenityModal.module.scss';

const { Option } = Select;

const UpdateAmenityModal = ({ isOpen, onCancel, onConfirm, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onConfirm(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Chỉnh sửa tiện ích"
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      okText="Lưu thay đổi"
      cancelText="Huỷ"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        preserve={false}
      >
        <Form.Item
          name="name"
          label="Tên tiện ích"
          rules={[{ required: true, message: 'Vui lòng nhập tên tiện ích' }]}
        >
          <Input placeholder="Nhập tên tiện ích" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả"
            rows={4}
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="Active">Đang hoạt động</Option>
            <Option value="Paused">Tạm dừng</Option>
            <Option value="Expired">Hết hạn</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateAmenityModal;
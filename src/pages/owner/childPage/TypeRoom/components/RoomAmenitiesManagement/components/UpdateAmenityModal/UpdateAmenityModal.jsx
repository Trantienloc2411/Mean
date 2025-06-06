import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Spin } from 'antd';
import styles from './UpdateAmenityModal.module.scss';

const { Option } = Select;

const UpdateAmenityModal = ({ isOpen, onCancel, onConfirm, initialValues, isLoading }) => {
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
      title="Chỉnh sửa dịch vụ"
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      okText="Lưu thay đổi"
      cancelText="Huỷ"
      destroyOnClose
      confirmLoading={isLoading}
    >
      <Spin spinning={isLoading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          preserve={false}
        >
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[
              { required: true, message: 'Vui lòng nhập tên dịch vụ' },
              {
                validator: (_, value) => {
                  if (value && !value.trim()) {
                    return Promise.reject(new Error('Tên dịch vụ không được chỉ chứa khoảng trắng!'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input 
              placeholder="Nhập tên dịch vụ" 
              onBlur={(e) => {
                const value = e.target.value.trim();
                form.setFieldsValue({ name: value });
              }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả' },
              {
                validator: (_, value) => {
                  if (value && !value.trim()) {
                    return Promise.reject(new Error('Mô tả không được chỉ chứa khoảng trắng!'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input.TextArea
              placeholder="Nhập mô tả"
              rows={4}
              maxLength={200}
              showCount
              onBlur={(e) => {
                const value = e.target.value.trim();
                form.setFieldsValue({ description: value });
              }}
            />
          </Form.Item>

          {/* <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Active">Đang hoạt động</Option>
              <Option value="Inactive">Không hoạt động</Option>
            </Select>
          </Form.Item> */}
        </Form>
      </Spin>
    </Modal>
  );
};

export default UpdateAmenityModal;
import { Modal, Form, Input, DatePicker, Radio, Checkbox, Button } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import styles from './UpdatePolicyModal.module.scss';

const UpdatePolicyModal = ({ isOpen, onCancel, onConfirm, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      const startTime = initialValues.StartTime ? dayjs(initialValues.StartTime, 'HH:mm DD/MM/YYYY') : null;
      const endTime = initialValues.EndTime ? dayjs(initialValues.EndTime, 'HH:mm DD/MM/YYYY') : null;

      form.setFieldsValue({
        ...initialValues,
        StartTime: startTime && startTime.isValid() ? startTime : null,
        EndTime: endTime && endTime.isValid() ? endTime : null,
      });
    }
  }, [initialValues, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const startTime = values.StartTime ? values.StartTime.format('HH:mm DD/MM/YYYY') : null;
        const endTime = values.EndTime ? values.EndTime.format('HH:mm DD/MM/YYYY') : null;

        const formattedValues = {
          ...values,
          StartTime: startTime,
          EndTime: endTime,
        };

        onConfirm(formattedValues); 
        form.resetFields(); 
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Cập nhật chính sách"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>Huỷ</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Cập nhật chính sách</Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical" name="updatePolicyForm" className={styles.modalForm}>
        <Form.Item name="Name" label="Tên chính sách" rules={[{ required: true, message: 'Vui lòng nhập tên chính sách' }]}>
          <Input placeholder="Nhập tên chính sách" />
        </Form.Item>

        <Form.Item name="Description" label="Mô tả">
          <Input.TextArea rows={4} placeholder="Nhập mô tả cho chính sách" />
        </Form.Item>

        <Form.Item name="Value" label="Giá trị" rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}>
          <Input type="number" placeholder="0" />
        </Form.Item>

        <Form.Item name="Unit" label="Đơn vị" rules={[{ required: true, message: 'Vui lòng chọn đơn vị' }]}>
          <Radio.Group>
            <Radio value="Percent">Phần trăm (%)</Radio>
            <Radio value="VND">VND</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="StartTime" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}>
          <DatePicker style={{ width: '100%' }} format="HH:mm DD/MM/YYYY" placeholder="dd/mm/yyyy" showTime />
        </Form.Item>

        <Form.Item name="EndTime" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}>
          <DatePicker style={{ width: '100%' }} format="HH:mm DD/MM/YYYY" placeholder="dd/mm/yyyy" showTime />
        </Form.Item>

        <Form.Item name="Status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
          <Radio.Group>
            <Radio value="Active">Đang hoạt động</Radio>
            <Radio value="Paused">Tạm dừng</Radio>
            <Radio value="Expired">Hết hạn</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdatePolicyModal;

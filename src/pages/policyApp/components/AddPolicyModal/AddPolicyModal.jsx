import { Modal, Form, Input, DatePicker, Radio, Checkbox, Button } from 'antd';
import styles from './AddPolicyModal.module.scss';

const AddPolicyModal = ({ isOpen, onCancel, onConfirm }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        onConfirm(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Thêm chính sách mới"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Thêm chính sách
        </Button>
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        name="addPolicyForm"
        className={styles.modalForm}
      >
        <Form.Item
          name="name"
          label="Tên chính sách"
          rules={[{ required: true, message: 'Vui lòng nhập tên chính sách' }]}
        >
          <Input placeholder="Nhập tên chính sách" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả cho chính sách" />
        </Form.Item>

        <Form.Item
          name="value"
          label="Giá trị"
          rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}
        >
          <Input type="number" placeholder="0" />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Đơn vị"
          rules={[{ required: true, message: 'Vui lòng chọn đơn vị' }]}
        >
          <Radio.Group>
            <Radio value="percent">Phần trăm (%)</Radio>
            <Radio value="vnd">VND</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
        >
          <DatePicker 
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="dd/mm/yyyy"
          />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="Ngày kết thúc"
          rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="dd/mm/yyyy"
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          valuePropName="checked"
        >
          <Checkbox>Kích hoạt?</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPolicyModal;
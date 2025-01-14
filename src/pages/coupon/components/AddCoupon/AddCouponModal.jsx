import { Modal, Form, Input, DatePicker, Radio, Checkbox, Button } from 'antd';
import styles from './AddCouponModal.module.scss';

const AddCouponModal = ({ isOpen, onCancel, onConfirm }) => {
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
      title={`Thêm mã giảm giá `}
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" color='default' variant='outlined'  onClick={onCancel}>
          Huỷ
        </Button>,
        <Button key="submit" type="primary" color='default' variant='solid' onClick={handleSubmit}>
          Thêm mã giảm giá
        </Button>
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        name="addCouponForm"
      >
        <Form.Item
          name="name"
          label="Tên mã giảm giá"
          rules={[{ required: true, message: 'Hãy nhập tên mã giảm giá' }]}
        >
          <Input placeholder="Hãy nhập tên mã giảm giá" />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Ngày bắt đầu kích hoạt"
          rules={[{ required: true, message: 'Hãy chọn ngày bắt đầu kích hoạt' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="dd/mm/yyyy"
          />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="Hạn sử dụng đến"
          rules={[{ required: true, message: 'Hãy chọn hạn sử dụng của mã giảm giá' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="dd/mm/yyyy"
          />
        </Form.Item>

        <Form.Item
          name="discountType"
          label="Đây là loại giảm giá theo..."
          rules={[{ required: true, message: 'Hãy chọn một trong hai loại' }]}
        >
          <Radio.Group>
            <Radio value="percentage">Phần trăm (%)</Radio>
            <Radio value="fixed">Lượng cố định (vnđ)</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Giá trị"
          rules={[{ required: true, message: 'Hãy nhập giá trị' }]}
        >
          <Input type="number" placeholder="0" />
        </Form.Item>

        <Form.Item
          name="maxDiscount"
          label="Giảm giá tối đa (không bắt buộc)"
        >
          <Input type="number" placeholder="1000" />
        </Form.Item>

        <Form.Item
          name="isActive"
          valuePropName="checked"
        >
          <Checkbox 
          style={{
            color:'#000000'
          }}>Kích hoạt?</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCouponModal;
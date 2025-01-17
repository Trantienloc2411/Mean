import { Modal, Form, Input, InputNumber, Select, Button } from 'antd';
import { useEffect } from 'react';
import styles from './UpdateRoomTypeModal.module.scss';

const { TextArea } = Input;
const { Option } = Select;

const amenitiesList = [
  "TV", "Smart TV", "Điều hoà", "Wifi", "Wifi tốc độ cao", 
  "Tủ lạnh mini", "Minibar", "Két sắt", "Bồn tắm", "Bếp mini", 
  "Máy giặt", "Ban công", "View thành phố"
];

const UpdateRoomTypeModal = ({ isOpen, onCancel, onConfirm, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = () => {
    form
      .validateFields()
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
      title="Cập nhật loại phòng"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>Huỷ</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Cập nhật</Button>,
      ]}
      width={800}
    >
      <Form form={form} layout="vertical" name="updateRoomTypeForm" className={styles.modalForm}>
        <Form.Item
          name="name"
          label="Tên loại phòng"
          rules={[{ required: true, message: 'Vui lòng nhập tên loại phòng' }]}
        >
          <Input placeholder="Nhập tên loại phòng" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <TextArea rows={4} placeholder="Nhập mô tả cho loại phòng" />
        </Form.Item>

        <div className={styles.formRow}>
          <Form.Item
            name="maxOccupancy"
            label="Số người tối đa"
            rules={[{ required: true, message: 'Vui lòng nhập số người tối đa' }]}
          >
            <InputNumber min={1} placeholder="2" />
          </Form.Item>

          <Form.Item
            name="area"
            label="Diện tích (m²)"
            rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}
          >
            <InputNumber min={1} placeholder="20" addonAfter="m²" />
          </Form.Item>
        </div>

        <div className={styles.formRow}>
          <Form.Item
            name="hourlyRate"
            label="Giá theo giờ"
            rules={[{ required: true, message: 'Vui lòng nhập giá theo giờ' }]}
          >
            <InputNumber 
              min={0}
              step={10000}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              addonAfter="VNĐ"
            />
          </Form.Item>

          <Form.Item
            name="dailyRate"
            label="Giá theo ngày"
            rules={[{ required: true, message: 'Vui lòng nhập giá theo ngày' }]}
          >
            <InputNumber 
              min={0}
              step={100000}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              addonAfter="VNĐ"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="bedType"
          label="Loại giường"
          rules={[{ required: true, message: 'Vui lòng chọn loại giường' }]}
        >
          <Select placeholder="Chọn loại giường">
            <Option value="single">1 giường đơn</Option>
            <Option value="double">1 giường đôi</Option>
            <Option value="twin">2 giường đơn</Option>
            <Option value="2double">2 giường đôi</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amenities"
          label="Tiện ích đi kèm"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất một tiện ích' }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn tiện ích"
            style={{ width: '100%' }}
          >
            {amenitiesList.map(amenity => (
              <Option key={amenity} value={amenity}>{amenity}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="additionalFeatures"
          label="Tính năng bổ sung"
        >
          <Select
            mode="tags"
            placeholder="Nhập tính năng bổ sung"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateRoomTypeModal;
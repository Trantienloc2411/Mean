import { Modal, Form, Input, InputNumber, Select, Button } from 'antd';
import { useGetAllAmenitiesQuery } from '../../../../../../../../redux/services/serviceApi';
import { useGetAllRentalLocationsQuery } from '../../../../../../../../redux/services/rentalLocationApi';
import styles from './AddRoomTypeModal.module.scss';

const { TextArea } = Input;
const { Option } = Select;

const AddRoomTypeModal = ({ isOpen, onCancel, onConfirm }) => {
  const [form] = Form.useForm();
  const { data: services, isLoading, error } = useGetAllAmenitiesQuery();
  const { data: rentalLocations, isLoading: isLoadingRentalLocations } = useGetAllRentalLocationsQuery();

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        console.log("Dữ liệu được thêm:", values);
        onConfirm(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };


  return (
    <Modal
      title="Thêm loại phòng mới"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Thêm loại phòng
        </Button>
      ]}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        name="addRoomTypeForm"
        className={styles.modalForm}
      >
        <Form.Item
          name="rentalLocationId"
          label="Địa điểm thuê"
          rules={[{ required: true, message: 'Vui lòng chọn ID địa điểm thuê' }]}
        >
          <Select placeholder="Chọn địa điểm thuê" loading={isLoadingRentalLocations}>
            {rentalLocations?.data?.map(location => (
              <Option key={location.id} value={location.id}>{location.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="serviceId"
          label="Dịch vụ"
          rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
        >
          <Select placeholder="Chọn dịch vụ" loading={isLoading}>
            {services?.data?.map(service => (
              <Option key={service.id} value={service.id}>{service.name}</Option>
            ))}

          </Select>
        </Form.Item>

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
            name="maxPeopleNumber"
            label="Số người tối đa"
            rules={[{ required: true, message: 'Vui lòng nhập số người tối đa' }]}
          >
            <InputNumber min={1} placeholder="4" />
          </Form.Item>

          <Form.Item
            name="basePrice"
            label="Giá cơ bản"
            rules={[{ required: true, message: 'Vui lòng nhập giá cơ bản' }]}
          >
            <InputNumber min={0} step={100000} placeholder="200000" addonAfter="VNĐ" />
          </Form.Item>
        </div>

        <Form.Item
          name="overtimeHourlyPrice"
          label="Giá phụ trội theo giờ"
          rules={[{ required: true, message: 'Vui lòng nhập giá phụ trội theo giờ' }]}
        >
          <InputNumber min={0} step={10000} placeholder="20000" addonAfter="VNĐ" />
        </Form.Item>

        {/* <Form.Item
          name="amenities"
          label="Tiện ích đi kèm"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất một tiện ích' }]}
        >
          <Select mode="multiple" placeholder="Chọn tiện ích" style={{ width: '100%' }}>
            {amenitiesList.map(amenity => (
              <Option key={amenity} value={amenity}>{amenity}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="additionalFeatures"
          label="Tính năng bổ sung"
        >
          <Select mode="tags" placeholder="Nhập tính năng bổ sung" style={{ width: '100%' }} />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default AddRoomTypeModal;

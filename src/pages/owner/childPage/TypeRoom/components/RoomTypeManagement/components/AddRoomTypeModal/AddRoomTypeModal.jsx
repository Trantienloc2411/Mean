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
        const formattedValues = {
          ...values,
          serviceIds: values.serviceIds ? values.serviceIds : 
                      values.serviceId ? [values.serviceId] : []
        };
        if (formattedValues.serviceIds && formattedValues.serviceId) {
          delete formattedValues.serviceId;
        }

        console.log("Dữ liệu được thêm:", formattedValues);
        onConfirm(formattedValues);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  const getServicesOptions = () => {
    if (!services) return [];
    const servicesList = Array.isArray(services.data) ? services.data : 
                          Array.isArray(services) ? services : [];
    
    return servicesList
      .filter(service => service.status === true)
      .map(service => ({
        label: service.name,
        value: service._id || service.id
      }));
  };

  const getLocationsOptions = () => {
    if (!rentalLocations) return [];
    
    const locationsList = Array.isArray(rentalLocations.data) ? rentalLocations.data :
                           Array.isArray(rentalLocations) ? rentalLocations : [];
    
    return locationsList.map(location => ({
      label: location.name,
      value: location._id || location.id
    }));
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
          rules={[{ required: true, message: 'Vui lòng chọn địa điểm thuê' }]}
        >
          <Select 
            placeholder="Chọn địa điểm thuê" 
            loading={isLoadingRentalLocations}
            options={getLocationsOptions()}
          />
        </Form.Item>

        <Form.Item
          name="serviceIds"
          label="Dịch vụ"
          rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
        >
          <Select 
            placeholder="Chọn dịch vụ" 
            loading={isLoading}
            mode="multiple"
            options={getServicesOptions()}
          />
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
            <InputNumber 
              min={0} 
              step={100000} 
              placeholder="200000" 
              addonAfter="VNĐ" 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="overtimeHourlyPrice"
          label="Giá phụ trội theo giờ"
          rules={[{ required: true, message: 'Vui lòng nhập giá phụ trội theo giờ' }]}
        >
          <InputNumber 
            min={0} 
            step={10000} 
            placeholder="20000" 
            addonAfter="VNĐ"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRoomTypeModal;
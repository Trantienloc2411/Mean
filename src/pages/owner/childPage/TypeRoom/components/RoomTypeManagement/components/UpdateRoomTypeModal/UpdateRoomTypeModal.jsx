import { Modal, Form, Input, InputNumber, Select, Button } from 'antd';
import { useEffect } from 'react';
import { useGetAllAmenitiesQuery } from '../../../../../../../../redux/services/serviceApi';
import { useGetAllRentalLocationsQuery } from '../../../../../../../../redux/services/rentalLocationApi';
import styles from './UpdateRoomTypeModal.module.scss';

const { TextArea } = Input;
const { Option } = Select;

const UpdateRoomTypeModal = ({ isOpen, onCancel, onConfirm, initialValues }) => {
  const [form] = Form.useForm();
  const { data: services, isLoading, error } = useGetAllAmenitiesQuery();
  const { data: rentalLocations, isLoading: isLoadingRentalLocations } = useGetAllRentalLocationsQuery();

  useEffect(() => {
    console.log('Services data:', services);
    console.log('Services with status true:', services?.data?.filter(service => service.status === true));
  }, [services]);


  useEffect(() => {
    if (initialValues) {
      const location = rentalLocations?.data?.find(loc => loc.id === initialValues.rentalLocationId);
      const service = services?.data?.find(srv =>
        srv.id === initialValues.serviceId && srv.status === true
      );

      form.setFieldsValue({
        ...initialValues,
        rentalLocationId: {
          value: initialValues.rentalLocationId,
          label: location?.name
        },
        serviceId: service ? {
          value: initialValues.serviceId,
          label: service.name
        } : undefined
      });
    }
  }, [initialValues, form, services, rentalLocations]);

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        const submittedValues = {
          ...values,
          rentalLocationId: values.rentalLocationId?.value || values.rentalLocationId,
          serviceId: values.serviceId?.value || values.serviceId
        };
        console.log("Dữ liệu được cập nhật:", submittedValues);
        onConfirm(submittedValues);
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
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Cập nhật
        </Button>
      ]}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        name="updateRoomTypeForm"
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
            labelInValue
          >
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
          <Select
            placeholder="Chọn dịch vụ"
            loading={isLoading}
            labelInValue
          >
            {services?.data?.filter(service => service.status)?.map(service => (
              <Option key={service.id || service._id} value={service.id || service._id}>
                {service.name}
              </Option>
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

export default UpdateRoomTypeModal;
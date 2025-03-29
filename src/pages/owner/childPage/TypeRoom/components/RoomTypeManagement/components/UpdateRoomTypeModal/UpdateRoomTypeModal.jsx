import { Modal, Form, Input, InputNumber, Select, Button, Spin, Image, Upload, message } from 'antd';
import { useEffect } from 'react';
import { useGetAllAmenitiesQuery } from '../../../../../../../../redux/services/serviceApi';
import { useGetAllRentalLocationsQuery } from '../../../../../../../../redux/services/rentalLocationApi';
import styles from './UpdateRoomTypeModal.module.scss';
import { useState } from "react";
import { supabase } from "../../../../../../../../redux/services/supabase";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const MAX_IMAGES = 10;

const UpdateRoomTypeModal = ({ isOpen, onCancel, onConfirm, initialValues }) => {
  const [form] = Form.useForm();
  const { data: services, isLoading, error } = useGetAllAmenitiesQuery();
  const { data: rentalLocations, isLoading: isLoadingRentalLocations } = useGetAllRentalLocationsQuery();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      const formValues = {
        ...initialValues,
      };

      if (formValues.rentalLocationId && typeof formValues.rentalLocationId === 'object') {
        formValues.rentalLocationId = formValues.rentalLocationId._id || formValues.rentalLocationId.id;
      }

      if (formValues.serviceIds && Array.isArray(formValues.serviceIds) && formValues.serviceIds.length > 0) {
        formValues.serviceIds = formValues.serviceIds.map(service => 
          typeof service === 'object' ? service._id || service.id : service
        );
      } else if (formValues.serviceId) {
        formValues.serviceIds = [formValues.serviceId];
      }

      // Handle image field (can be array or single string)
      if (initialValues.image) {
        if (Array.isArray(initialValues.image)) {
          setFileList(initialValues.image.map((img, index) => ({
            uid: `existing-${index}`,
            url: img,
            name: `image-${index}`,
            status: 'done'
          })));
        } else {
          setFileList([{
            uid: 'existing-0',
            url: initialValues.image,
            name: 'image-0',
            status: 'done'
          }]);
        }
      } else {
        setFileList([]);
      }

      form.setFieldsValue(formValues);
    }
  }, [initialValues, form]);

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        const submittedValues = {
          ...values,
          // Always send image as array
          image: fileList.map(file => file.url)
        };

        console.log("Dữ liệu được cập nhật:", submittedValues);
        onConfirm(submittedValues);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    accept: ".jpg,.jpeg,.png",
    maxCount: MAX_IMAGES,
    beforeUpload: (file) => {
      if (fileList.length >= MAX_IMAGES) {
        message.error(`Bạn chỉ được tải lên tối đa ${MAX_IMAGES} ảnh!`);
        return Upload.LIST_IGNORE;
      }
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("Chỉ cho phép tải lên file JPG/PNG!");
        return Upload.LIST_IGNORE;
      }
      if (file.size / 1024 / 1024 >= 5) {
        message.error("Hình ảnh phải nhỏ hơn 5MB!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      setUploading(true);
      const fileName = `${Date.now()}-${file.name}`;

      try {
        const { data, error } = await supabase.storage
          .from("image")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (error || !data) throw new Error("Tải ảnh lên thất bại!");

        const { data: urlData } = supabase.storage
          .from("image")
          .getPublicUrl(data.path);
        if (!urlData.publicUrl) throw new Error("Không lấy được URL ảnh!");

        setFileList(prev => [
          ...prev,
          {
            uid: file.uid,
            url: urlData.publicUrl,
            name: fileName,
            path: data.path,
          }
        ]);

        message.success("Tải ảnh lên thành công!");
        onSuccess("ok");
      } catch (error) {
        message.error(error.message);
        onError(error);
      } finally {
        setUploading(false);
      }
    },
  };

  const handleRemove = async (file) => {
    setUploading(true);
    try {
      // Only delete from storage if it's a newly uploaded image
      if (!file.uid.startsWith('existing-')) {
        const filePath = file.path || file.name;
        const { error } = await supabase.storage.from("image").remove([filePath]);
        if (error) throw error;
      }

      setFileList(prev => prev.filter(item => item.uid !== file.uid));
      message.success("Đã xóa ảnh!");
    } catch (error) {
      message.error("Lỗi khi xóa ảnh!");
    } finally {
      setUploading(false);
    }
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

        <Form.Item label={`Hình ảnh loại phòng (${fileList.length}/${MAX_IMAGES})`}>
          <Spin spinning={uploading} tip="Đang xử lý...">
            <Dragger {...uploadProps} showUploadList={false}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Kéo và thả ảnh vào đây hoặc nhấn để tải lên
              </p>
              <p className="ant-upload-hint">
                Hỗ trợ JPG, PNG. Tối đa {MAX_IMAGES} ảnh, mỗi ảnh ≤5MB
              </p>
            </Dragger>
          </Spin>

          <div style={{ display: "flex", flexWrap: "wrap", marginTop: 16, gap: 8 }}>
            {fileList.map((file) => (
              <div key={file.uid} style={{ position: "relative" }}>
                <Image
                  src={file.url}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
                <DeleteOutlined
                  onClick={() => handleRemove(file)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    color: "white",
                    background: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: 4,
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                />
              </div>
            ))}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateRoomTypeModal;
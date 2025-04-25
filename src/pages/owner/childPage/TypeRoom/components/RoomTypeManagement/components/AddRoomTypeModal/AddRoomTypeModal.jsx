import { Modal, Form, Input, InputNumber, Select, Button, Spin, Image, Upload, message } from "antd";
import { useGetAllAmenitiesQuery } from '../../../../../../../../redux/services/serviceApi';
import { useGetAllRentalLocationsQuery } from '../../../../../../../../redux/services/rentalLocationApi';
import styles from './AddRoomTypeModal.module.scss';
import { useState } from "react";
import { supabase } from "../../../../../../../../redux/services/supabase";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import { useGetOwnerDetailByUserIdQuery } from '../../../../../../../../redux/services/ownerApi';
import { useParams } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const MAX_IMAGES = 10;

const AddRoomTypeModal = ({ isOpen, onCancel, onConfirm }) => {
  const { id } = useParams();
  const [form] = Form.useForm();


  const { data: ownerDetailData, isLoading: isOwnerDetailLoading } = useGetOwnerDetailByUserIdQuery(id);
  const ownerId = ownerDetailData?.id;

  const { data: rentalLocations, isLoading: isLoadingRentalLocations, error: rentalLocationsError } = useGetAllRentalLocationsQuery(ownerId, {
    skip: !ownerId
  });
  const { data: services, isLoading: isServicesLoading, error: servicesError } = useGetAllAmenitiesQuery(
    { ownerId },
    { skip: !ownerId }
  );
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          numberOfPasswordRoom: values.numberOfPasswordRoom || 0,
          image: fileList.map(file => file.url),
          serviceIds: values.serviceIds ? values.serviceIds :
            values.serviceId ? [values.serviceId] : []
        };

        if (formattedValues.serviceIds && formattedValues.serviceId) {
          delete formattedValues.serviceId;
        }

        console.log('Sending to API:', formattedValues);
        onConfirm(formattedValues);
        form.resetFields();
        setFileList([]);
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
      const filePath = file.path || file.name;
      const { error } = await supabase.storage.from("image").remove([filePath]);

      if (error) throw error;

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
      title="Thêm loại phòng mới"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={uploading}
        >
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
            loading={isLoadingRentalLocations || isOwnerDetailLoading}
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
            loading={isServicesLoading}
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

        <Form.Item
          name="numberOfPasswordRoom"
          label="Mật khẩu loại phòng gồm mấy số?"
          rules={[{
            required: true,
            message: 'Vui lòng chọn độ dài mật khẩu'
          }]}
        >
          <Select
            placeholder="Chọn độ dài mật khẩu"
            style={{ width: '100%' }}
          >
            <Option value={0}>0 số (Không có mật khẩu)</Option>
            <Option value={1}>2 số</Option>
            <Option value={2}>4 số</Option>
            <Option value={3}>6 số</Option>
            <Option value={4}>8 số</Option>
          </Select>
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

export default AddRoomTypeModal;
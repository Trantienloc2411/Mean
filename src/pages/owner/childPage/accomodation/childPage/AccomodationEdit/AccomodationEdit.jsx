import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Select,
  Modal,
  message,
  Typography,
  Divider,
  Space,
  Spin,
  Badge,
  Input
} from "antd";
import { SaveOutlined, InfoCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useLocation } from "react-router-dom";
import ImageUpload from "../../../rentalLocation/create/ImageUpload"; 
import { 
  useUpdateAccommodationMutation 
} from "../../../../../../redux/services/accommodationApi"; 
import { useGetAllAccommodationTypesQuery } from "../../../../../../redux/services/accommodationTypeApi"; 
import styles from "./AccomodationEdit.module.scss";

const { Title, Text } = Typography;
const { Option } = Select;

const ACCOMMODATION_STATUS = Object.freeze({
  AVAILABLE: 1,
  BOOKED: 2,
  CLEANING: 3,
  PREPARING: 4,
  MAINTENANCE: 5,
  CLOSED: 6,
  INUSE: 7
});

function getStatusColor(status) {
  switch (status) {
    case ACCOMMODATION_STATUS.AVAILABLE: return 'green';
    case ACCOMMODATION_STATUS.BOOKED: return 'blue';
    case ACCOMMODATION_STATUS.CLEANING: return 'cyan';
    case ACCOMMODATION_STATUS.PREPARING: return 'gold';
    case ACCOMMODATION_STATUS.MAINTENANCE: return 'orange';
    case ACCOMMODATION_STATUS.CLOSED: return 'red';
    case ACCOMMODATION_STATUS.INUSE: return 'cyan';
    default: return 'default';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'AVAILABLE': return 'Có sẵn';
    case 'BOOKED': return 'Đã đặt';
    case 'CLEANING': return 'Đang dọn dẹp';
    case 'PREPARING': return 'Đang chuẩn bị';
    case 'MAINTENANCE': return 'Bảo trì';
    case 'CLOSED': return 'Đóng cửa';
    case 'INUSE': return 'Đang sử dụng';
    default: return status;
  }
}

export default function AccommodationEdit({ 
  visible, 
  onCancel, 
  onSuccess, 
  accommodationId, 
  accommodationData,
  isLoading: isLoadingAccommodation 
}) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  
  const location = useLocation();
  const pathnameParts = location.pathname.split("/");
  const rentalLocationId = pathnameParts[pathnameParts.indexOf("rental-location") + 1];
  
  const [updateAccommodation, { isLoading }] = useUpdateAccommodationMutation();
  const { data: accommodationTypes } = useGetAllAccommodationTypesQuery();

  useEffect(() => {
    if (visible && accommodationData) {
      form.setFieldsValue({
        accommodationTypeId: accommodationData.accommodationTypeId?._id,
        roomNo: accommodationData.roomNo || "",
        description: accommodationData.description || "",
        status: accommodationData.status
      });

      setFileList([]);
      
      if (accommodationData.image && Array.isArray(accommodationData.image)) {
        const newFileList = accommodationData.image
          .filter(url => url && url.trim() !== "") // Filter out empty strings
          .map((url, index) => ({
            uid: `-${index + 1}`,
            name: `image-${index + 1}.png`,
            status: 'done',
            url: url,
          }));
        
        if (newFileList.length > 0) {
          setFileList(newFileList);
        }
      }
    }
  }, [visible, accommodationData, form]);

  const handleSaveAction = async (values) => {
    try {
      const imageUrls = fileList.map(file => file.url || "").filter(url => url);
      
      const updatedData = {
        id: accommodationId,
        rentalLocationId: rentalLocationId,
        accommodationTypeId: values.accommodationTypeId,
        roomNo: values.roomNo,
        description: values.description || "",
        image: imageUrls.length > 0 ? imageUrls : [""], 
        status: values.status
      };
      
      await updateAccommodation(updatedData).unwrap();
      message.success({
        content: "Cập nhật phòng thành công!",
        style: { marginTop: '20px' },
      });
      onSuccess();
    } catch (error) {
      console.error("Error updating accommodation:", error);
      message.error({
        content: "Có lỗi xảy ra khi cập nhật phòng!",
        style: { marginTop: '20px' },
      });
    }
  };

  const statusOptions = Object.entries(ACCOMMODATION_STATUS).map(([label, value]) => ({
    label: getStatusLabel(label),
    value,
    color: getStatusColor(value)
  }));

  return (
    <Modal
      title={<Title level={4} className={styles.modalTitle}>Cập nhật thông tin phòng</Title>}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
      destroyOnClose
      bodyStyle={{ padding: '20px' }}
    >
      <Divider className={styles.modalDivider} />
      
      {isLoadingAccommodation ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Text>Đang tải thông tin phòng...</Text>
        </div>
      ) : (
        <Form
          form={form}
          onFinish={handleSaveAction}
          layout="vertical"
          className={styles.formContainer}
        >
          <div className={styles.formSection}>
            <Form.Item 
              name="accommodationTypeId"
              label={<Text strong>Loại phòng</Text>}
              rules={[{ required: true, message: "Vui lòng chọn loại phòng!" }]}
            >
              <Select 
                placeholder="Chọn loại phòng"
                size="large"
                className={styles.selectLarge}
              >
                {accommodationTypes?.data?.map(type => (
                  <Option key={type._id} value={type._id}>{type.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="roomNo"
              label={<Text strong>Số phòng</Text>}
              rules={[{ required: true, message: "Vui lòng nhập số phòng!" }]}
            >
              <Input
                placeholder="Nhập số phòng (vd: 001)"
                size="large"
                className={styles.inputField}
              />
            </Form.Item>

            <Form.Item 
              name="description" 
              label={<Text strong>Mô tả</Text>}
            >
              <TextArea
                rows={4}
                placeholder="Tối đa 255 ký tự"
                maxLength={255}
                showCount
                className={styles.textArea}
              />
            </Form.Item>

            <Form.Item 
              name="status" 
              label={<Text strong>Trạng thái</Text>}
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select 
                placeholder="Chọn trạng thái"
                size="large"
                className={styles.selectLarge}
                optionLabelProp="label"
              >
                {statusOptions.map(option => (
                  <Option key={option.value} value={option.value} label={option.label}>
                    <Space>
                      <Badge color={option.color} className={styles.statusBadge} />
                      {option.label}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          <div className={styles.imageUploadSection}>
            <Form.Item 
              label={<Text strong>Hình ảnh phòng</Text>}
            >
              <ImageUpload fileList={fileList} setFileList={setFileList} />
              <div className={styles.imageHint}>
                <InfoCircleOutlined />
                <Text type="secondary">Ảnh đầu tiên sẽ được sử dụng làm ảnh chính</Text>
              </div>
            </Form.Item>
          </div>

          <div className={styles.footerButtons}>
            <Button 
              onClick={onCancel} 
              size="large"
              className={styles.cancelButton}
            >
              Huỷ
            </Button>
            <Button
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={isLoading}
              className={styles.saveButton}
              size="large"
            >
              Lưu lại
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
}
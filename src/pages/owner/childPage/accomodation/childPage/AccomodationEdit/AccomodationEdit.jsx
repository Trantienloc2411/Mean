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
import { SaveOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useLocation } from "react-router-dom";
import ImageUpload from "../../../rentalLocation/create/ImageUpload"; 
import { 
  useUpdateAccommodationMutation 
} from "../../../../../../redux/services/accommodationApi"; 
import { useGetAllAccommodationTypesQuery, useCreateAccommodationTypeMutation } from "../../../../../../redux/services/accommodationTypeApi"; 
import styles from "./AccomodationEdit.module.scss";
import AddRoomTypeModal from "../../../TypeRoom/components/RoomTypeManagement/components/AddRoomTypeModal/AddRoomTypeModal";

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
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  
  const location = useLocation();
  const pathnameParts = location.pathname.split("/");
  const rentalLocationId = pathnameParts[pathnameParts.indexOf("rental-location") + 1];
  
  const [updateAccommodation, { isLoading }] = useUpdateAccommodationMutation();
  const [createAccommodationType] = useCreateAccommodationTypeMutation();
  const { data: accommodationTypes, refetch: accommodationTypesRefetch } = useGetAllAccommodationTypesQuery(rentalLocationId);

  useEffect(() => {
    if (visible && accommodationData && accommodationTypes?.data) {
      const currentRoomType = accommodationTypes.data.find(
        type => type._id === accommodationData.accommodationTypeId?._id
      );
      
      if (currentRoomType) {
        setSelectedRoomType(currentRoomType);
      }
      
      form.setFieldsValue({
        accommodationTypeId: accommodationData.accommodationTypeId?._id,
        roomNo: accommodationData.roomNo || "",
        description: accommodationData.description || "",
        status: accommodationData.status
      });

      setFileList([]);
      
      if (accommodationData.image && Array.isArray(accommodationData.image)) {
        const newFileList = accommodationData.image
          .filter(url => url && url.trim() !== "") 
          .map((url, index) => ({
            uid: `-${index + 1}`,
            name: `image-${index + 1}.png`,
            status: 'done',
            url: url,
          }));
        
        if (newFileList.length > 0) {
          setFileList(newFileList);
        }
      } else if (accommodationData.image && typeof accommodationData.image === 'string' && accommodationData.image.trim() !== "") {
        setFileList([{
          uid: '-1',
          name: 'image-1.png',
          status: 'done',
          url: accommodationData.image,
        }]);
      }
    }
  }, [visible, accommodationData, form, accommodationTypes]);

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

  const handleAddRoomType = async (values) => {
    try {
      const valuesWithLocation = {
        ...values,
        rentalLocationId: rentalLocationId,
      };
      
      await createAccommodationType(valuesWithLocation).unwrap();
      message.success("Loại phòng đã được thêm thành công!");
      
      setIsAddTypeModalOpen(false); 
      
      await accommodationTypesRefetch(); 
  
    } catch (error) {
      message.error("Thêm loại phòng thất bại!");
    }
  };

  const handleRoomTypeChange = (typeId) => {
    const selectedType = accommodationTypes?.data?.find(type => type._id === typeId);
    if (selectedType) {
      setSelectedRoomType(selectedType);
    }
  };

  const statusOptions = Object.entries(ACCOMMODATION_STATUS).map(([label, value]) => ({
    label: getStatusLabel(label),
    value,
    color: getStatusColor(value)
  }));

  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN') || 0;
  };

  const renderRoomTypeContent = (type) => (
    <div className={styles.optionContent}>
      <div className={styles.optionHeader}>
        <span className={styles.typeName}>{type.name}</span>
        <span className={styles.prices}>
          Base Price: {formatPrice(type.basePrice)}đ - Overtime Hourly Price: {formatPrice(type.overtimeHourlyPrice)}đ/giờ
        </span>
      </div>
      {type.serviceIds?.length > 0 && (
        <div className={styles.services}>
          <Text type="secondary">
            Dịch vụ: {type.serviceIds.map(s => s.name).join(', ')}
          </Text>
        </div>
      )}
    </div>
  );

  return (
    <>
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
                  optionLabelProp="label"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  open={selectOpen}
                  onDropdownVisibleChange={(open) => setSelectOpen(open)}
                  onChange={handleRoomTypeChange}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <div
                        style={{
                          padding: '8px',
                          cursor: 'pointer',
                          color: '#1890ff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onClick={() => {
                          setSelectOpen(false); 
                          setIsAddTypeModalOpen(true); 
                        }}
                      >
                        <PlusOutlined />
                        <Text strong>Thêm loại phòng mới</Text>
                      </div>
                    </>
                  )}
                >
                  {accommodationTypes?.data?.map(type => (
                    <Option 
                      key={type._id} 
                      value={type._id}
                      label={type.name}
                    >
                      {renderRoomTypeContent(type)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              {/* Display selected room type information */}
              {selectedRoomType && !selectOpen && (
                <div className={styles.selectedRoomTypeInfo}>
                  {renderRoomTypeContent(selectedRoomType)}
                </div>
              )}

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

      <AddRoomTypeModal
        isOpen={isAddTypeModalOpen}
        onCancel={() => setIsAddTypeModalOpen(false)}
        onConfirm={handleAddRoomType}
        rentalLocationId={rentalLocationId}
        forceRender 
      />
    </>
  );
}
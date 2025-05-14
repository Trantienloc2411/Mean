import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Select,
  Modal,
  message,
  Typography,
  Divider,
  Input,
  Radio,
  Space,
  InputNumber,
  Tooltip
} from "antd";
import { SaveOutlined, InfoCircleOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useLocation } from "react-router-dom";
import ImageUpload from "../../../rentalLocation/create/ImageUpload";
import { useCreateAccommodationMutation } from "../../../../../../redux/services/accommodationApi";
import { useGetAllAccommodationTypesQuery } from "../../../../../../redux/services/accommodationTypeApi";
import styles from "./AccomodationCreate.module.scss";
import AddRoomTypeModal from "../../../TypeRoom/components/RoomTypeManagement/components/AddRoomTypeModal/AddRoomTypeModal";
import { useCreateAccommodationTypeMutation } from "../../../../../../redux/services/accommodationTypeApi";
import { useGetOwnerDetailByUserIdQuery } from "../../../../../../redux/services/ownerApi";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AccommodationCreate({ visible, onCancel, onSuccess }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [createMode, setCreateMode] = useState("single");
  const [isCreating, setIsCreating] = useState(false);
  const { id } = useParams();

  const location = useLocation();
  const pathnameParts = location.pathname.split("/");
  const rentalLocationId = pathnameParts[pathnameParts.indexOf("rental-location") + 1];

  const [createAccommodation, { isLoading }] = useCreateAccommodationMutation();
  const [createAccommodationType] = useCreateAccommodationTypeMutation();
  const { data: accommodationTypes, refetch: accommodationTypesRefetch } = useGetAllAccommodationTypesQuery(rentalLocationId);

  const { data: ownerDetailData } = useGetOwnerDetailByUserIdQuery(id);
  const ownerId = ownerDetailData?.id;

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setFileList([]);
      setCreateMode("single");
    }
  }, [visible, form]);

  const padRoomNumber = (num, length = 3) => {
    return String(num).padStart(length, '0');
  };

  const handleSaveAction = async (values) => {
    setIsCreating(true);
    try {
      if (createMode === "single") {
        const accommodationData = {
          rentalLocationId: rentalLocationId,
          accommodationTypeId: values.accommodationTypeId,
          roomNo: values.roomNo,
          description: values.description || "",
          image: fileList.length > 0 ? fileList[0].url : "",
          status: 1
        };

        await createAccommodation(accommodationData).unwrap();
        message.success({
          content: "Tạo phòng thành công!",
          style: { marginTop: '20px' },
        });
      } else {
        const { startRoom, endRoom } = values;
        
        if (parseInt(startRoom) > parseInt(endRoom)) {
          message.error("Số phòng bắt đầu phải nhỏ hơn hoặc bằng số phòng kết thúc!");
          setIsCreating(false);
          return;
        }

        const roomLength = Math.max(startRoom.length, endRoom.length);
        
        const accommodations = [];
        for (let i = parseInt(startRoom); i <= parseInt(endRoom); i++) {
          accommodations.push({
            rentalLocationId: rentalLocationId,
            accommodationTypeId: values.accommodationTypeId,
            roomNo: padRoomNumber(i, roomLength),
            description: values.description || "",
            image: fileList.length > 0 ? fileList[0].url : "",
            status: 1
          });
        }

        await createAccommodation(accommodations).unwrap();
        message.success({
          content: `Đã tạo thành công ${accommodations.length} phòng!`,
          style: { marginTop: '20px' },
        });
      }

      onSuccess();
      form.resetFields();
      setFileList([]);
      setCreateMode("single");
    } catch (error) {
      console.error("Error creating accommodation:", error);
      message.error({
        content: "Có lỗi xảy ra khi tạo phòng!",
        style: { marginTop: '20px' },
      });
    } finally {
      setIsCreating(false);
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

  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN') || 0;
  };

  return (
    <>
      <Modal
        title={<Title level={4} className={styles.modalTitle}>Tạo thông tin phòng</Title>}
        open={visible}
        onCancel={onCancel}
        width={800}
        footer={null}
        destroyOnClose
        bodyStyle={{ padding: '20px' }}
      >
        <Divider className={styles.modalDivider} />

        <Form
          form={form}
          onFinish={handleSaveAction}
          initialValues={{ status: true, createMode: "single" }}
          layout="vertical"
          className={styles.formContainer}
        >
          <div className={styles.createModeSelector}>
            <Form.Item
              name="createMode"
              label={
                <Space>
                  <Text strong>Chế độ tạo phòng</Text>
                  <Tooltip title="Chọn 'Tạo nhiều phòng' để tạo một loạt các phòng có cùng tính năng với số phòng liên tiếp">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
            >
              <Radio.Group 
                onChange={(e) => setCreateMode(e.target.value)} 
                value={createMode}
              >
                <Radio value="single">Tạo một phòng</Radio>
                <Radio value="batch">Tạo nhiều phòng</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className={styles.formSection}>
            <Form.Item
              name="accommodationTypeId"
              label={<Text strong>Loại phòng</Text>}
              rules={[{ required: true, message: "Vui lòng chọn loại phòng!" }]}
            >
              <Select
                placeholder="Chọn loại phòng"
                size="large"
                style={{ width: '100%' }}
                optionLabelProp="label"
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                open={selectOpen}
                onDropdownVisibleChange={(open) => setSelectOpen(open)} 
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
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {createMode === "single" ? (
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
            ) : (
              <div className={styles.batchRoomNumbers}>
                <Form.Item
                  name="startRoom"
                  label={<Text strong>Từ số phòng</Text>}
                  rules={[{ required: true, message: "Vui lòng nhập số phòng bắt đầu!" }]}
                  style={{ display: 'inline-block', width: 'calc(50% - 12px)', marginRight: '24px' }}
                >
                  <Input
                    placeholder="Vd: 001"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="endRoom"
                  label={<Text strong>Đến số phòng</Text>}
                  rules={[{ required: true, message: "Vui lòng nhập số phòng kết thúc!" }]}
                  style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                >
                  <Input
                    placeholder="Vd: 010"
                    size="large"
                  />
                </Form.Item>
                <div className={styles.batchHint}>
                  <InfoCircleOutlined />
                  <Text type="secondary">
                    Hệ thống sẽ tạo tất cả các phòng trong khoảng từ 001 đến 010 (001, 002, 003, ... 010)
                  </Text>
                </div>
              </div>
            )}

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
          </div>

          <div className={styles.imageUploadSection}>
            <Form.Item
              label={<Text strong>Hình ảnh phòng</Text>}
            >
              <ImageUpload fileList={fileList} setFileList={setFileList} />
              <div className={styles.imageHint}>
                <InfoCircleOutlined />
                <Text type="secondary">
                  {createMode === "single" 
                    ? "Ảnh đầu tiên sẽ được sử dụng làm ảnh chính" 
                    : "Tất cả các phòng sẽ sử dụng cùng một hình ảnh"}
                </Text>
              </div>
            </Form.Item>
          </div>

          <div className={styles.footerButtons}>
            <Button
              onClick={onCancel}
              size="large"
              className={styles.cancelButton}
              disabled={isCreating}
            >
              Huỷ
            </Button>
            <Button
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={isLoading || isCreating}
              className={styles.saveButton}
              size="large"
            >
              {createMode === "single" ? "Lưu lại" : "Tạo phòng hàng loạt"}
            </Button>
          </div>
        </Form>
      </Modal>

      <AddRoomTypeModal
        isOpen={isAddTypeModalOpen}
        onCancel={() => setIsAddTypeModalOpen(false)}
        onConfirm={handleAddRoomType}
        rentalLocationId={rentalLocationId}
        ownerId={ownerId}
        forceRender
      />
    </>
  );
}

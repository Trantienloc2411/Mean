import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Select,
  Modal,
  message,
  Typography,
  Divider,
  Input
} from "antd";
import { SaveOutlined, InfoCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useLocation } from "react-router-dom";
import ImageUpload from "../../../rentalLocation/create/ImageUpload";
import { useCreateAccommodationMutation } from "../../../../../../redux/services/accommodationApi";
import { useGetAllAccommodationTypesQuery } from "../../../../../../redux/services/accommodationTypeApi";
import styles from "./AccomodationCreate.module.scss";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AccommodationCreate({ visible, onCancel, onSuccess }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const location = useLocation();
  const pathnameParts = location.pathname.split("/");
  const rentalLocationId = pathnameParts[pathnameParts.indexOf("rental-location") + 1];

  const [createAccommodation, { isLoading }] = useCreateAccommodationMutation();
  const { data: accommodationTypes } = useGetAllAccommodationTypesQuery(rentalLocationId); 

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, form]);

  const handleSaveAction = async (values) => {
    try {
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
      onSuccess();
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Error creating accommodation:", error);
      message.error({
        content: "Có lỗi xảy ra khi tạo phòng!",
        style: { marginTop: '20px' },
      });
    }
  };

  return (
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
        initialValues={{
          status: true,
        }}
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
              style={{ width: '100%' }}
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
    </Modal>
  );
}
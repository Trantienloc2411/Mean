import { useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Space,
  Button,
  Form,
  Input,
  Upload,
  message,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import styles from "./AccountInfo.module.scss";
import { supabase } from "../../../../../../redux/services/supabase";

const { Text } = Typography;

const ProfileCard = ({ initialData, onUpdate }) => {
  const userRole = localStorage.getItem("user_role")?.toLowerCase();
  const canEdit = userRole === `"owner"`;

  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Đặt giá trị mặc định cho các trường nếu không có dữ liệu truyền vào
  const defaultData = {
    fullName: "N/a",
    email: "N/a",
    phone: "N/a",
    avatar: "",
    ...initialData, // Ghi đè dữ liệu mặc định nếu có dữ liệu từ props
  };

  const handleEdit = () => {
    form.setFieldsValue({
      fullName: defaultData.fullName,
      email: defaultData.email,
      phone: defaultData.phone,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFileList([]);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let avatarUrl = defaultData.avatar;

      // Upload file if exists
      if (fileList.length > 0) {
        const file = fileList[0].originFileObj;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = publicData.publicUrl;
      }

      // Check if there are actual changes
      const trimmedValues = {
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
      };

      const hasChanges = 
        trimmedValues.fullName !== defaultData.fullName ||
        trimmedValues.phone !== defaultData.phone ||
        fileList.length > 0;

      if (!hasChanges) {
        message.info("Không có thay đổi nào để cập nhật!");
        setIsEditing(false);
        setFileList([]);
        return;
      }

      // If you have an onUpdate callback, call it with the updated data
      if (onUpdate) {
        onUpdate({
          ...defaultData,
          fullName: trimmedValues.fullName,
          phone: trimmedValues.phone,
          avatar: avatarUrl,
        });
      }

      message.success("Thông tin đã được cập nhật thành công!");
      setIsEditing(false);
      setFileList([]);
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Bạn chỉ có thể tải lên file hình ảnh!");
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Hình ảnh phải nhỏ hơn 2MB!");
    }

    return isImage && isLt2M;
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  /**
   * Hàm render một trường thông tin
   * @param {string} label - Tên của trường thông tin (ví dụ: "Full Name")
   * @param {string} value - Giá trị tương ứng
   */
  const renderField = (label, value) => {
    return (
      <div key={label} className={styles.fieldContainer}>
        <Text type="secondary" className={styles.fieldLabel}>
          {label}
        </Text>
        <div className={styles.fieldValue}>{value}</div>
      </div>
    );
  };

  const renderEditForm = () => (
    <Form
      form={form}
      layout="vertical"
      className={styles.editForm}
      initialValues={{
        fullName: defaultData.fullName,
        email: defaultData.email,
        phone: defaultData.phone,
      }}
    >
      <Form.Item
        name="fullName"
        label="Họ và tên"
        rules={[
          { required: true, message: "Vui lòng nhập họ và tên!" },
          { whitespace: true, message: "Họ và tên không được chỉ chứa khoảng trắng!" },
          { 
            validator: (_, value) => {
              if (value && value.trim() === "") {
                return Promise.reject("Họ và tên không được chỉ chứa khoảng trắng!");
              }
              return Promise.resolve();
            }
          }
        ]}
        normalize={(value) => (value || "").trim()}
      >
        <Input placeholder="Nhập họ và tên" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input placeholder="Nhập email" disabled />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Số điện thoại"
        rules={[
          { required: true, message: "Vui lòng nhập số điện thoại!" },
          { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" },
          { whitespace: true, message: "Số điện thoại không được chứa khoảng trắng!" }
        ]}
        normalize={(value) => (value || "").trim()}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item
        name="avatar"
        label="Ảnh đại diện"
        className={styles.uploadContainer}
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          maxCount={1}
          customRequest={({ onSuccess }) =>
            setTimeout(() => onSuccess("ok"), 0)
          }
        >
          {fileList.length < 1 && (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Tải lên</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item className={styles.buttonContainer}>
        <Space>
          <Button
            type="primary"
            onClick={handleSave}
            icon={<SaveOutlined />}
            loading={loading}
            disabled={loading}
          >
            Lưu
          </Button>
          <Button onClick={handleCancel} icon={<CloseOutlined />}>
            Hủy
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <Card
      title="Thông tin tài khoản"
      extra={
        !isEditing &&
        canEdit && (
          <Button type="text" icon={<EditOutlined />} onClick={handleEdit}>
            Chỉnh sửa
          </Button>
        )
      }
      className={styles.cardStyle}
    >
      {isEditing ? (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div className={styles.avatarContainer}>
            <Avatar size={80} src={defaultData.avatar} />
          </div>
          {renderEditForm()}
        </Space>
      ) : (
        <div className={styles.gridContainer}>
          {/* Phần hiển thị Avatar */}
          <div className={styles.avatarContainer}>
            <Avatar size={80} src={defaultData.avatar} />
          </div>

          {/* Phần hiển thị các trường thông tin */}
          <div className={styles.infoContainer}>
            {renderField("Full Name", defaultData.fullName)}
            {renderField("Email", defaultData.email)}
            {renderField("Phone", defaultData.phone)}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProfileCard;

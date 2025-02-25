import { useState } from "react";
import { Avatar, Button, Form, Input, Upload, message, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useUpdateUserMutation } from "../../../../../../redux/services/userApi";
import { useParams } from "react-router-dom";
import { supabase } from "../../../../../../redux/services/supabase";

export default function AccountInformation({ userData, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [updateUser] = useUpdateUserMutation();
  const { id } = useParams();
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    if (uploading) return;
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      message.error("Số điện thoại phải có đúng 10 số!");
      return;
    }
    const birthDate = dayjs(formData.doB, "DD/MM/YYYY");
    const age = dayjs().diff(birthDate, "year");
    if (age < 18) {
      message.error("Bạn phải trên 18 tuổi!");
      return;
    }

    try {
      const updatedData = {
        fullName: formData.fullName,
        phone: formData.phone,
        doB: formData.doB,
        avatar: formData.avatar,
      };

      await updateUser({ id, updatedUser: updatedData }).unwrap();

      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      await refetch();
    } catch (error) {
      message.error("Cập nhật thất bại, vui lòng thử lại!");
      setFormData(userData);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const handleUploadAvatar = async (file) => {
    setUploading(true);
    const fileName = `avatars/${id}-${Date.now()}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (error) {
      message.error("Upload ảnh thất bại!");
      setUploading(false);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    setUploading(false);

    if (publicUrl?.publicUrl) {
      setFormData((prev) => ({
        ...prev,
        avatar: publicUrl.publicUrl,
      }));
    }

    return publicUrl?.publicUrl;
  };

  return (
    <div>
      <h3 style={{ fontSize: 24 }}>Thông tin tài khoản</h3>
      <div style={{ display: "grid", gridTemplateColumns: "20% auto" }}>
        <div
          style={{
            textAlign: "center",
            gap: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            style={{ width: "120px", height: "120px" }}
            src={formData.avatar || "profile-placeholder.jpg"}
          />

          {isEditing && (
            <Upload
              showUploadList={false}
              beforeUpload={async (file) => {
                const avatarUrl = await handleUploadAvatar(file);
                if (avatarUrl) {
                  setFormData((prev) => ({ ...prev, avatar: avatarUrl }));
                }
                return false;
              }}
            >
              <Button icon={<UploadOutlined />} disabled={uploading}>
                {uploading ? "Đang tải..." : "Đổi ảnh đại diện"}
              </Button>
            </Upload>
          )}
        </div>

        <Form layout="vertical">
          <Form.Item label="Họ và tên">
            <Input
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              disabled={!isEditing || uploading}
            />
          </Form.Item>

          <Form.Item label="Email">
            <Input value={formData.email} disabled={true} />
          </Form.Item>

          <Form.Item label="Số điện thoại">
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={!isEditing || uploading}
            />
          </Form.Item>

          <Form.Item label="Ngày sinh">
            <DatePicker
              value={formData.doB ? dayjs(formData.doB, "DD/MM/YYYY") : null}
              onChange={(date, dateString) =>
                setFormData({ ...formData, doB: dateString })
              }
              format="DD/MM/YYYY"
              disabled={!isEditing || uploading}
            />
          </Form.Item>

          {isEditing ? (
            <div
              style={{ display: "flex", justifyContent: "end", gap: "20px" }}
            >
              <Button type="primary" onClick={handleSave} disabled={uploading}>
                {uploading ? "Đang tải..." : "Lưu"}
              </Button>
              <Button type="default" onClick={handleCancel}>
                Thoát
              </Button>
            </div>
          ) : (
            <div
              style={{ display: "flex", justifyContent: "end", gap: "20px" }}
            >
              <Button type="default" onClick={() => setIsEditing(true)}>
                Chỉnh sửa
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}

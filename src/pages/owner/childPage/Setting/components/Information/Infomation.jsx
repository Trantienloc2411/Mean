import { useState } from "react";
import { Avatar, Button, Form, Input, Upload, message, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useUpdateUserMutation } from "../../../../../../redux/services/userApi";
import { useParams } from "react-router-dom";
import { supabase } from "../../../../../../redux/services/supabase";

export default function Information({ userData, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [updateUser] = useUpdateUserMutation();
  const { id } = useParams();
  const [uploading, setUploading] = useState(false);

  const handleUploadAvatar = async (file) => {
    setUploading(true);
    const fileName = `avatars/${id}-${Date.now()}`; // Tạo tên file duy nhất
    const { data, error } = await supabase.storage
      .from("avatars") // Thay bằng tên bucket trong Supabase
      .upload(fileName, file);

    if (error) {
      message.error("Upload ảnh thất bại!");
      setUploading(false);
      return null;
    }

    // Lấy URL ảnh sau khi upload
    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    setUploading(false);
    return publicUrl.publicUrl;
  };

  const handleSave = async () => {
    if (uploading) return; // Không cho phép lưu khi đang upload
    try {
      const updatedData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        doB: formData.doB,
        avatarUrl: formData.avatar,
      };

      await updateUser({ id: id, updatedUser: updatedData }).unwrap();

      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      await refetch(); // Gọi lại API để cập nhật dữ liệu mới
    } catch (error) {
      message.error("Cập nhật thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div>
      <h2>Thông tin tài khoản</h2>
      <div>
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
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing || uploading}
              />
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
              <Button type="primary" onClick={handleSave} disabled={uploading}>
                {uploading ? "Đang tải..." : "Lưu"}
              </Button>
            ) : (
              <Button type="default" onClick={() => setIsEditing(true)}>
                Chỉnh sửa
              </Button>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}

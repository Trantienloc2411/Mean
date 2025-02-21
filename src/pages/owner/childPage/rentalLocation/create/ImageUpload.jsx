import { Upload, message, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import { supabase } from "../../../../../redux/services/supabase";

const { Dragger } = Upload;

export default function ImageUpload({ fileList, setFileList }) {
  const [uploading, setUploading] = useState(false); // Trạng thái loading

  const uploadProps = {
    name: "file",
    multiple: true,
    accept: ".jpg,.jpeg,.png",
    maxCount: 5,
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
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
      setUploading(true); // Bắt đầu loading
      const fileName = `${Date.now()}-${file.name}`;

      // Tải ảnh lên Supabase Storage
      const { data, error } = await supabase.storage
        .from("image")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        message.error("Tải ảnh lên thất bại!");
        onError(error);
        setUploading(false);
        return;
      }

      // Lấy public URL từ Supabase
      const { data: publicUrl } = supabase.storage
        .from("image")
        .getPublicUrl(data.path);

      if (publicUrl) {
        setFileList((prev) => [
          ...prev,
          { uid: file.uid, url: publicUrl.publicUrl, name: file.name },
        ]);
        message.success("Tải ảnh lên thành công!");
        onSuccess("ok");
      } else {
        message.error("Không lấy được URL ảnh!");
        onError("Lỗi lấy URL");
      }
      setUploading(false); // Kết thúc loading
    },
    onRemove: async (file) => {
      const fileName = file.url.split("/").pop(); // Lấy tên file từ URL
      await supabase.storage.from("image").remove([fileName]);

      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      message.success("Đã xóa ảnh!");
    },
    fileList,
  };

  return (
    <Spin spinning={uploading} tip="Đang tải ảnh lên...">
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Kéo và thả ảnh vào đây hoặc nhấn để tải lên
        </p>
        <p className="ant-upload-hint">
          Hỗ trợ JPG, PNG. Dung lượng tối đa: 5MB
        </p>
      </Dragger>
    </Spin>
  );
}

import { Upload, message, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import { supabase } from "../../../../../redux/services/supabase";

const { Dragger } = Upload;

export default function ImageUpload({ fileList, setFileList }) {
  const [uploading, setUploading] = useState(false);

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
      setUploading(true);
      const fileName = `${Date.now()}-${file.name}`;

      // Upload file lên Supabase
      const { data, error } = await supabase.storage
        .from("image")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error || !data) {
        message.error("Tải ảnh lên thất bại!");
        onError(error || new Error("Lỗi tải lên"));
        setUploading(false);
        return;
      }

      // Lấy public URL
      const { data: urlData } = supabase.storage
        .from("image")
        .getPublicUrl(data.path);

      if (urlData?.publicUrl) {
        setFileList((prev) => [
          ...prev,
          { uid: file.uid, url: urlData.publicUrl, name: fileName },
        ]);
        message.success("Tải ảnh lên thành công!");
        onSuccess("ok");
      } else {
        message.error("Không lấy được URL ảnh!");
        onError(new Error("Không lấy được URL ảnh!"));
      }
      setUploading(false);
    },
    onRemove: async (file) => {
      setUploading(true);
      try {
        const fileName = file.name; // Dùng tên file đã lưu trong state
        const { error } = await supabase.storage
          .from("image")
          .remove([fileName]);

        if (error) throw error;

        setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
        message.success("Đã xóa ảnh!");
      } catch (error) {
        message.error("Lỗi khi xóa ảnh!");
      }
      setUploading(false);
    },
    fileList,
  };

  return (
    <Spin spinning={uploading} tip="Đang xử lý...">
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

import { Upload, message, Spin, Image } from "antd";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
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
      if (fileList.length >= 5) {
        message.error("Bạn chỉ được tải lên tối đa 5 ảnh!");
        return Upload.LIST_IGNORE;
      }
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

      try {
        // Upload file lên Supabase
        const { data, error } = await supabase.storage
          .from("image")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (error || !data) throw new Error("Tải ảnh lên thất bại!");

        // Lấy public URL (ĐÃ FIX LỖI)
        const { data: urlData } = supabase.storage
          .from("image")
          .getPublicUrl(data.path);
        if (!urlData.publicUrl) throw new Error("Không lấy được URL ảnh!");

        setFileList((prev) => [
          ...prev,
          {
            uid: file.uid,
            url: urlData.publicUrl,
            name: fileName,
            path: data.path,
          },
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

  // Xóa ảnh
  const handleRemove = async (file) => {
    setUploading(true);
    try {
      const filePath = file.path || file.name; // Ưu tiên path nếu có
      const { error } = await supabase.storage.from("image").remove([filePath]);

      if (error) throw error;

      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      message.success("Đã xóa ảnh!");
    } catch (error) {
      message.error("Lỗi khi xóa ảnh!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Spin spinning={uploading} tip="Đang xử lý...">
        <Dragger {...uploadProps} showUploadList={false}>
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

      {/* Hiển thị ảnh */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: 16, gap: 8 }}>
        {fileList.map((file) => (
          <div key={file.uid} style={{ position: "relative" }}>
            <Image
              src={file.url}
              width={100}
              height={100}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
            {/* Nút xóa ảnh */}
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
    </>
  );
}

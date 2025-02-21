import { Upload, Button, message, Spin } from "antd";
import { useState, useEffect } from "react";
import { supabase } from "../../../../../redux/services/supabase";

export default function PDFUpload({ setPdfFile }) {
  const [uploading, setUploading] = useState(false);
  const [existingFile, setExistingFile] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase.storage.from("business").list();
      if (error) {
        console.error("Lỗi khi lấy danh sách file:", error);
      } else if (data.length > 0) {
        setExistingFile(data[0].name);
      }
    };
    fetchFiles();
  }, []);

  // Hàm chuẩn hóa tên file (loại bỏ ký tự đặc biệt và giới hạn độ dài)
  const sanitizeFileName = (fileName) => {
    return fileName
      .replace(/[^a-zA-Z0-9.\-_]/g, "") // Chỉ giữ lại chữ, số, ".", "-", "_"
      .slice(-50); // Giới hạn tối đa 50 ký tự từ cuối file name
  };

  const uploadProps = {
    name: "file",
    accept: ".pdf",
    maxCount: 1,
    beforeUpload: (file) => {
      if (file.type !== "application/pdf") {
        message.error("Chỉ cho phép tải lên file PDF!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      setUploading(true);

      if (existingFile) {
        await supabase.storage.from("business").remove([existingFile]);
      }

      const fileName = sanitizeFileName(`${Date.now()}-${file.name}`);

      const { data, error } = await supabase.storage
        .from("business")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        message.error(
          "Tải file lên thất bại! Tên file có thể chứa ký tự không hợp lệ."
        );
        onError(error);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("business")
        .getPublicUrl(data.path);

      if (urlData) {
        setPdfFile({ url: urlData.publicUrl, name: fileName });
        setExistingFile(fileName);
        message.success("Tải file lên thành công!");
        onSuccess("ok");
      } else {
        message.error("Không lấy được URL file!");
        onError("Lỗi lấy URL");
      }

      setUploading(false);
    },
    onRemove: async () => {
      if (existingFile) {
        await supabase.storage.from("pdf").remove([existingFile]);
        setExistingFile(null);
      }
      setPdfFile(null);
      message.success("Đã xóa file!");
    },
  };

  return (
    <Spin spinning={uploading} tip="Đang tải file lên...">
      <Upload {...uploadProps}>
        <Button>Tải lên PDF</Button>
      </Upload>
    </Spin>
  );
}

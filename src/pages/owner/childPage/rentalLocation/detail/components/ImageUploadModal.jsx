import React, { useState, useEffect } from "react";
import { Modal, Upload, message, Spin, Image } from "antd";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import { supabase } from "../../../../../../redux/services/supabase";
import { useUpdateRentalLocationMutation } from "../../../../../../redux/services/rentalApi";

const { Dragger } = Upload;

export default function ImageUploadModal({
  open,
  onClose,
  rentalData,
}) {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [updateRentalLocation, { isLoading: isUpdating }] =
    useUpdateRentalLocationMutation();

  useEffect(() => {
    if (rentalData?.image) {
      setFileList(
        rentalData.image.map((url, index) => ({
          uid: index.toString(),
          url,
          name: url.split("/").pop(),
        }))
      );
    }
  }, [rentalData]);

  const uploadProps = {
    name: "file",
    multiple: true,
    accept: ".jpg,.jpeg,.png",
    beforeUpload: () => true,
    customRequest: async ({ file, onSuccess, onError }) => {
      setUploading(true);
      const fileName = `${Date.now()}-${file.name}`;

      try {
        const { data, error } = await supabase.storage
          .from("image")
          .upload(fileName, file);
        if (error || !data) throw new Error("Tải ảnh lên thất bại!");

        const publicUrl = supabase.storage.from("image").getPublicUrl(data.path)
          .data.publicUrl;
        if (!publicUrl) throw new Error("Không lấy được URL ảnh!");

        setFileList((prev) => [
          ...prev,
          { uid: file.uid, url: publicUrl, name: fileName },
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

  const handleRemove = async (file) => {
    try {
      const { error } = await supabase.storage
        .from("image")
        .remove([file.name]);
      if (error) throw new Error("Xóa ảnh thất bại!");

      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      message.success("Xóa ảnh thành công!");
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleUploadComplete = async () => {
    if (!rentalData.id) {
      message.error("Không tìm thấy ID địa điểm!");
      return;
    }
    try {
      const imageUrls = fileList.map((file) => file.url);
      await updateRentalLocation({
        id: rentalData.id,
        updatedData: { image: imageUrls },
      }).unwrap();
      message.success("Cập nhật hình ảnh thành công!");
    //   onUploadSuccess(imageUrls);
      onClose();
    } catch (error) {
      message.error("Cập nhật thất bại, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleUploadComplete}
      title="Tải lên hình ảnh"
      confirmLoading={isUpdating}
    >
      <Spin spinning={uploading} tip="Đang tải...">
        <Dragger {...uploadProps} showUploadList={false}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Kéo và thả ảnh vào đây hoặc nhấn để tải lên
          </p>
          <p className="ant-upload-hint">Hỗ trợ JPG, PNG.</p>
        </Dragger>
      </Spin>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: 16, gap: 8 }}>
        {fileList.map((file) => (
          <div key={file.uid} style={{ position: "relative" }}>
            <Image
              src={file.url}
              width={100}
              height={100}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
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
    </Modal>
  );
}

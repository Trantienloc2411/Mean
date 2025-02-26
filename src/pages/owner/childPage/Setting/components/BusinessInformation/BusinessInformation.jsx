import { useState } from "react";
import { Button, Form, Input, Skeleton, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUpdateBusinessMutation } from "../../../../../../redux/services/businessApi";
import { supabase } from "../../../../../../redux/services/supabase";

export default function BusinessInformation({ businessData, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateBusiness] = useUpdateBusinessMutation();
  const [uploading, setUploading] = useState(false);
  console.log(businessData);

  const defaultValue = "Chưa có thông tin";
  if (businessData?.id === null) {
    return <Skeleton active />;
  }

  const [formData, setFormData] = useState({
    companyName: businessData?.companyName || defaultValue,
    representativeName: businessData?.representativeName || defaultValue,
    citizenIdentification: businessData?.citizenIdentification || defaultValue,
    companyAddress: businessData?.companyAddress || defaultValue,
    taxID: businessData?.taxID || defaultValue,
    businessLicensesFile: businessData?.businessLicensesFile || "",
  });

  const handleSave = async () => {
    if (uploading) return;
    try {
      await updateBusiness({
        id: businessData.id,
        updatedBusiness: formData,
      }).unwrap();
      message.success("Cập nhật thông tin doanh nghiệp thành công!");
      setIsEditing(false);
      await refetch();
    } catch (error) {
      message.error("Cập nhật thất bại, vui lòng thử lại!");
    }
  };

  const handleCancel = () => {
    setFormData({
      companyName: businessData?.companyName || defaultValue,
      representativeName: businessData?.representativeName || defaultValue,
      citizenIdentification:
        businessData?.citizenIdentification || defaultValue,
      companyAddress: businessData?.companyAddress || defaultValue,
      taxID: businessData?.taxID || defaultValue,
      businessLicensesFile: businessData?.businessLicensesFile || "",
    });
    setIsEditing(false);
  };

  const handleUploadFile = async (file) => {
    if (file.type !== "application/pdf") {
      message.error("Chỉ chấp nhận file PDF!");
      return false;
    }
    setUploading(true);
    const fileName = `business/${businessData.id}-${Date.now()}.pdf`;
    const { data, error } = await supabase.storage
      .from("business")
      .upload(fileName, file);
    if (error) {
      message.error("Upload tệp thất bại!");
      setUploading(false);
      return false;
    }
    const { data: publicUrl } = supabase.storage
      .from("business")
      .getPublicUrl(fileName);
    setUploading(false);
    if (publicUrl?.publicUrl) {
      setFormData((prev) => ({
        ...prev,
        businessLicensesFile: publicUrl.publicUrl,
      }));
    }
    return false;
  };

  return (
    <div>
      <h3 style={{ fontSize: 24 }}>Thông tin Doanh Nghiệp</h3>
      <Form layout="vertical">
        {Object.keys(formData).map(
          (key) =>
            key !== "businessLicensesFile" && (
              <Form.Item
                key={key}
                label={key.replace(/([A-Z])/g, " $1").trim()}
              >
                <Input
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </Form.Item>
            )
        )}

        <Form.Item label="Giấy phép kinh doanh">
          {formData.businessLicensesFile ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <a
                href={formData.businessLicensesFile}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button type="primary">Xem giấy phép</Button>
              </a>
              {isEditing && (
                <Upload showUploadList={false} beforeUpload={handleUploadFile}>
                  <Button icon={<UploadOutlined />} disabled={uploading}>
                    {uploading ? "Đang tải..." : "Tải lên lại"}
                  </Button>
                </Upload>
              )}
            </div>
          ) : (
            <Upload showUploadList={false} beforeUpload={handleUploadFile}>
              <Button icon={<UploadOutlined />} disabled={uploading}>
                {uploading ? "Đang tải..." : "Tải lên Giấy phép kinh doanh"}
              </Button>
            </Upload>
          )}
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "end", gap: "20px" }}>
          {isEditing ? (
            <>
              <Button type="primary" onClick={handleSave} disabled={uploading}>
                {uploading ? "Đang tải..." : "Lưu"}
              </Button>
              <Button onClick={handleCancel}>Thoát</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
          )}
        </div>
      </Form>
    </div>
  );
}

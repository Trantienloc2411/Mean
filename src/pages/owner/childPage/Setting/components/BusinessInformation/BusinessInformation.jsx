import { useState } from "react";
import { Button, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {} from "../../../../../../redux/services/userApi";
import { useParams } from "react-router-dom";
import { supabase } from "../../../../../../redux/services/supabase";
import { useUpdateBusinessMutation } from "../../../../../../redux/services/businessApi";

export default function BusinessInformation({ businessData, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(businessData);
  const [updateBusiness] = useUpdateBusinessMutation();
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    if (uploading) return;
    const updatedData = {
      companyName: formData.companyName,
      representativeName: formData.representativeName,
      citizenIdentification: formData.citizenIdentification,
      companyAddress: formData.companyAddress,
      taxID: formData.taxID,
      businessLicensesFile: formData.businessLicensesFile,
    };
    try {
      await updateBusiness({
        id: businessData.id,
        updatedBusiness: updatedData,
      }).unwrap();
      message.success("Cập nhật thông tin doanh nghiệp thành công!");
      setIsEditing(false);
      await refetch();
    } catch (error) {
      message.error("Cập nhật thất bại, vui lòng thử lại!");
      setFormData(businessData);
    }
  };

  const handleCancel = () => {
    setFormData(businessData);
    setIsEditing(false);
  };

  const handleUploadFile = async (file, field) => {
    if (file.type !== "application/pdf") {
      message.error("Chỉ chấp nhận file PDF!");
      return false;
    }

    setUploading(true);
    const fileName = `business/${businessData.id}-${Date.now()}.pdf`; // Định dạng file PDF
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
      setFormData((prev) => ({ ...prev, [field]: publicUrl.publicUrl }));
    }

    return false; 
  };

  return (
    <div>
      <h3 style={{ fontSize: 24 }}>Thông tin Doanh Nghiệp</h3>
      <Form layout="vertical">
        <Form.Item label="Tên Công Ty">
          <Input
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item label="Địa Chỉ Công Ty">
          <Input
            value={formData.companyAddress}
            onChange={(e) =>
              setFormData({ ...formData, companyAddress: e.target.value })
            }
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item label="Mã số thuế">
          <Input
            value={formData.taxID}
            onChange={(e) =>
              setFormData({ ...formData, taxID: e.target.value })
            }
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item label="Người đại diện">
          <Input
            value={formData.representativeName}
            onChange={(e) =>
              setFormData({ ...formData, representativeName: e.target.value })
            }
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item label="CMND/CCCD">
          <Input
            value={formData.citizenIdentification}
            onChange={(e) =>
              setFormData({
                ...formData,
                citizenIdentification: e.target.value,
              })
            }
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item label="Giấy phép kinh doanh">
          {formData.businessLicensesFile ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <a
                href={formData.businessLicensesFile}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  type="primary"
                  style={{ background: "#1890ff", borderColor: "#1890ff" }}
                >
                  Xem giấy phép
                </Button>{" "}
              </a>
              {isEditing && (
                <Upload
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleUploadFile(file, "businessLicensesFile");
                    return false;
                  }}
                >
                  <Button
                    icon={<UploadOutlined />}
                    disabled={!isEditing || uploading}
                  >
                    {uploading ? "Đang tải..." : "Tải lên lại"}
                  </Button>
                </Upload>
              )}
            </div>
          ) : (
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleUploadFile(file, "businessLicensesFile");
                return false;
              }}
            >
              <Button
                icon={<UploadOutlined />}
                disabled={!isEditing || uploading}
              >
                {uploading ? "Đang tải..." : "Tải lên Giấy phép kinh doanh"}
              </Button>
            </Upload>
          )}
        </Form.Item>

        {isEditing ? (
          <div style={{ display: "flex", justifyContent: "end", gap: "20px" }}>
            <Button type="primary" onClick={handleSave} disabled={uploading}>
              {uploading ? "Đang tải..." : "Lưu"}
            </Button>
            <Button type="default" onClick={handleCancel}>
              Thoát
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "end", gap: "20px" }}>
            <Button type="default" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}

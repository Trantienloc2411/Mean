import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  useUpdateBusinessMutation,
  useCreateBusinessMutation,
} from "../../../../../../redux/services/businessApi";
import { supabase } from "../../../../../../redux/services/supabase";
import { useUpdateOwnerMutation } from "../../../../../../redux/services/ownerApi";

const useFileUpload = (businessId) => {
  const [uploading, setUploading] = useState(false);

  const handleUploadFile = async (file) => {
    if (file.type !== "application/pdf") {
      message.error("Chỉ chấp nhận file PDF!");
      return false;
    }

    setUploading(true);
    const fileName = `business/${businessId || "new"}-${Date.now()}.pdf`;

    try {
      const { data, error } = await supabase.storage
        .from("business")
        .upload(fileName, file);

      if (error) {
        message.error("Upload tệp thất bại!");
        return false;
      }

      const { data: publicUrl } = supabase.storage
        .from("business")
        .getPublicUrl(fileName);

      return publicUrl?.publicUrl || null;
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải lên file!");
      return false;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, handleUploadFile };
};

function BusinessForm({
  formData,
  isEditing,
  uploading,
  handleUploadFile,
  handleChange,
}) {
  const formItems = [
    { key: "companyName", label: "Tên công ty" },
    { key: "representativeName", label: "Người đại diện" },
    { key: "citizenIdentification", label: "CMND/CCCD" },
    { key: "companyAddress", label: "Địa chỉ công ty" },
    { key: "taxID", label: "Mã số thuế" },
  ];

  return (
    <Form layout="vertical">
      {formItems.map(({ key, label }) => (
        <Form.Item key={key} label={label}>
          <Input
            value={formData[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            disabled={!isEditing}
          />
        </Form.Item>
      ))}

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
              <Upload
                showUploadList={false}
                beforeUpload={async (file) => {
                  const url = await handleUploadFile(file);
                  if (url) handleChange("businessLicensesFile", url);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} disabled={uploading}>
                  {uploading ? "Đang tải..." : "Tải lên lại"}
                </Button>
              </Upload>
            )}
          </div>
        ) : (
          <Upload
            showUploadList={false}
            beforeUpload={async (file) => {
              const url = await handleUploadFile(file);
              if (url) handleChange("businessLicensesFile", url);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} disabled={uploading}>
              {uploading ? "Đang tải..." : "Tải lên Giấy phép kinh doanh"}
            </Button>
          </Upload>
        )}
      </Form.Item>
    </Form>
  );
}

function NotHaveBusiness({ refetch, createBusiness, updateOwner, ownerId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { uploading, handleUploadFile } = useFileUpload();
  const [fileUrl, setFileUrl] = useState("");

  const handleCreate = async () => {
    const values = await form.validateFields();
    const formData = { ...values, businessLicensesFile: fileUrl };
    try {
      const businessInfo = await createBusiness({
        data: formData,
      }).unwrap();
      message.success("Tạo thông tin doanh nghiệp thành công!");

      try {
        const updatedData = {
          businessInformationId: businessInfo.id,
        };
        console.log(updatedData);

        const res = await updateOwner({
          id: ownerId,
          updatedData: updatedData,
        }).unwrap();
        console.log(res);
      } catch (error) {
        message.error("Tạo thông cho owner thất bại!");
      }
      setIsModalOpen(false);

      await refetch();
    } catch (error) {
      message.error("Tạo thông tin thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div>
      <p>Hãy bổ sung thông tin kinh doanh</p>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Thêm thông tin kinh doanh
      </Button>
      <Modal
        title="Thêm thông tin doanh nghiệp"
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ disabled: uploading }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên công ty"
            name="companyName"
            rules={[{ required: true, message: "Vui lòng nhập tên công ty!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Người đại diện"
            name="representativeName"
            rules={[
              { required: true, message: "Vui lòng nhập tên người đại diện!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="CMND/CCCD"
            name="citizenIdentification"
            rules={[{ required: true, message: "Vui lòng nhập số CMND/CCCD!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ công ty"
            name="companyAddress"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ công ty!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mã số thuế"
            name="taxID"
            rules={[{ required: true, message: "Vui lòng nhập mã số thuế!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Tải lên giấy phép kinh doanh">
            <Upload
              showUploadList={Boolean(fileUrl)}
              fileList={
                fileUrl
                  ? [
                      {
                        uid: "-1",
                        name: "Giấy phép kinh doanh.pdf",
                        status: "done",
                        url: fileUrl,
                      },
                    ]
                  : []
              }
              beforeUpload={async (file) => {
                const url = await handleUploadFile(file);
                if (url) setFileUrl(url);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />} disabled={uploading}>
                {uploading ? "Đang tải..." : "Tải lên"}
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default function BusinessInformation({ businessData, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateBusiness] = useUpdateBusinessMutation();
  const [createBusiness] = useCreateBusinessMutation();
  const [updateOwner] = useUpdateOwnerMutation();
  const { uploading, handleUploadFile } = useFileUpload(businessData?.id);
  const defaultValue = "Chưa có thông tin";
  const ownerId = businessData.ownerId;

  const [formData, setFormData] = useState({
    companyName: defaultValue,
    representativeName: defaultValue,
    citizenIdentification: defaultValue,
    companyAddress: defaultValue,
    taxID: defaultValue,
    businessLicensesFile: "",
  });

  // Cập nhật formData khi businessData thay đổi
  useEffect(() => {
    if (businessData) {
      setFormData({
        companyName: businessData?.companyName || defaultValue,
        representativeName: businessData?.representativeName || defaultValue,
        citizenIdentification:
          businessData?.citizenIdentification || defaultValue,
        companyAddress: businessData?.companyAddress || defaultValue,
        taxID: businessData?.taxID || defaultValue,
        businessLicensesFile: businessData?.businessLicensesFile || "",
      });
    }
  }, [businessData]);

  // Xử lý khi không có dữ liệu doanh nghiệp
  if (businessData?.businessId === null) {
    return (
      <NotHaveBusiness
        refetch={refetch}
        updateOwner={updateOwner}
        createBusiness={createBusiness}
        ownerId={ownerId}
      />
    );
  }

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (uploading) return;
    try {
      await updateBusiness({
        id: businessData.businessId,
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

  return (
    <div>
      <h3 style={{ fontSize: 24 }}>Thông tin Doanh Nghiệp</h3>
      <BusinessForm
        formData={formData}
        isEditing={isEditing}
        uploading={uploading}
        handleUploadFile={handleUploadFile}
        handleChange={handleChange}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          gap: "20px",
          marginTop: "20px",
        }}
      >
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
    </div>
  );
}

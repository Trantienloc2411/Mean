import { useState } from "react";
import {
  Card,
  Typography,
  Form,
  Space,
  Button,
  Input,
  Upload,
  message,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { supabase } from "../../../../../../redux/services/supabase";
import styles from "./CompanyInfo.module.scss";
import {
  useUpdateBusinessMutation,
  useCreateBusinessMutation,
} from "../../../../../../redux/services/businessApi.js";
import { useParams } from "react-router-dom";

const { Text } = Typography;

const CompanyInfo = ({ companyInfo, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const userRole = localStorage.getItem("user_role")?.toLowerCase();
  const canEdit = userRole === `"owner"`;
  const { id } = useParams();
  const [updateBusiness] = useUpdateBusinessMutation();
  const [createBusiness] = useCreateBusinessMutation();
  console.log(companyInfo.ownerId);

  const defaultData = {
    companyName: companyInfo?.companyName || "Chưa có thông tin",
    representativeName: companyInfo?.representativeName || "Chưa có thông tin",
    representativeId: companyInfo?.citizenIdentification || "Chưa có thông tin",
    companyAddress: companyInfo?.companyAddress || "Chưa có thông tin",
    taxCode: companyInfo?.taxCode || "Chưa có thông tin",
    file: companyInfo?.businessLicensesFile,
  };

  const fields = [
    { name: "companyName", label: "Tên kinh doanh" },
    { name: "representativeName", label: "Tên người đại diện" },
    { name: "representativeId", label: "Căn cước công dân đại diện" },
    { name: "companyAddress", label: "Địa chỉ công ty" },
    { name: "taxCode", label: "Mã số thuế" },
    { name: "file", label: "File giấy phép kinh doanh" },
  ];

  const handleEdit = () => {
    form.setFieldsValue({
      companyName:
        defaultData.companyName !== "Chưa có thông tin"
          ? defaultData.companyName
          : "",
      representativeName:
        defaultData.representativeName !== "Chưa có thông tin"
          ? defaultData.representativeName
          : "",
      representativeId:
        defaultData.representativeId !== "Chưa có thông tin"
          ? defaultData.representativeId
          : "",
      companyAddress:
        defaultData.companyAddress !== "Chưa có thông tin"
          ? defaultData.companyAddress
          : "",
      taxCode:
        defaultData.taxCode !== "Chưa có thông tin" ? defaultData.taxCode : "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFileList([]);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let businessLicensesFile = defaultData.file;

      // Upload file if exists
      if (fileList.length > 0) {
        const file = fileList[0].originFileObj;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
        const filePath = `business/${fileName}`;

        const { data, error } = await supabase.storage
          .from("business")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("business")
          .getPublicUrl(filePath);

        businessLicensesFile = urlData.publicUrl;
      }

      // Prepare the business data
      const businessData = {
        companyName: values.companyName,
        representativeName: values.representativeName,
        citizenIdentification: values.representativeId,
        companyAddress: values.companyAddress,
        taxID: values.taxCode,
        businessLicensesFile: businessLicensesFile,
      };

      // Check if business information exists
      const businessInfoExists =
        companyInfo &&
        (companyInfo.companyName ||
          companyInfo.representativeName ||
          companyInfo.citizenIdentification ||
          companyInfo.companyAddress ||
          companyInfo.taxCode ||
          companyInfo.businessLicensesFile);

      // Use the appropriate mutation based on whether business info exists
      if (businessInfoExists) {
        // Get the business information ID
        const businessInformationId = companyInfo.id; // Assuming the ID is stored in the companyInfo object

        // For update, we send the ID and the updated business data
        await updateBusiness({
          id: businessInformationId,
          updatedBusiness: businessData,
        });

        // message.success("Thông tin doanh nghiệp đã được cập nhật thành công!");
      } else {
        // For create, we send the data with the owner ID
        await createBusiness({
          data: {
            ...businessData,
            ownerId: companyInfo.ownerId,
          },
        });
        message.success("Thông tin doanh nghiệp đã được tạo thành công!");
      }

      // If you have an onUpdate callback, call it with the updated data
      if (onUpdate) {
        onUpdate({
          ...companyInfo,
          companyName: values.companyName,
          representativeName: values.representativeName,
          citizenIdentification: values.representativeId,
          companyAddress: values.companyAddress,
          taxCode: values.taxCode,
          businessLicensesFile: businessLicensesFile,
        });
      }

      setIsEditing(false);
      setFileList([]);
    } catch (error) {
      console.error("Error updating company info:", error);
      message.error("Có lỗi xảy ra khi cập nhật thông tin doanh nghiệp!");
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isPDF = file.type === "application/pdf";

    if (!isPDF) {
      message.error(
        "Chỉ chấp nhận file PDF. Các định dạng khác không được phép!"
      );
      return Upload.LIST_IGNORE; // Ngăn không thêm vào danh sách file
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("File phải nhỏ hơn 5MB!");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const ViewMode = () => (
    <div direction="vertical" size="large" style={{ width: "100%" }}>
      {fields.map((field) => (
        <div key={field.name} className={styles.companyField}>
          <Text strong className={styles.companyLabel}>
            {field.label}
          </Text>

          {field.name === "file" ? (
            defaultData.file ? (
              <a
                href={defaultData.file}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.fileLink}>Xem giấy phép</div>
              </a>
            ) : (
              <div className={styles.noFile}>
                <p>Chưa có giấy phép</p>
              </div>
            )
          ) : (
            <div className={styles.companyValue}>{defaultData[field.name]}</div>
          )}
        </div>
      ))}
    </div>
  );

  const renderEditForm = () => (
    <Form form={form} layout="vertical" className={styles.editForm}>
      <Form.Item
        name="companyName"
        label="Tên công ty"
        rules={[
          { required: true, message: "Vui lòng nhập tên công ty kinh doanh!" },
        ]}
      >
        <Input placeholder="Nhập tên công ty" />
      </Form.Item>

      <Form.Item
        name="representativeName"
        label="Tên người đại diện"
        rules={[
          { required: true, message: "Vui lòng nhập tên người đại diện!" },
        ]}
      >
        <Input placeholder="Nhập tên người đại diện" />
      </Form.Item>

      <Form.Item
        name="representativeId"
        label="Căn cước công dân đại diện"
        rules={[
          { required: true, message: "Vui lòng nhập CCCD!" },
          { pattern: /^[0-9]{9,12}$/, message: "CCCD không hợp lệ!" },
        ]}
      >
        <Input placeholder="Nhập CCCD" />
      </Form.Item>

      <Form.Item
        name="companyAddress"
        label="Địa chỉ công ty"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ công ty!" }]}
      >
        <Input placeholder="Nhập địa chỉ công ty" />
      </Form.Item>

      <Form.Item
        name="taxCode"
        label="Mã số thuế  "
        rules={[{ required: true, message: "Vui lòng nhập mã số thuế!" }]}
      >
        <Input placeholder="Nhập mã số thuế" />
      </Form.Item>

      <Form.Item
        name="businessLicense"
        label="File giấy phép kinh doanh (.pdf)"
        className={styles.uploadContainer}
        // rules={[{ required: true, message: "Vui lòng thêm giấy phép kinh doanh (.pdf)!" }]}
      >
        <Upload
          listType="text"
          fileList={fileList}
          accept=".pdf"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          maxCount={1}
          customRequest={({ onSuccess }) =>
            setTimeout(() => onSuccess("ok"), 0)
          }
        >
          <Button icon={<UploadOutlined />}>
            Tải lên giấy phép kinh doanh
          </Button>
        </Upload>
      </Form.Item>

      <Form.Item className={styles.buttonContainer}>
        <Space>
          <Button
            type="primary"
            onClick={handleSave}
            icon={<SaveOutlined />}
            loading={loading}
          >
            Lưu
          </Button>
          <Button onClick={handleCancel} icon={<CloseOutlined />}>
            Hủy
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <Card
      title="Thông tin kinh doanh"
      extra={
        !isEditing &&
        canEdit && (
          <Button type="text" icon={<EditOutlined />} onClick={handleEdit}>
            Chỉnh sửa
          </Button>
        )
      }
      className={styles.companyCard}
    >
      {isEditing ? renderEditForm() : <ViewMode />}
    </Card>
  );
};

export default CompanyInfo;

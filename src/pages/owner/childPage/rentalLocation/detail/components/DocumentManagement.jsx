import {
  Button,
  Card,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  useCreateLandUsesRightMutation,
  useGetLandUsesRightQuery,
  useUpdateLandUsesRightMutation,
} from "../../../../../../redux/services/landUsesApi";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { supabase } from "../../../../../../redux/services/supabase";
import { FaEdit, FaFile } from "react-icons/fa";
import { Menu } from "antd";
import { Dropdown } from "antd";
import { getUserId } from "../../../../../../utils/storage";

export default function DocumentManagement({ rentalData }) {
  const userRole = localStorage.getItem("user_role")?.toLowerCase();
  const canEdit = userRole === `"owner"`;
  const canApprove = userRole === `"admin"`;

  const idRental = rentalData?.id;
  const { data: fileData, isLoading } = useGetLandUsesRightQuery(idRental);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const { uploading, handleUploadFile } = useFileUpload(idRental);
  const [form] = Form.useForm();
  const [updateDocument] = useUpdateLandUsesRightMutation();
  const [fileUrl, setFileUrl] = useState(null);
  const userId = getUserId();
  const idDocument = fileData?.id || null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isEditModalOpen && fileData) {
      form.setFieldsValue({
        documentName: fileData.documentName || "",
        note: fileData.note || "",
      });
    }
  }, [isEditModalOpen, fileData, form]);

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (!fileData) return <RentalNone idRental={idRental} canEdit={canEdit} />;

  const handleMenuClick = ({ key }) => {
    if (key === "approve") {
      setIsApproveModalOpen(true);
    } else if (key === "deny") {
      setIsDenyModalOpen(true);
    } else if (key === "edit") {
      setIsEditModalOpen(true);
    }
  };

  const handleBeforeUpload = async (file) => {
    const isPDF = file.type === "application/pdf";
    if (!isPDF) {
      message.error("Chỉ chấp nhận file PDF!");
      return Upload.LIST_IGNORE;
    }

    const uploadedUrl = await handleUploadFile(file);
    if (uploadedUrl) {
      setFileUrl(uploadedUrl);
    }
    return false;
  };

  const handleApprove = async () => {
    const formUpdate = {
      staffId: userId,
      documentStatus: true,
      approvedDate: Date.now(),
      refuseDate: null,
      note: "Đã chấp nhận giấy tờ",
    };
    try {
      await updateDocument({
        id: idDocument,
        updatedLandUsesRight: formUpdate,
      }).unwrap();
      setIsApproveModalOpen(false);
    } catch (error) {
      console.error("❌ Lỗi khi gửi API:", error);
      message.error("Lỗi khi chấp nhận giấy tờ!");
    }
  };

  const handleDeny = (values) => {
    const formUpdate = {
      staffId: userId,
      documentStatus: false,
      approvedDate: null,
      refuseDate: Date.now(),
      note: values.note,
    };
    try {
      updateDocument({ id: idDocument, updatedLandUsesRight: formUpdate });
      setIsDenyModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("❌ Lỗi khi gửi API:", error);
      message.error("Lỗi khi từ chối giấy tờ!");
    }
  };
  const handleEdit = (values) => {
    const formUpdate = {
      staffId: userId,
      documentName: values.documentName,
      approvedDate: null,
      documentStatus: false,
      // refuseDate: null,
      note: values.note,
      documentFile: fileUrl || fileData.documentFile, // Giữ file cũ nếu không tải lên file mới
    };

    try {
      updateDocument({ id: idDocument, updatedLandUsesRight: formUpdate });
      setIsEditModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật giấy tờ:", error);
      message.error("Lỗi khi cập nhật giấy tờ!");
    }
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      {canApprove && <Menu.Item key="approve">Chấp nhận</Menu.Item>}
      {canApprove && <Menu.Item key="deny">Từ chối</Menu.Item>}
      {canEdit && <Menu.Item key="edit">Chỉnh sửa</Menu.Item>}
    </Menu>
  );

  return (
    <div className="document-management">
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Card
          title="Giấy tờ địa điểm"
          extra={
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div style={{ cursor: "pointer" }}>
                <FaEdit />
              </div>
            </Dropdown>
          }
        >
          <p>
            <strong>Ngày tải lên: </strong>
            {fileData.uploadDate
              ? dayjs(fileData.uploadDate, "DD/MM/YYYY HH:mm:ss").format(
                  "hh:mm:ss DD/MM/YYYY"
                )
              : "Chưa có"}
          </p>
          {fileData.approvedDate && (
            <p>
              <strong>Ngày chấp thuận: </strong>
              {fileData.approvedDate
                ? dayjs(fileData.approvedDate, "DD/MM/YYYY HH:mm:ss").format(
                    "hh:mm:ss DD/MM/YYYY"
                  )
                : "Chưa có"}
            </p>
          )}
          {fileData.refuseDate && (
            <p>
              <strong>Ngày từ chối: </strong>
              {fileData.refuseDate
                ? dayjs(fileData.refuseDate, "DD/MM/YYYY HH:mm:ss").format(
                    "hh:mm:ss DD/MM/YYYY"
                  )
                : "Chưa có"}
            </p>
          )}

          <p>
            <strong style={{ marginRight: 10 }}>Trạng thái:</strong>
            {fileData.documentStatus && fileData.approvedDate ? (
              <Tag color="success">Đã duyệt</Tag>
            ) : fileData.documentStatus === false && fileData.refuseDate ? (
              <Tag color="error">Chưa chấp thuận</Tag>
            ) : (
              <Tag color="warning">Chờ duyệt</Tag>
            )}
          </p>
          <p>
            <strong>Tên giấy tờ: </strong>
            {fileData.documentName || "Không có ghi chú"}
          </p>
          <p>
            <strong>Ghi chú:</strong> {fileData.note || "Không có ghi chú"}
          </p>
          <div style={{ display: "flex", gap: "14px" }}>
            <strong>File đính kèm:</strong>
            {fileData.documentFile ? (
              <a
                href={fileData.documentFile}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue", fontSize: "16px" }}
              >
                <FaFile />
                {fileData.documentName}
              </a>
            ) : (
              "Chưa có file nào"
            )}
            (Ấn vào để xem)
          </div>
        </Card>
      </Space>

      <Modal
        title="Xác nhận chấp nhận giấy tờ"
        open={isApproveModalOpen}
        onCancel={() => setIsApproveModalOpen(false)}
        onOk={handleApprove}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn chấp nhận giấy tờ này không?</p>
      </Modal>

      <Modal
        title="Nhập lý do từ chối"
        open={isDenyModalOpen}
        onCancel={() => setIsDenyModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleDeny} layout="vertical">
          <Form.Item
            name="note"
            label="Lý do từ chối"
            rules={[{ required: true, message: "Vui lòng nhập lý do từ chối" }]}
          >
            <Input.TextArea placeholder="Nhập lý do từ chối..." />
          </Form.Item>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => setIsDenyModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Gửi
            </Button>
          </Space>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa giấy tờ"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            documentName: fileData.documentName,
            note: fileData.note,
          }}
          onFinish={handleEdit}
        >
          <Form.Item
            name="documentName"
            label="Tên giấy tờ"
            rules={[{ required: true, message: "Vui lòng nhập tên giấy tờ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="documentFile" label="Thay đổi file">
            <Upload beforeUpload={handleBeforeUpload} maxCount={1}>
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
            {fileUrl && (
              <p>
                <a href={fileUrl} target="_blank">
                  {fileUrl}
                </a>
              </p>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

function RentalNone({ idRental, canEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileUrl, setFileUrl] = useState(null);
  const [createDocument, { isLoading }] = useCreateLandUsesRightMutation();
  const { uploading, handleUploadFile } = useFileUpload(idRental);

  console.log("📍 ID Rental:", idRental);

  const convertFormValues = (values) => ({
    staffId: null,
    rentalLocationId: idRental,
    documentName: values.documentName,
    documentType: "Certificate",
    documentStatus: false,
    documentFile: fileUrl, // Chỉ có một file duy nhất
    uploadDate: dayjs().format("DD/MM/YYYY HH:mm:ss"),
    approvedDate: null,
    refuseDate: null,
    note: values.note || "Đang chờ kiểm tra",
    isDelete: false,
  });

  const handleSubmit = async (values) => {
    try {
      if (!fileUrl) {
        message.error("Vui lòng tải lên một file PDF!");
        return;
      }
      console.log("🚀 Dữ liệu gửi API:", convertFormValues(values));
      await createDocument({ data: convertFormValues(values) }).unwrap();
      message.success("Thêm giấy tờ thành công!");
      setIsModalOpen(false);
      form.resetFields();
      setFileUrl(null);
    } catch (error) {
      console.error("❌ Lỗi khi gửi API:", error);
      message.error("Lỗi khi thêm giấy tờ!");
    }
  };

  const handleBeforeUpload = async (file) => {
    const fileUrl = await handleUploadFile(file);
    if (fileUrl) {
      setFileUrl(fileUrl); // Ghi đè file cũ
    }
    return false; // Ngăn chặn Upload tự động
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p>Chưa có giấy tờ nào.</p>
      {canEdit && (
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Thêm giấy tờ
        </Button>
      )}

      <Modal
        title="Thêm giấy tờ"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            documentName: "",
            note: "",
          }}
        >
          <Form.Item
            name="documentName"
            label="Tên giấy tờ"
            rules={[{ required: true, message: "Vui lòng nhập tên giấy tờ" }]}
          >
            <Input placeholder="Nhập tên giấy tờ" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Vui lòng tải lên file" }]}
            name="documentFile"
            label="Tải lên file"
          >
            <Upload beforeUpload={handleBeforeUpload} maxCount={1}>
              <Button icon={<UploadOutlined />} loading={uploading}>
                {uploading ? "Đang tải lên..." : "Chọn file"}
              </Button>
            </Upload>
            {fileUrl && (
              <p>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  {fileUrl}
                </a>
              </p>
            )}
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea placeholder="Nhập ghi chú" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

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
      const { error } = await supabase.storage
        .from("business")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const { data } = supabase.storage.from("business").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      message.error("Lỗi khi tải lên file!");
      return false;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, handleUploadFile };
};

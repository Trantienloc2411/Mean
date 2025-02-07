import { useState } from "react";
import { Form, Input, Button, Upload, message, Row, Col, Image } from "antd";
import { InboxOutlined, SaveOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Dragger } = Upload;

export default function RentalCreate() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const uploadProps = {
    name: "file",
    multiple: true,
    action: "", // Giả lập upload mà không cần server
    accept: ".jpg,.jpeg,.png", // Chỉ chấp nhận các định dạng ảnh cụ thể
    maxCount: 5, // Giới hạn số lượng file
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG files!");
        return Upload.LIST_IGNORE; // Ngăn việc tiếp tục upload
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must smaller than 5MB!");
        return Upload.LIST_IGNORE; // Ngăn việc tiếp tục upload
      }
      return true;
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    customRequest: ({ file, onSuccess }) => {
      // Giả lập hành động upload thành công
      setTimeout(() => {
        onSuccess("ok");
        message.success(`${file.name} uploaded successfully!`);
        setFileList((prev) => [...prev, { url: URL.createObjectURL(file) }]); // Lưu ảnh vào fileList
      }, 1000); // Thời gian giả lập upload
    },
    fileList, // Lưu trữ file đã upload
    onRemove: (file) => {
      setFileList((prev) => prev.filter((item) => item.url !== file.url)); // Xóa file khỏi danh sách
    },
  };

  const handleSubmit = (values) => {
    console.log("Form values: ", values);
    message.success("Rental created successfully");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Create Rental Information</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="rentalName"
          label="Rental Name"
          rules={[{ required: true, message: "Please input rental name!" }]}
        >
          <Input placeholder="Enter rental name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <TextArea rows={4} placeholder="Enter description" maxLength={255} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Please input address!" }]}
            >
              <Input placeholder="Enter address" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="googleMapLink"
              label="Google Map Link"
              rules={[
                { required: true, message: "Please input Google Map link!" },
              ]}
            >
              <Input placeholder="Enter Google Map link" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Rental Images">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Drag and drop images here, or click to upload
            </p>
            <p className="ant-upload-hint">Supports JPG, PNG. Max size: 5MB</p>
          </Dragger>
        </Form.Item>

        {fileList.length > 0 && (
          <div>
            <h4>Uploaded Images</h4>
            <Row gutter={16}>
              {fileList.map((file, index) => (
                <Col key={index} span={8}>
                  <Image
                    width="100%"
                    src={file.url}
                    alt="uploaded image"
                    preview={false}
                  />
                </Col>
              ))}
            </Row>
          </div>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            style={{ width: "150px" }}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Image,
  TimePicker,
  Checkbox,
  Card,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCreateRentalLocationMutation } from "../../../../../redux/services/rentalApi";
import ImageUpload from "./ImageUpload";
import PDFUpload from "./PDFUpload";
import { Flex } from "antd";

const { TextArea } = Input;

export default function RentalForm({ ownerId }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [isOverNight, setIsOverNight] = useState(true);
  const [createRentalLocation, { isLoading }] =
    useCreateRentalLocationMutation();

  const handleSubmit = async (values) => {
    if (fileList.length === 0) {
      message.error("Vui lòng tải lên ít nhất một hình ảnh.");
      return;
    }

    const formattedData = {
      ownerId: ownerId,
      name: values.rentalName,
      status: 1,
      image: fileList[0]?.url || "",
      description: values.description,
      landUsesRightsFile: pdfFile ? pdfFile.name : "",
      address: values.address,
      longitude: values.longitude,
      latitude: values.latitude,
      openHour: values.openHour.format("HH:mm"),
      closeHour: values.closeHour.format("HH:mm"),
      isOverNight,
    };

    try {
      await createRentalLocation(formattedData).unwrap();
      message.success("Đã tạo địa điểm cho thuê thành công!");
      form.resetFields();
      setFileList([]);
      setPdfFile(null);
    } catch (error) {
      message.error("Tạo địa điểm cho thuê thất bại!");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Flex gap={20} align="center" justify="space-between" >
        <h2 style={{ marginBottom: "20px" }}>Create Rental Information</h2>
        {/* Nút Submit */}
        <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            style={{ width: "150px" }}
          >
            {isLoading ? "Đang lưu..." : "Lưu"}
          </Button>
        </Form.Item>
      </Flex>
      <Row gutter={24}>
        {/* Cột trái: Thông tin + PDF */}
        <Col span={12} sm={24} md={12}>
          <Card title="Thông tin địa điểm cho thuê" bordered={false}>
            <Form.Item
              name="rentalName"
              label="Tên địa điểm"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nhập tên địa điểm" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} placeholder="Nhập mô tả" maxLength={255} />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="longitude"
                  label="Kinh độ"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Nhập kinh độ" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="latitude"
                  label="Vĩ độ"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Nhập vĩ độ" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="openHour"
                  label="Giờ mở cửa"
                  rules={[{ required: true }]}
                >
                  <TimePicker
                    format="HH:mm"
                    defaultValue={dayjs("08:00", "HH:mm")}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="closeHour"
                  label="Giờ đóng cửa"
                  rules={[{ required: true }]}
                >
                  <TimePicker
                    format="HH:mm"
                    defaultValue={dayjs("22:00", "HH:mm")}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Cho phép qua đêm">
              <Checkbox
                checked={isOverNight}
                onChange={(e) => setIsOverNight(e.target.checked)}
              >
                Cho phép khách ở qua đêm
              </Checkbox>
            </Form.Item>

            <Form.Item label="Tệp giấy chứng nhận quyền sử dụng đất (PDF)">
              <PDFUpload setPdfFile={setPdfFile} />
            </Form.Item>
          </Card>
        </Col>

        {/* Cột phải: Upload & Xem trước hình ảnh */}
        <Col span={12} sm={24} md={12}>
          <Card title="Hình ảnh địa điểm" bordered={false}>
            <Form.Item>
              <ImageUpload fileList={fileList} setFileList={setFileList} />
            </Form.Item>

            {fileList.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h4>Hình ảnh đã tải lên</h4>
                <Row gutter={16}>
                  {fileList.map((file, index) => (
                    <Col key={index} span={8}>
                      <Image
                        width="100%"
                        src={file.url}
                        alt="uploaded image"
                        preview
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Form>
  );
}

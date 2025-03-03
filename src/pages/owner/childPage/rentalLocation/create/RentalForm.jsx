import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
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
import { useEffect } from "react";
import axios from "axios";
import { Select } from "antd";

const { Option } = Select;
const { TextArea } = Input;

export default function RentalForm({ ownerId, refetch }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [isOverNight, setIsOverNight] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [createRentalLocation, { isLoading }] =
    useCreateRentalLocationMutation();
  const navigate = useNavigate(); // ✅ Khai báo useNavigate

  useEffect(() => {
    // Lấy danh sách tỉnh/thành
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((response) => setProvinces(response.data))
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách tỉnh/thành:", error)
      );
  }, []);

  const handleProvinceChange = async (provinceCode) => {
    setSelectedProvince(provinceCode);
    setSelectedDistrict(null); // Reset quận/huyện
    form.setFieldsValue({ district: null, ward: null }); // Reset giá trị đã chọn

    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      setDistricts(response.data.districts);
      setWards([]); // Reset danh sách phường/xã
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận/huyện:", error);
    }
  };

  const handleDistrictChange = async (districtCode) => {
    setSelectedDistrict(districtCode);
    form.setFieldsValue({ ward: null }); // Reset giá trị đã chọn

    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      setWards(response.data.wards);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường/xã:", error);
    }
  };

  const handleSubmit = async (values) => {
    if (!ownerId) {
      message.error("Chỉ có Chủ Hộ mới được tạo địa điểm cho thuê");
      return;
    }

    const provinceName = provinces.find(
      (p) => p.code === values.province
    )?.name;
    const districtName = districts.find(
      (d) => d.code === values.district
    )?.name;

    // Đảm bảo không bị null/undefined
    if (!provinceName || !districtName) {
      message.error("Lỗi khi lấy thông tin địa chỉ, vui lòng thử lại.");
      return;
    }

    const fullAddress = `${values.address}, ${values.ward}, ${districtName}, ${provinceName}`;

    if (fileList.length === 0) {
      message.error("Vui lòng tải lên ít nhất một hình ảnh.");
      return;
    }
    const imageUrls = fileList.map((file) => file.url);

    const formattedData = {
      ownerId,
      name: values.rentalName,
      status: 1,
      image: imageUrls,
      description: values.description,
      landUsesRightsFile: pdfFile ? pdfFile.name : "",
      address: fullAddress, // ✅ Địa chỉ đầy đủ với tên tỉnh/thành, quận/huyện
      longitude: values.longitude,
      latitude: values.latitude,
      openHour: values.openHour.format("HH:mm"),
      closeHour: values.closeHour.format("HH:mm"),
      isOverNight,
    };

    try {
      const response = await createRentalLocation(formattedData).unwrap();
      message.success("Đã tạo địa điểm cho thuê thành công!");
      form.resetFields();
      setFileList([]);
      setPdfFile(null);
      refetch();
      navigate(`/rental-location/${response._id}`);
    } catch (error) {
      message.error("Tạo địa điểm cho thuê thất bại!");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Flex gap={20} align="center" justify="space-between">
        <h2 style={{ marginBottom: "20px" }}>Create Rental Information</h2>
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
              name="province"
              label="Tỉnh/Thành phố"
              rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành!" }]}
            >
              <Select
                placeholder="Chọn tỉnh/thành"
                onChange={handleProvinceChange}
              >
                {provinces.map((p) => (
                  <Option key={p.code} value={p.code}>
                    {p.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
            >
              <Select
                placeholder="Chọn quận/huyện"
                onChange={handleDistrictChange}
                disabled={!selectedProvince}
              >
                {districts.map((d) => (
                  <Option key={d.code} value={d.code}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="ward"
              label="Phường/Xã"
              rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}
            >
              <Select placeholder="Chọn phường/xã" disabled={!selectedDistrict}>
                {wards.map((w) => (
                  <Option key={w.code} value={w.name}>
                    {w.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ chi tiết"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nhập số nhà, đường, khu vực" />
            </Form.Item>

            <Form.Item
              name="longitude"
              label="Kinh độ"
              rules={[
                { required: true, message: "Vui lòng nhập kinh độ!" },
                {
                  validator: (_, value) => {
                    if (!value || isNaN(value) || value < -180 || value > 180) {
                      return Promise.reject(
                        "Kinh độ phải là số từ -180 đến 180!"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="Nhập kinh độ" />
            </Form.Item>

            <Form.Item
              name="latitude"
              label="Vĩ độ"
              rules={[
                { required: true, message: "Vui lòng nhập vĩ độ!" },
                {
                  validator: (_, value) => {
                    if (!value || isNaN(value) || value < -90 || value > 90) {
                      return Promise.reject("Vĩ độ phải là số từ -90 đến 90!");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="Nhập vĩ độ" />
            </Form.Item>

            <Form.Item
              name="openHour"
              label="Giờ mở cửa"
              rules={[{ required: true }]}
              initialValue={dayjs("08:00", "HH:mm")}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>

            <Form.Item
              name="closeHour"
              label="Giờ đóng cửa"
              rules={[{ required: true }]}
              initialValue={dayjs("22:00", "HH:mm")}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>

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

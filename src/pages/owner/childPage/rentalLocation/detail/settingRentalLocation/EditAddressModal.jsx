import { useEffect, useState, useCallback } from "react";
import { Modal, Form, Input, Button, message, Select, Row, Col } from "antd";
import axios from "axios";
import { useUpdateRentalLocationMutation } from "../../../../../../redux/services/rentalApi";

const { Option } = Select;
const LOCATIONIQ_API_KEY = import.meta.env.VITE_APP_LOCATIONIQ_API_KEY;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
const PROVINCES_API_URL = "https://provinces.open-api.vn/api/p/";

const sortByVietnameseName = (items) =>
  items.sort((a, b) =>
    a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
  );

export default function EditAddressModal({
  visible,
  onClose,
  addressData,
  onUpdate,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [updateRentalLocation, { isLoading: isUpdating }] =
    useUpdateRentalLocationMutation();

  const [locationData, setLocationData] = useState({
    provinces: [],
    districts: [],
    wards: [],
    selectedProvince: "",
    selectedDistrict: "",
    selectedWard: "",
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(PROVINCES_API_URL);
        setLocationData((prev) => ({
          ...prev,
          provinces: sortByVietnameseName(response.data),
        }));
      } catch (error) {
        message.error("Không thể tải danh sách tỉnh/thành.");
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (visible && addressData) {
      form.setFieldsValue({ ...addressData });
      setLocation({
        latitude: addressData.latitude,
        longitude: addressData.longitude,
      });

      // Set selected location data based on existing data
      if (addressData.city) {
        setLocationData((prev) => ({
          ...prev,
          selectedProvince: addressData.city,
        }));
      }

      if (addressData.district) {
        setLocationData((prev) => ({
          ...prev,
          selectedDistrict: addressData.district,
        }));
      }

      if (addressData.ward) {
        setLocationData((prev) => ({
          ...prev,
          selectedWard: addressData.ward,
        }));
      }
    }
  }, [visible, addressData, form]);

  const handleProvinceChange = useCallback(
    async (provinceName, option) => {
      form.setFieldsValue({ district: null, ward: null });

      // Find province code from selected name
      const selectedProvince = locationData.provinces.find(
        (p) => p.name === provinceName
      );
      if (!selectedProvince) return;

      try {
        const response = await axios.get(
          `${PROVINCES_API_URL}${selectedProvince.code}?depth=2`
        );
        setLocationData((prev) => ({
          ...prev,
          selectedProvince: provinceName,
          districts: sortByVietnameseName(response.data.districts),
          wards: [],
        }));
      } catch {
        message.error("Không thể tải danh sách quận/huyện.");
      }
    },
    [form, locationData.provinces]
  );

  const handleDistrictChange = useCallback(
    async (districtName, option) => {
      form.setFieldsValue({ ward: null });

      // Find district code from selected name
      const selectedDistrict = locationData.districts.find(
        (d) => d.name === districtName
      );
      if (!selectedDistrict) return;

      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
        );
        setLocationData((prev) => ({
          ...prev,
          selectedDistrict: districtName,
          wards: sortByVietnameseName(response.data.wards),
        }));
      } catch {
        message.error("Không thể tải danh sách phường/xã.");
      }
    },
    [form, locationData.districts]
  );

  const handleWardChange = useCallback((wardName) => {
    setLocationData((prev) => ({
      ...prev,
      selectedWard: wardName,
    }));
  }, []);

  const handleGetLocation = useCallback(async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue(["address"]);

      const fullAddress = `${values.address}, ${locationData.selectedWard}, ${locationData.selectedDistrict}, ${locationData.selectedProvince}, Việt Nam`;

      const res = await axios.get("https://us1.locationiq.com/v1/search.php", {
        params: {
          key: LOCATIONIQ_API_KEY,
          q: fullAddress,
          format: "json",
          countrycodes: "VN",
        },
      });

      if (res.data?.length > 0) {
        const { lat, lon } = res.data[0];
        setLocation({ latitude: lat, longitude: lon });
        message.success("Lấy tọa độ thành công!");
      } else {
        message.error("Không tìm thấy tọa độ.");
      }
    } catch {
      message.error("Lỗi khi lấy tọa độ, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [form, locationData]);

  const handleFinish = useCallback(
    async (values) => {
      try {
        const id = addressData.id || addressData._id;
        if (!id) {
          message.error("Không tìm thấy ID của địa điểm!");
          return;
        }

        const updatedData = {
          ...addressData,
          address: values.address,
          ward: values.ward,
          district: values.district,
          city: values.city,
          latitude: location.latitude,
          longitude: location.longitude,
        };

        const result = await updateRentalLocation({ id, updatedData }).unwrap();

        message.success("Cập nhật thành công!");
        onUpdate((prev) => ({ ...prev, ...updatedData, id }));

        onClose();
      } catch (error) {
        message.error("Cập nhật thất bại, vui lòng thử lại!");
      }
    },
    [addressData, location, updateRentalLocation, onUpdate, onClose]
  );

  return (
    <Modal
      open={visible}
      title="Chỉnh sửa địa chỉ"
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="address"
          label="Địa chỉ cụ thể"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="city"
              label="Tỉnh/Thành phố"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Chọn tỉnh/thành"
                onChange={handleProvinceChange}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {locationData.provinces.map((province) => (
                  <Option key={province.code} value={province.name}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Chọn quận/huyện"
                onChange={handleDistrictChange}
                disabled={!locationData.selectedProvince}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {locationData.districts.map((district) => (
                  <Option key={district.code} value={district.name}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="ward"
              label="Phường/Xã"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Chọn phường/xã"
                disabled={!locationData.selectedDistrict}
                showSearch
                onChange={handleWardChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {locationData.wards.map((ward) => (
                  <Option key={ward.code} value={ward.name}>
                    {ward.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Button
          type="primary"
          onClick={handleGetLocation}
          loading={loading}
          block
        >
          Lấy tọa độ từ địa chỉ
        </Button>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Vĩ độ (Latitude)">
              <Input value={location.latitude} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kinh độ (Longitude)">
              <Input value={location.longitude} disabled />
            </Form.Item>
          </Col>
        </Row>
        {location.latitude && location.longitude && (
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <iframe
              title="Google Maps"
              width="100%"
              height="300"
              style={{ borderRadius: "10px", border: "none" }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${location.latitude},${location.longitude}`}
            ></iframe>
          </div>
        )}

        <Button type="primary" htmlType="submit" loading={isUpdating}>
          Lưu thay đổi
        </Button>
      </Form>
    </Modal>
  );
}

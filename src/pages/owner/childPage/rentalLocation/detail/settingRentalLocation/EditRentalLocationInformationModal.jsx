import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Switch,
  Button,
  message,
  Select,
  Row,
  Col,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { useUpdateRentalLocationMutation } from "../../../../../../redux/services/rentalApi";

const { TextArea } = Input;

export default function EditRentalLocationModal({
  visible,
  onClose,
  rentalData,
  onUpdate,
}) {
  console.log(rentalData);

  const [form] = Form.useForm();
  const [updateRentalLocation, { isLoading }] =
    useUpdateRentalLocationMutation();
  const [isOverNightChecked, setIsOverNightChecked] = useState(false);

  useEffect(() => {
    if (visible && rentalData) {
      const isOverNight = rentalData.isOverNight;
      setIsOverNightChecked(isOverNight);
      form.setFieldsValue({
        ...rentalData,
        name: rentalData.name,
        description: rentalData.description,
        openHour: isOverNight
          ? dayjs("00:00", "HH:mm")
          : rentalData.openHour
          ? dayjs(rentalData.openHour, "HH:mm")
          : null,
        closeHour: isOverNight
          ? dayjs("23:59", "HH:mm")
          : rentalData.closeHour
          ? dayjs(rentalData.closeHour, "HH:mm")
          : null,
        isOverNight,
        status: rentalData.status,
        note: "Cập nhật trạng thái",
      });
    }
  }, [visible, rentalData, form]);

  const handleFinish = async (values) => {
    try {
      const id = rentalData.id || rentalData._id;
      if (!id) {
        message.error("Không tìm thấy ID của địa điểm!");
        return;
      }

      const updatedData = {
        ...rentalData,
        name: values.name,
        description: values.description,
        openHour: values.isOverNight
          ? "00:00"
          : values.openHour.format("HH:mm"),
        closeHour: values.isOverNight
          ? "23:59"
          : values.closeHour.format("HH:mm"),
        isOverNight: values.isOverNight,
        status: values.status || rentalData.status,
        note: "Cập nhật trạng thái",
      };

      await updateRentalLocation({ id, updatedData }).unwrap();
      message.success("Cập nhật thành công!");
      onUpdate((prev) => ({
        ...prev,
        ...updatedData,
        id,
      }));
      onClose();
    } catch (error) {
      message.error("Cập nhật thất bại, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      open={visible}
      title="Chỉnh sửa địa điểm"
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Tên địa điểm"
          rules={[{ required: true, message: "Vui lòng nhập tên địa điểm" }]}
        >
          <Input placeholder="Nhập tên địa điểm" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea placeholder="Nhập mô tả" rows={3} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="openHour"
              label="Giờ mở cửa"
              rules={[{ required: true, message: "Vui lòng nhập giờ mở cửa" }]}
            >
              <TimePicker
                format="HH:mm"
                placeholder="08:00"
                style={{ width: "100%" }}
                disabled={isOverNightChecked}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="closeHour"
              label="Giờ đóng cửa"
              rules={[
                { required: true, message: "Vui lòng nhập giờ đóng cửa" },
              ]}
            >
              <TimePicker
                format="HH:mm"
                placeholder="22:00"
                style={{ width: "100%" }}
                disabled={isOverNightChecked}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="isOverNight"
              label="Cho phép qua đêm"
              valuePropName="checked"
            >
              <Switch
                onChange={(checked) => {
                  setIsOverNightChecked(checked);
                  if (checked) {
                    form.setFieldsValue({
                      openHour: dayjs("00:00", "HH:mm"),
                      closeHour: dayjs("23:59", "HH:mm"),
                    });
                  } else {
                    form.setFieldsValue({
                      openHour: null,
                      closeHour: null,
                    });
                  }
                }}
              />
            </Form.Item>
          </Col>

          {[3, 4].includes(rentalData.status) && (
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái" },
                ]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value={3}>Hoạt động</Select.Option>
                  <Select.Option value={4}>Tạm dừng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

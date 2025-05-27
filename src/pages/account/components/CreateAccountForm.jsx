import { useState } from "react";
import { Modal, Form, Input, DatePicker, Button, message } from "antd";
import { useCreateUserMutation } from "../../../redux/services/userApi";

export default function CreateAccountForm({ open, onClose, roles }) {
  const [form] = Form.useForm();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [loading, setLoading] = useState(false);

  // Tìm ID của role Admin từ danh sách roles
  const adminRoleId = roles.find((role) => role.roleName === "Admin")?._id;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Gọi API tạo tài khoản với roleID là Admin
      await createUser({
        ...values,
        avatarUrl: null,
        roleID: adminRoleId,
      }).unwrap();

      message.success("Tạo tài khoản Admin thành công!");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Lỗi khi tạo tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo tài khoản Admin"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item label="Ngày sinh" name="doB">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Tạo tài khoản
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

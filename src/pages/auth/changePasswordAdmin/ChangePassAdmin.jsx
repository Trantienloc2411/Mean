import { useUpdatePasswordMutation } from "../../../redux/services/authApi";
import { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";

export default function ChangePassword() {
  const [form] = Form.useForm();
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (values.currentPassword == values.newPassword) {
        message.error("Mật khẩu mới không được trùng mật khẩu cũ!");
        return;
      }

      const response = await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      console.log(response);

      // if (response.success) {
      message.success(response.message);

      form.resetFields();
      // } else {
      // message.error(response.data?.message || "Cập nhật mật khẩu thất bại!");
      // }
    } catch (error) {
      console.error(error);
      message.error(error?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 16px",
        background: "#f5f5f5",
        // minHeight: "100vh",
      }}
    >
      <Card
        title={<h3 style={{ marginBottom: 0 }}>Đổi mật khẩu</h3>}
        style={{
          width: "100%",
          maxWidth: 500,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: 10,
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
              { pattern: /^\S*$/, message: "Mật khẩu không được chứa khoảng trắng!" }
            ]}
          >
            <Input.Password 
              placeholder="Nhập mật khẩu hiện tại" 
              onBlur={(e) => {
                const value = e.target.value.trim();
                form.setFieldsValue({ currentPassword: value });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 8, message: "Mật khẩu mới phải ít nhất 8 ký tự!" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s)/,
                message:
                  "Mật khẩu cần có chữ hoa, chữ thường, số và ký tự đặc biệt, không chứa khoảng trắng!",
              },
            ]}
          >
            <Input.Password 
              placeholder="Nhập mật khẩu mới"
              onBlur={(e) => {
                const value = e.target.value.trim();
                form.setFieldsValue({ newPassword: value });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmNewPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              { pattern: /^\S*$/, message: "Mật khẩu không được chứa khoảng trắng!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="Xác nhận mật khẩu mới"
              onBlur={(e) => {
                const value = e.target.value.trim();
                form.setFieldsValue({ confirmNewPassword: value });
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleSave}
              loading={isLoading}
              block
              style={{ marginTop: 10 }}
            >
              {isLoading ? "Đang cập nhật..." : "Lưu thay đổi"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import styles from "../ChangePassword/ChangePassword.module.scss";
import { useUpdatePasswordMutation } from "../../../../../../redux/services/authApi";

export default function ChangePassword() {
  const [form] = Form.useForm();
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const { currentPassword, newPassword, confirmNewPassword } = values;

      if (!currentPassword || !newPassword || !confirmNewPassword) {
        message.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      if (newPassword === currentPassword) {
        message.error("Mật khẩu mới không được trùng với mật khẩu hiện tại!");
        return;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

      if (!passwordRegex.test(newPassword)) {
        message.error(
          "Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!"
        );
        return;
      }

      if (newPassword !== confirmNewPassword) {
        message.error("Mật khẩu xác nhận không khớp!");
        return;
      }

      const response = await updatePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      if (response.success) {
        message.success("Cập nhật mật khẩu thành công!");
        form.resetFields();
      } else {
        message.error(response.data.message || "Cập nhật mật khẩu thất bại!");
      }
    } catch (error) {
      console.log(error);
      message.error(error.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div
      className={styles.content}
      style={{ backgroundColor: "white", padding: 10 }}
    >
      <h2 style={{ fontSize: 24 }}>Đổi mật khẩu</h2>
      <Form layout="vertical" form={form} className={styles.passwordForm}>
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
          ]}
        >
          <Input.Password
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmNewPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
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
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </Form.Item>

        <Button
          type="primary"
          onClick={handleSave}
          loading={isLoading}
          className={styles.saveButton}
        >
          {isLoading ? "Đang cập nhật..." : "Lưu"}
        </Button>
      </Form>
    </div>
  );
}

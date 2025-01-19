import React from "react";
import { Form, Menu, Input, Button } from "antd";
import {
  UserOutlined,
  LockOutlined,
  BankOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import styles from "../ChangePassword/ChangePassword.module.scss";
export default function ChangePassword(props) {
  const { onChangePassword } = props;

  const [form] = Form.useForm();

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onChangePassword(values);
        message.success("Password updated successfully!");
        form.resetFields();
      })
      .catch((info) => {
        message.error("Failed to update password. Please check the form.");
      });
  };
  return (
    <div
      className={styles.content}
      style={{
        backgroundColor: "white",
        padding: 10,
      }}
    >
      <h2>Đổi mật khẩu</h2>
      <Form layout="vertical" form={form} className={styles.passwordForm}>
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[
            { required: true, message: "Please input your current password!" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please input your new password!" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm New Password"
          name="confirmNewPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Button
          type="primary"
          onClick={handleSave}
          className={styles.saveButton}
        >
          Save
        </Button>
      </Form>
    </div>
  );
}

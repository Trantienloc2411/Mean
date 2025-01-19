import React, { useState } from "react";
import { Form, Menu, Input, Button } from "antd";
import {
  UserOutlined,
  LockOutlined,
  BankOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import styles from '../BankAccount/BankAccount.module.scss';
export default function BankAccount(props) {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
      bankName: "Vietcombank",
      accountNumber: "1011234567",
      accountHolder: "NGUYEN VAN A",
    });
  
    const handleSave = () => {
      form
        .validateFields()
        .then((values) => {
          setFormData(values);
          message.success('Bank account information updated successfully!');
        })
        .catch(() => {
          message.error('Failed to update bank account information. Please check the form.');
        });
    };
  
    return (
      <div className={styles.content}>
        <h2>Tài khoản ngân hàng</h2>
        <Form
          layout="vertical"
          form={form}
          className={styles.bankAccountForm}
          initialValues={formData} // Bind initial values from state
        >
          <Form.Item label="Tên ngân hàng" name="bankName">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Số tài khoản"
            name="accountNumber"
            rules={[{ required: true, message: 'Please input your account number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Tên chủ tài khoản" name="accountHolder">
            <Input disabled />
          </Form.Item>
          <Button type="primary" onClick={handleSave} className={styles.saveButton}>
            Cập nhật thông tin
          </Button>
        </Form>
      </div>
    );
}

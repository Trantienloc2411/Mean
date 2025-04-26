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
          message.success('Cập nhật thông tin tài khoản ngân hàng thành công!');
        })
        .catch(() => {
          message.error('Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.');
        });
    };
  
    return (
      <div className={styles.content}>
        <h3>Tài khoản ngân hàng</h3>
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
            rules={[{ required: true, message: 'Vui lòng nhập số tài khoản!' }]}
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

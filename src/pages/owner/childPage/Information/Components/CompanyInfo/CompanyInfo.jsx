import styles from '../CompanyInfo/CompanyInfo.module.scss';
import React, { useState } from 'react';
import { Card, Typography, Input, Form, Space, Button } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CompanyInfo = ({ initialData = {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const defaultData = {
    companyName: '',
    representativeName: '',
    representativeId: '',
    companyAddress: '',
    taxCode: '',
    ...initialData
  };

  const fields = [
    { name: 'companyName', label: 'Tên công ty' },
    { name: 'representativeName', label: 'Tên người đại diện' },
    { name: 'representativeId', label: 'Căn cước công dân đại diện' },
    { name: 'companyAddress', label: 'Địa chỉ công ty' },
    { name: 'taxCode', label: 'Mã số thuế' }
  ];

  const toggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      form.setFieldsValue(defaultData);
      setIsEditing(true);
    }
  };

  const onFinish = (values) => {
    console.log('Updated values:', values);
    setIsEditing(false);
  };

  const ViewMode = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {fields.map((field) => (
        <div key={field.name}>
          <Text strong>{field.label}</Text>
          <div style={{ 
            background: '#f5f5f5',
            padding: '8px 12px',
            borderRadius: 6,
            marginTop: 4
          }}>
            {defaultData[field.name]}
          </div>
        </div>
      ))}
    </Space>
  );

  const EditMode = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={defaultData}
    >
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.label}
          rules={[{ required: true, message: `Please input ${field.label}!` }]}
        >
          <Input />
        </Form.Item>
      ))}
      
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            <SaveOutlined /> Save
          </Button>
          <Button onClick={() => setIsEditing(false)}>
            <CloseOutlined /> Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <Card
      title="Thông tin doanh nghiệp"
      extra={
        <EditOutlined 
          onClick={toggleEdit}
          style={{ cursor: 'pointer' }}
        />
      }
      style={{ 
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        margin: 20
      }}
    >
      {isEditing ? <EditMode /> : <ViewMode />}
    </Card>
  );
};

export default CompanyInfo;
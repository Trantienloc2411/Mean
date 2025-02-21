// import React, { useState } from 'react';
// import { Card, Avatar, Typography, Space, Input, Button, Form } from 'antd';
// import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
// import styles from '../AccountInfo/AccountInfo.module.scss';
// const { Text } = Typography;

// const ProfileCard = ({ initialData }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [form] = Form.useForm();

//   // Set default values to prevent undefined errors
//   const defaultData = {
//     fullName: 'N/a',
//     email: 'N/a',
//     phone: 'N/a',
//     avatar: '',
//     ...initialData // This will override defaults with provided data
//   };

//   const toggleEdit = () => {
//     if (isEditing) {
//       setIsEditing(false);
//     } else {
//       form.setFieldsValue(defaultData);
//       setIsEditing(true);
//     }
//   };

//   const onFinish = (values) => {
//     console.log('Updated values:', values);
//     setIsEditing(false);
//   };

//   const ViewMode = ({ data }) => (
//     <Space direction="vertical" size="small" style={{ width: '100%' }}>
//       {['fullName', 'email', 'phone'].map((field) => (
//         <div key={field}>
//           <Text type="secondary">{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
//           <div style={{
//             background: '#f5f5f5',
//             padding: '8px 12px',
//             borderRadius: 6
//           }}>
//             {data[field]}
//           </div>
//         </div>
//       ))}
//     </Space>
//   );

//   const EditMode = () => (
//     <Form
//       form={form}
//       layout="vertical"
//       onFinish={onFinish}
//       initialValues={defaultData}
//     >
//       {['fullName', 'email', 'phone'].map((field) => (
//         <Form.Item
//           key={field}
//           name={field}
//           label={field.charAt(0).toUpperCase() + field.slice(1)}
//           rules={[{ required: true, message: `Please input your ${field}!` }]}
//         >
//           <Input />
//         </Form.Item>
//       ))}

//       <Form.Item>
//         <Space>
//           <Button type="primary" htmlType="submit">
//             <SaveOutlined /> Save
//           </Button>
//           <Button onClick={() => setIsEditing(false)}>
//             <CloseOutlined /> Cancel
//           </Button>
//         </Space>
//       </Form.Item>
//     </Form>
//   );

//   return (

//     <>
//     <div className="contentCard" style={{margin : 20}}>
//     <Card
//       style={{
//         borderRadius: 8,
//         width: '100%',
//         boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
//       }}
//       extra={
//         <EditOutlined
//           onClick={toggleEdit}
//           style={{ cursor: 'pointer' }}
//         />
//       }
//       title="Thông tin tài khoản"
//     >
//       <Space direction="vertical" size="large" style={{ width: '100%',  display: 'grid',gridTemplateColumns:"100px auto",   }}>
//         <div style={{ textAlign: 'center'}}>
//           <Avatar
//             size={80}
//             src={defaultData.avatar}
//           />
//         </div>

//         {isEditing ? <EditMode /> : <ViewMode data={defaultData} />}
//       </Space>
//     </Card>

//     </div>
//     </>

//   );
// };

// // Usage example:
// export default ProfileCard;

import React from "react";
import { Card, Avatar, Typography, Space } from "antd";
import styles from "../AccountInfo/AccountInfo.module.scss";
const { Text } = Typography;

const ProfileCard = ({ initialData }) => {
  // Set default values to prevent undefined errors
  const defaultData = {
    fullName: "N/a",
    email: "N/a",
    phone: "N/a",
    avatar: "",
    ...initialData, // This will override defaults with provided data
  };

  return (
    <div className="contentCard" style={{ margin: 20 }}>
      <Card
        style={{
          borderRadius: 8,
          width: "100%",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }}
        title="Thông tin tài khoản"
      >
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", display: "grid",gridTemplateColumns:"100px auto",  }}
        >
          <div style={{ textAlign: "center" }}>
            <Avatar size={80} src={defaultData.avatar} />
          </div>

          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            {["fullName", "email", "phone"].map((field) => (
              <div key={field}>
                <Text type="secondary">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Text>
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "8px 12px",
                    borderRadius: 6,
                  }}
                >
                  {defaultData[field]}
                </div>
              </div>
            ))}
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default ProfileCard;

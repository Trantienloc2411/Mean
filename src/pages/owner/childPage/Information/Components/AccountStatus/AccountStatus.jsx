import React from 'react';
import { Card, Typography, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from '../AccountStatus/AccountStatus.module.scss';

const { Text } = Typography;


export default function StatusInfo(props) {
  const {
    isAccountActive = false,
    tooltipAccountStatus = 'N/a',
    isAccountVerified = false,
    tooltipAccountVerified = ''
  } = props;


  const colorFalse = {
    backgroundColor: '#FBDED1',
    color: '#f69871',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  };
  const colorTrue = {
    backgroundColor: '#e6f7f0',
    color: '#52c41a',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  }

  const statusInfo = [
    {
      label: 'Trạng thái tài khoản:',
      value: (isAccountActive ? 'Hoạt động' : 'Tạm hoãn'),
      tooltip: tooltipAccountStatus,
      valueStyle: (isAccountActive ? colorTrue : colorFalse)
    },
    {
      label: 'Trạng thái xác thực:',
      value: (isAccountVerified ? 'Đã xác thực' : 'Chưa xác thực'),
      tooltip: tooltipAccountVerified,
      valueStyle: (isAccountVerified ? colorTrue : colorFalse)
    }
  ];

  return (
    <div className="cardStyle" style={{margin: 20}}>

      <Card
        title="Trạng thái tài khoản"
        style={{
          
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {statusInfo.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text>{item.label}</Text>
              <span style={item.valueStyle}>{item.value}</span>
              <Tooltip title={item.tooltip}>
                <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
              </Tooltip>
            </div>
          ))}
        </Space>
      </Card>
    </div>
  );
}

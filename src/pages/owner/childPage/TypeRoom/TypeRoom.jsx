import { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import RoomTypeManagement from './components/RoomTypeManagement/RoomTypeManagement.jsx';
import RoomAmenitiesManagement from './components/RoomAmenitiesManagement/RoomAmenitiesManagement.jsx';
import styles from './TypeRoom.module.scss';

export default function TypeRoom() {
  const [activeKey, setActiveKey] = useState('1');
  
  useEffect(() => {
  }, []);

  const items = [
    {
      key: '1',
      label: 'Loại phòng',
      children: <RoomTypeManagement />,
    },
    {
      key: '2',
      label: 'Tiện ích',
      children: <RoomAmenitiesManagement />,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Tabs 
          activeKey={activeKey} 
          items={items} 
          onChange={setActiveKey} 
          className={styles.tabs} 
          tabPosition="left" 
          destroyInactiveTabPane={true}
        />
      </div>
    </div>
  );
}
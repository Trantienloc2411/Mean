import { Modal, Descriptions, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import styles from './DetailRoomTypeModal.module.scss';

const DetailRoomTypeModal = ({ isOpen, onCancel, roomType, service }) => {
  const [formattedServices, setFormattedServices] = useState([]);

  useEffect(() => {
    if (roomType?.serviceIds && Array.isArray(roomType.serviceIds)) {
      setFormattedServices(roomType.serviceIds);
    }
  }, [roomType]);

  if (!roomType) return null;

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    if (typeof dateString === 'string' && dateString.includes('/')) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getLocationName = () => {
    if (!roomType.rentalLocationId) return 'N/A';
    
    if (typeof roomType.rentalLocationId === 'object') {
      return roomType.rentalLocationId.name || 'N/A';
    }
    
    return roomType.rentalLocationId;
  };

  const customTagStyle = {
    borderRadius: '16px',
    padding: '4px 12px',
    fontSize: '12px',
    background: '#e2e3e5',
    color: '#343a40',
    marginRight: '8px',
    marginBottom: '8px',
    display: 'inline-block',
  };

  const renderServiceInfo = () => {
    if (formattedServices.length > 0) {
      return (
        <div>
          {formattedServices.map((serviceItem) => (
            <div 
              style={customTagStyle} 
              key={serviceItem._id || serviceItem.id || serviceItem}
            >
              {typeof serviceItem === 'object' ? serviceItem.name : serviceItem}
            </div>
          ))}
        </div>
      );
    }
    if (roomType.serviceId && service) {
      return (
        <div style={customTagStyle}>
          {typeof service === 'object' ? service.name : service}
        </div>
      );
    }
    if (roomType.serviceId) {
      return <div style={customTagStyle}>{roomType.serviceId}</div>;
    }
    return 'Không có dịch vụ';
  };

  return (
    <Modal
      title="Chi tiết loại phòng"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={1} className={styles.modalDescriptions}>
        <Descriptions.Item label="ID">{roomType._id || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Tên loại phòng">{roomType.name || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          <Tooltip placement="topLeft" title={roomType.description || 'Không có mô tả'}>
            {roomType.description || 'Không có mô tả'}
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="Số người tối đa">{roomType.maxPeopleNumber || 0} người</Descriptions.Item>
        <Descriptions.Item label="Giá cơ bản">{(roomType.basePrice || 0).toLocaleString()}đ</Descriptions.Item>
        <Descriptions.Item label="Giá theo giờ (phụ trội)">{(roomType.overtimeHourlyPrice || 0).toLocaleString()}đ/giờ</Descriptions.Item>
        <Descriptions.Item label="Địa điểm">
          <Tooltip placement="topLeft" title={getLocationName()}>
            {getLocationName()}
          </Tooltip>
        </Descriptions.Item>
        
        <Descriptions.Item label="Dịch vụ">
          {renderServiceInfo()}
        </Descriptions.Item>
        
        <Descriptions.Item label="Ngày tạo">{formatDateTime(roomType.createdAt)}</Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">{formatDateTime(roomType.updatedAt)}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DetailRoomTypeModal;
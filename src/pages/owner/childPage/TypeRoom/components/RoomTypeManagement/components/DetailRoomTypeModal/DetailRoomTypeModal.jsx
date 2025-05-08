import { Modal, Descriptions, Tooltip, Image, Row, Col, Spin } from 'antd';
import { useEffect, useState } from 'react';
import styles from './DetailRoomTypeModal.module.scss';
import { useGetAccommodationTypeByIdQuery } from '../../../../../../../../redux/services/accommodationTypeApi';

const DetailRoomTypeModal = ({ isOpen, onCancel, roomType: initialRoomType }) => {
  const { data: response, isLoading } = useGetAccommodationTypeByIdQuery(
    initialRoomType?._id,
    { skip: !initialRoomType?._id || !isOpen }
  );
  
  const roomTypeDetails = response?.data;
  
  const roomType = roomTypeDetails || initialRoomType;

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!roomType) return;

    if (roomType?.images && Array.isArray(roomType.images)) {
      setImages(roomType.images);
    } else if (roomType?.image) {
      setImages(Array.isArray(roomType.image) ? roomType.image : [roomType.image]);
    } else {
      setImages([]);
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
    if (roomType.serviceIds && Array.isArray(roomType.serviceIds) && roomType.serviceIds.length > 0) {
      return (
        <div>
          {roomType.serviceIds.map((serviceItem) => (
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
    
    if (roomType.serviceId) {
      return <div style={customTagStyle}>{roomType.serviceId}</div>;
    }
    
    return 'Không có dịch vụ';
  };

  const renderImages = () => {
    if (images.length === 0) {
      return <div>Không có hình ảnh</div>;
    }

    return (
      <Image.PreviewGroup>
        <Row gutter={[16, 16]}>
          {images.map((img, index) => (
            <Col key={index} span={8}>
              <Image
                src={img}
                alt={`Hình ảnh phòng ${index + 1}`}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            </Col>
          ))}
        </Row>
      </Image.PreviewGroup>
    );
  };

  return (
    <Modal
      title="Chi tiết loại phòng"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Descriptions bordered column={1} className={styles.modalDescriptions}>
          <Descriptions.Item label={`Hình ảnh (${images.length})`}>
            {renderImages()}
          </Descriptions.Item>
          <Descriptions.Item label="ID">{roomType._id || roomType.id || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Tên loại phòng">{roomType.name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            <Tooltip placement="topLeft" title={roomType.description || 'Không có mô tả'}>
              {roomType.description || 'Không có mô tả'}
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label="Số người tối đa">{roomType.maxPeopleNumber || 0} người</Descriptions.Item>
          <Descriptions.Item label="Giá cơ bản">{(roomType.basePrice || 0).toLocaleString()}đ</Descriptions.Item>
          <Descriptions.Item label="Giá theo giờ (phụ trội)">{(roomType.overtimeHourlyPrice || 0).toLocaleString()}đ/giờ</Descriptions.Item>
          <Descriptions.Item label="Độ dài mật khẩu phòng">
            {roomType.numberOfPasswordRoom || 0}
          </Descriptions.Item>
          
          <Descriptions.Item label="Dịch vụ">
            {renderServiceInfo()}
          </Descriptions.Item>
          
          <Descriptions.Item label="Ngày tạo">{formatDateTime(roomType.createdAt)}</Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">{formatDateTime(roomType.updatedAt)}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default DetailRoomTypeModal;
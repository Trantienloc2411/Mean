import { Modal, Descriptions, Tag } from 'antd';
import styles from './DetailRoomTypeModal.module.scss';

const DetailRoomTypeModal = ({ isOpen, onCancel, roomType }) => {
  if (!roomType) return null;

  return (
    <Modal
      title="Chi tiết loại phòng"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={1} className={styles.modalDescriptions}>
        <Descriptions.Item label="Tên loại phòng">{roomType.name}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{roomType.description || 'Không có mô tả'}</Descriptions.Item>
        <Descriptions.Item label="Số người tối đa">{roomType.maxOccupancy} người</Descriptions.Item>
        <Descriptions.Item label="Diện tích">{roomType.area}</Descriptions.Item>
        <Descriptions.Item label="Loại giường">{roomType.bedType}</Descriptions.Item>
        <Descriptions.Item label="Giá theo giờ">{roomType.hourlyRate.toLocaleString()}đ</Descriptions.Item>
        <Descriptions.Item label="Giá theo ngày">{roomType.dailyRate.toLocaleString()}đ</Descriptions.Item>
        <Descriptions.Item label="Giá theo tuần">{roomType.weeklyRate.toLocaleString()}đ</Descriptions.Item>
        <Descriptions.Item label="Giá theo tháng">{roomType.monthlyRate.toLocaleString()}đ</Descriptions.Item>
        <Descriptions.Item label="Tiện ích đi kèm">
          <div className={styles.tagsList}>
            {roomType.amenities.map(amenity => (
              <Tag key={amenity}>{amenity}</Tag>
            ))}
          </div>
        </Descriptions.Item>
        {roomType.additionalFeatures && (
          <Descriptions.Item label="Tính năng bổ sung">
            <div className={styles.tagsList}>
              {roomType.additionalFeatures.map(feature => (
                <Tag key={feature}>{feature}</Tag>
              ))}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default DetailRoomTypeModal;
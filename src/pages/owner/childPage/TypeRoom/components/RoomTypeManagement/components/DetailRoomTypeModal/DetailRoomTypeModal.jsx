import { Modal, Descriptions, Tag } from 'antd';
import styles from './DetailRoomTypeModal.module.scss';
import { useGetAmenityByIdQuery } from '../../../../../../../../redux/services/serviceApi';

const DetailRoomTypeModal = ({ isOpen, onCancel, roomType, service }) => {
  if (!roomType) return null;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <Descriptions.Item label="ID">{roomType._id}</Descriptions.Item>
        <Descriptions.Item label="Tên loại phòng">{roomType.name}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{roomType.description || 'Không có mô tả'}</Descriptions.Item>
        <Descriptions.Item label="Số người tối đa">{roomType.maxPeopleNumber} người</Descriptions.Item>
        <Descriptions.Item label="Giá cơ bản">{roomType.basePrice?.toLocaleString()}đ</Descriptions.Item>
        <Descriptions.Item label="Giá theo giờ (phụ trội)">{roomType.overtimeHourlyPrice?.toLocaleString()}đ/giờ</Descriptions.Item>
        <Descriptions.Item label="ID Địa điểm">{roomType.rentalLocationId}</Descriptions.Item>
        <Descriptions.Item label="Dịch vụ">{service?.name || 'Loading...'}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{formatDateTime(roomType.createdAt)}</Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">{formatDateTime(roomType.updatedAt)}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DetailRoomTypeModal;
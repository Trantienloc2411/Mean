import { Modal, Descriptions } from 'antd';
import styles from './DetailAmenityModal.module.scss';

const DetailAmenityModal = ({ isOpen, onCancel, amenity }) => {
  if (!amenity) return null;

  const getStatusDisplay = (status) => {
    const statusMap = {
      'Active': { text: 'Đang hoạt động', className: styles.active },
      'Paused': { text: 'Tạm dừng', className: styles.paused },
      'Expired': { text: 'Hết hạn', className: styles.expired }
    };
    const { text, className } = statusMap[status] || {};
    return <span className={`${styles.status} ${className}`}>{text}</span>;
  };

  return (
    <Modal
      title="Chi tiết tiện ích"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tên tiện ích">{amenity.name}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{amenity.description}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {getStatusDisplay(amenity.status)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DetailAmenityModal;
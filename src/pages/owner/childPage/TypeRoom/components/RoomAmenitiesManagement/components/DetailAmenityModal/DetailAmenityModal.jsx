import { Modal, Descriptions } from 'antd';
import styles from './DetailAmenityModal.module.scss';

const DetailAmenityModal = ({ isOpen, onCancel, amenity }) => {
  if (!amenity) return null;

  const getStatusDisplay = (status) => {
    const statusMap = {
      'Active': { text: 'Đang hoạt động', className: styles.active },
      'Inactive': { text: 'Không hoạt động', className: styles.inactive },
    };
    const { text, className } = statusMap[status] || {};
    return <span className={`${styles.status} ${className}`}>{text}</span>;
  };

  return (
    <Modal
      title="Chi tiết dịch vụ"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tên dịch vụ">{amenity.name}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{amenity.description}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{amenity.createdAt}</Descriptions.Item>
        <Descriptions.Item label="Cập nhật lần cuối">{amenity.updatedAt}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {getStatusDisplay(amenity.status)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DetailAmenityModal;
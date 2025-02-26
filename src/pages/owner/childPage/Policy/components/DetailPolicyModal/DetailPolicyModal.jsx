import { Modal, Descriptions } from 'antd';
import styles from './DetailPolicyModal.module.scss';

const DetailPolicyModal = ({ isOpen, policy, onCancel }) => {
  const getStatusClassName = (status) => {
    switch (status) {
      case 2: 
        return 'approved';
      case 1: 
        return 'pending';
      case 3: 
        return 'rejected';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 2: 
        return 'Đã duyệt';
      case 1:
        return 'Đang chờ';
      case 3: 
        return 'Bị từ chối';
      default:
        return 'Không xác định';
    }
  };

  return (
    <Modal
      title="Chi tiết Chính sách"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      className={styles.detailPolicyModal}
      width={700}
    >
      {policy && (
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="ID Chính sách">{policy._id}</Descriptions.Item>
          <Descriptions.Item label="ID Chủ sở hữu">{policy.ownerId}</Descriptions.Item>
          <Descriptions.Item label="Tên chính sách">{policy.Name}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">{policy.Description}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{policy.CreatedDate}</Descriptions.Item>
          <Descriptions.Item label="Ngày áp dụng">{policy.ApplyDate}</Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">{policy.EndDate}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <span className={`${styles.status} ${styles[getStatusClassName(policy.Status)]}`}>
              {getStatusText(policy.Status)}
            </span>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default DetailPolicyModal;
import { Modal, Descriptions, Tag } from 'antd';
import dayjs from 'dayjs';
import styles from './DetailPolicyModal.module.scss';

const DetailPolicyModal = ({ isOpen, onCancel, policy }) => {
  const getStatusTag = (status) => {
    const statusConfig = {
      'Approved': { color: 'success', text: 'Đã duyệt' },
      'Pending': { color: 'warning', text: 'Đang chờ' },
      'Rejected': { color: 'error', text: 'Bị từ chối' },
    };

    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return dayjs(date).format('HH:mm DD/MM/YYYY');
  };

  return (
    <Modal
      title="Chi tiết chính sách"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={700}
      className={styles.detailModal}
    >
      {policy && (
        <Descriptions bordered column={1} className={styles.descriptions}>
          <Descriptions.Item label="Tên chính sách" className={styles.descriptionItem}>
            {policy.Name}
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả" className={styles.descriptionItem}>
            <div className={styles.description}>
              {policy.Description || 'Không có mô tả'}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian" className={styles.descriptionItem}>
            <div className={styles.timeInfo}>
              <div>
                <strong>Ngày tạo:</strong> {formatDate(policy.CreatedDate)}
              </div>
              <div>
                <strong>Ngày áp dụng:</strong> {formatDate(policy.ApplyDate)}
              </div>
              <div>
                <strong>Ngày kết thúc:</strong> {formatDate(policy.EndDate)}
              </div>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái" className={styles.descriptionItem}>
            {getStatusTag(policy.Status)}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default DetailPolicyModal;
import { Modal, Descriptions, Badge } from 'antd';
import styles from './DetailPolicyModal.module.scss';

const DetailPolicyModal = ({ isOpen, policy, onCancel }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'processing';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case 'Approved':
        return 'Đã duyệt';
      case 'Pending':
        return 'Đang chờ';
      case 'Rejected':
        return 'Bị từ chối';
      default:
        return status;
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
          <Descriptions.Item label="Tên chính sách">{policy.Name}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">{policy.Description}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{policy.CreatedDate}</Descriptions.Item>
          <Descriptions.Item label="Ngày áp dụng">{policy.ApplyDate}</Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">{policy.EndDate}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Badge 
              status={getStatusBadge(policy.Status)} 
              text={getStatusText(policy.Status)} 
            />
          </Descriptions.Item>
          <Descriptions.Item label="ID Chính sách">{policy._id}</Descriptions.Item>
          <Descriptions.Item label="ID Chủ sở hữu">{policy.ownerId}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default DetailPolicyModal;
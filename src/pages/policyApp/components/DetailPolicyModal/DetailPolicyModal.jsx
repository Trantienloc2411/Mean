import { Modal, Descriptions } from 'antd';
import styles from './DetailPolicyModal.module.scss';

const DetailPolicyModal = ({ isOpen, onCancel, policy }) => {
  if (!policy) return null;

  return (
    <Modal
      title="Chi tiết chính sách"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Descriptions bordered column={1} className={styles.modalDescriptions}>
        <Descriptions.Item label="Tên chính sách">{policy.Name}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{policy.Description || 'Không có mô tả'}</Descriptions.Item>
        <Descriptions.Item label="Giá trị">{policy.Value}</Descriptions.Item>
        <Descriptions.Item label="Đơn vị">{policy.Unit === 'percent' ? 'Phần trăm (%)' : 'VND'}</Descriptions.Item>
        <Descriptions.Item label="Ngày bắt đầu">{policy.StartTime}</Descriptions.Item>
        <Descriptions.Item label="Ngày kết thúc">{policy.EndTime}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{policy.Status}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DetailPolicyModal;

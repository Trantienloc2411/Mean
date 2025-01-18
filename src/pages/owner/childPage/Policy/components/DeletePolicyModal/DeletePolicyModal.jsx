import { Modal, Button } from 'antd';
import styles from './DeletePolicyModal.module.scss';

const DeletePolicyModal = ({ isOpen, onCancel, onConfirm, policyName }) => {
  return (
    <Modal
      title="Xác nhận xóa chính sách"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          className={styles['ant-btn']} 
        >
          Huỷ
        </Button>,
        <Button
          key="delete"
          danger
          type="primary"
          onClick={onConfirm}
          className={styles['ant-btn-danger']} 
        >
          Có, Tôi chắc chắn
        </Button>,
      ]}
      className={styles['modal-container']} 
    >
      <p>
        Bạn đang sắp xoá chính sách "{policyName}". Hành động này không thể hoàn tác.
      </p>
    </Modal>
  );
};

export default DeletePolicyModal;

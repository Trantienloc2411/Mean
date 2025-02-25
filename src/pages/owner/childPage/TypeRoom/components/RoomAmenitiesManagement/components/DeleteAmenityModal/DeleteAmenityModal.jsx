import { Modal, Button, Spin } from 'antd';
import styles from './DeleteAmenityModal.module.scss';

const DeleteAmenityModal = ({ isOpen, onCancel, onConfirm, amenityName, isLoading }) => {
  return (
    <Modal
      title="Xác nhận xoá tiện ích"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} className={styles["ant-btn"]} disabled={isLoading}>
          Huỷ
        </Button>,
        <Button 
          key="delete" 
          danger 
          type="primary" 
          onClick={onConfirm} 
          className={styles["ant-btn-danger"]}
          loading={isLoading}
        >
          Có, Tôi chắc chắn
        </Button>
      ]}
      className={styles["modal-container"]}
    >
      <Spin spinning={isLoading}>
        <p>
          Bạn đang sắp xoá tiện ích "{amenityName}". Hành động này không thể hoàn tác.
        </p>
      </Spin>
    </Modal>
  );
};

export default DeleteAmenityModal;
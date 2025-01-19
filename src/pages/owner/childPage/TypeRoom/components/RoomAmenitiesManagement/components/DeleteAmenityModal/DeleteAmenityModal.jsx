import { Modal, Button } from 'antd';
import styles from './DeleteAmenityModal.module.scss';

const DeleteAmenityModal = ({ isOpen, onCancel, onConfirm, amenityName }) => {
  return (
    <Modal
      title="Xác nhận xoá tiện ích"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} className={styles["ant-btn"]}>
          Huỷ
        </Button>,
        <Button key="delete" danger type="primary" onClick={onConfirm} className={styles["ant-btn-danger"]}>
          Có, Tôi chắc chắn
        </Button>
      ]}
      className={styles["modal-container"]}
    >
      <p>
        Bạn đang sắp xoá tiện ích "{amenityName}". Hành động này không thể hoàn tác.
      </p>
    </Modal>

  );
};

export default DeleteAmenityModal;
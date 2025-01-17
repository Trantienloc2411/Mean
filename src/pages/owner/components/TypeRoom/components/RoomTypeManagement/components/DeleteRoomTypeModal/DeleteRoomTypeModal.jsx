import { Modal, Button } from 'antd';
import styles from './DeleteRoomTypeModal.module.scss';

const DeleteRoomTypeModal = ({ isOpen, onCancel, onConfirm, roomTypeName }) => {
  return (
    <Modal
      title="Xác nhận xoá loại phòng"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button key="delete" danger type="primary" onClick={onConfirm}>
          Có, Tôi chắc chắn
        </Button>
      ]}
    >
      <p>
        Bạn đang sắp xoá loại phòng "{roomTypeName}". Hành động này không thể hoàn tác.
      </p>
    </Modal>
  );
};

export default DeleteRoomTypeModal;
import { Modal , Button} from 'antd';

const DeleteCouponModal = ({ isOpen, onCancel, onConfirm, couponName }) => {
  return (
    <Modal
      title="Bạn có muốn chắc chắn xoá mã giảm giá này chứ? "
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
        Bạn đang sắp thực hiện việc xoá mã giảm giá tên "{couponName}". Và hành động này sẽ không thể quay lại.
      </p>
    </Modal>
  );
};

export default DeleteCouponModal;
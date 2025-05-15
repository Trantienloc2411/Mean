import { Modal, Typography } from "antd"

const { Text } = Typography

const DeleteRoomTypeModal = ({ isOpen, onCancel, onConfirm, roomTypeName, isSubmitting }) => {
  return (
    <Modal
      title="Xác nhận xóa"
      open={isOpen}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{
        danger: true,
        loading: isSubmitting,
        disabled: isSubmitting,
      }}
      cancelButtonProps={{ disabled: isSubmitting }}
    >
      <Text>
        Bạn có chắc chắn muốn xóa loại phòng <strong>{roomTypeName}</strong>?
      </Text>
      <br />
      <Text type="danger">Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.</Text>
    </Modal>
  )
}

export default DeleteRoomTypeModal

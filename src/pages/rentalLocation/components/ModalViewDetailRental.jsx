import { Modal, Descriptions, Tag } from "antd";

export default function ModalViewDetailRental({ visible, onClose, data }) {
  if (!data) return null; // Nếu không có dữ liệu, không hiển thị gì cả.
console.log(data);

  return (
    <Modal
      title={`Chi tiết - ${data.name}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Tên địa điểm">{data.name}</Descriptions.Item>
        <Descriptions.Item label="Người đại diện">
          {data.representative || "Chưa cập nhật"}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{data.address}</Descriptions.Item>
        <Descriptions.Item label="Số phòng">
          {data.roomCount || "Không có thông tin"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {data.status ? (
            <Tag color="green">Hoạt động</Tag>
          ) : (
            <Tag color="red">Ngừng hoạt động</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Giờ hoạt động">
          {`${data.openHour} - ${data.closeHour}`}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          {data.description || "Không có mô tả"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

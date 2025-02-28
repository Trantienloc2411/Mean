import { Modal, Descriptions, Button, Tag } from "antd";
import dayjs from "dayjs";
import styles from "../../Coupon.module.scss";

const ViewCouponModal = ({ isOpen, onCancel, couponData }) => {
  return (
    <Modal
      title="Chi tiết mã giảm giá"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="close" type="primary" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={600}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Tên mã giảm giá">
          {couponData?.name}
        </Descriptions.Item>

        <Descriptions.Item label="Mã giảm giá">
          {couponData?.couponCode}
        </Descriptions.Item>

        <Descriptions.Item label="Loại giảm giá">
          {couponData?.discountBasedOn === "Percentage"
            ? "Phần trăm (%)"
            : "Số tiền cố định"}
        </Descriptions.Item>

        <Descriptions.Item label="Giá trị">
          {couponData?.discountBasedOn === "Percentage"
            ? `${couponData?.amount}%`
            : `${couponData?.amount?.toLocaleString()}đ`}
        </Descriptions.Item>

        <Descriptions.Item label="Giảm giá tối đa">
          {couponData?.maxDiscount
            ? `${couponData?.maxDiscount?.toLocaleString()}đ`
            : "Không giới hạn"}
        </Descriptions.Item>

        <Descriptions.Item label="Thời gian bắt đầu">
          {dayjs(couponData?.startDate, "DD/MM/YYYY HH:mm:ss").format(
            "DD/MM/YYYY HH:mm:ss"
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Thời gian kết thúc">
          {dayjs(couponData?.endDate, "DD/MM/YYYY HH:mm:ss").format(
            "DD/MM/YYYY HH:mm:ss"
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          <span
            className={`${styles.status} ${
              styles[couponData?.isActive ? "active" : "inactive"]
            }`}
          >
            {couponData?.isActive ? "Đang hoạt động" : "Hết hạn"}
          </span>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {dayjs(couponData?.createdAt, "DD/MM/YYYY HH:mm:ss").format(
            "DD/MM/YYYY HH:mm:ss"
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Cập nhật lần cuối">
          {dayjs(couponData?.updatedAt, "DD/MM/YYYY HH:mm:ss").format(
            "DD/MM/YYYY HH:mm:ss"
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewCouponModal;

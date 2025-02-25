import { Modal, Descriptions, Spin } from 'antd';
import dayjs from 'dayjs';
import styles from './DetailPolicyModal.module.scss';
import { useGetPolicySystemByIdQuery } from '../../../../redux/services/policySystemApi';

const DetailPolicyModal = ({ isOpen, onCancel, policy }) => {
  if (!policy) return null;
  const { data: policyDetail, isLoading } = useGetPolicySystemByIdQuery(policy.id, {
    skip: !isOpen || !policy.id,
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dayjs(dateString, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
  };

  const formatUnit = (unit) => {
    if (!unit) return 'N/A';
    return unit.toLowerCase() === 'percent' ? 'Phần trăm (%)' : unit;
  };

  const getStaffName = (staffId) => {
    if (!staffId) return 'Không có thông tin';
    if (staffId && staffId.userId && staffId.userId.fullName) {
      return staffId.userId.fullName;
    }
    return 'Không có thông tin';
  };

  const renderBookingInfo = (booking) => {
    if (!booking) return 'Không có thông tin đặt phòng';
    return (
      <>
        <strong>ID:</strong> {booking._id || 'N/A'}
        <br />
        <strong>Giá trị:</strong> {booking.value || 'N/A'}
        <br />
        <strong>Đơn vị:</strong> {formatUnit(booking.unit)}
        <br />
        <strong>Ngày tạo:</strong> {formatDate(booking.createdAt)}
        <br />
        <strong>Ngày cập nhật:</strong> {formatDate(booking.updatedAt)}
      </>
    );
  };

  const renderCategoryInfo = (category) => {
    if (!category) return 'Không có thông tin danh mục';
    return (
      <>
        <strong>ID:</strong> {category._id || 'N/A'}
        <br />
        <strong>Tên:</strong> {category.categoryName || 'N/A'}
        <br />
        <strong>Mô tả:</strong> {category.categoryDescription || 'Không có mô tả'}
      </>
    );
  };
  const displayData = policyDetail || policy;

  return (
    <Modal
      title="Chi tiết chính sách"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Descriptions bordered column={1} className={styles.modalDescriptions}>
          <Descriptions.Item label="ID">{displayData._id || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Tên chính sách">{displayData.name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Được tạo bởi">{getStaffName(displayData.staffId)}</Descriptions.Item>
          <Descriptions.Item label="Cập nhật bởi">
            {displayData.updateBy && displayData.updateBy.userId && displayData.updateBy.userId.fullName 
              ? displayData.updateBy.userId.fullName 
              : 'Không có thông tin'}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">{displayData.description || 'Không có mô tả'}</Descriptions.Item>
          <Descriptions.Item label="Giá trị">{displayData.value || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Đơn vị">{formatUnit(displayData.unit)}</Descriptions.Item>
          <Descriptions.Item label="Thông tin đặt phòng">
            {renderBookingInfo(displayData.policySystemBookingId)}
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">
            {renderCategoryInfo(displayData.policySystemCategoryId)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày bắt đầu">
            {formatDate(displayData.startDate)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">
            {formatDate(displayData.endDate)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {formatDate(displayData.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {formatDate(displayData.updatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <span style={{
              color: displayData.isActive ? '#52c41a' : '#ff4d4f',
              fontWeight: 'bold'
            }}>
              {displayData.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
            </span>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default DetailPolicyModal;
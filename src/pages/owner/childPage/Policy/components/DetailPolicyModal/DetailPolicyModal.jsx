import { Modal, Descriptions, Table, Typography, Divider, Tag, Collapse, Space } from 'antd';
import styles from './DetailPolicyModal.module.scss';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const DetailPolicyModal = ({ isOpen, policy, onCancel }) => {
  if (!policy) {
    return (
      <Modal
        title="Chi tiết Chính sách"
        open={isOpen}
        onCancel={onCancel}
        footer={null}
        className={styles.detailPolicyModal}
      >
        <p>Không có thông tin chính sách để hiển thị.</p>
      </Modal>
    );
  }

  const policyData = policy?._original || policy;

  const getStatusClassName = (status) => {
    switch (status) {
      case 2:
        return 'approved';
      case 1:
        return 'pending';
      case 3:
        return 'rejected';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 2:
        return 'Đã duyệt';
      case 1:
        return 'Đang chờ';
      case 3:
        return 'Bị từ chối';
      default:
        return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Không có';
      return dayjs(dateString, "DD/MM/YYYY HH:mm:ss").format('HH:mm DD/MM/YYYY');
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString || 'Không có';
    }
  };

  const values = policyData?.values || [];
  const ownerInfo = policyData?.ownerId && typeof policyData.ownerId === 'object' && policyData.ownerId.userId
    ? policyData.ownerId.userId
    : null;

  const hasOwnerDetails = ownerInfo && typeof ownerInfo === 'object';

  const valuesColumns = [
    { title: 'Giá trị 1', dataIndex: 'val1', key: 'val1' },
    { title: 'Giá trị 2', dataIndex: 'val2', key: 'val2' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' },
    { title: 'Loại giá trị', dataIndex: 'valueType', key: 'valueType' },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    {
      title: 'Hashtag',
      dataIndex: 'hashTag',
      key: 'hashTag',
      render: (tag) => tag ? <Tag color="blue">{tag}</Tag> : 'Không có',
    },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: formatDate },
    { title: 'Ngày cập nhật', dataIndex: 'updatedAt', key: 'updatedAt', render: formatDate },
  ];

  console.log("Policy Data:", policyData);
  console.log("Values:", values);

  return (
    <Modal
      title="Chi tiết Chính sách"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      className={styles.detailPolicyModal}
      width={1000}
      bodyStyle={{ maxHeight: '80vh', overflowY: 'auto', padding: '24px' }}
    >
      {policyData && (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Descriptions
            title="Thông tin chính sách"
            bordered
            column={1}
            size="middle"
            labelStyle={{ fontWeight: 'bold', width: '200px' }}
          >
            <Descriptions.Item label="ID">
              {policyData._id || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Tên chính sách">
              {policyData.policyTitle || policy?.Name || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {policyData.policyDescription || policy?.Description || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày áp dụng">
              {formatDate(policyData.startDate) || policy?.ApplyDate || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">
              {formatDate(policyData.endDate) || policy?.EndDate || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {formatDate(policyData.createdAt) || policy?.CreatedDate || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {formatDate(policyData.updatedAt) || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <span className={`${styles.status} ${styles[getStatusClassName(policyData.status || policy?.Status)]}`}>
                {getStatusText(policyData.status || policy?.Status)}
              </span>
            </Descriptions.Item>
          </Descriptions>

          {hasOwnerDetails && (
            <Collapse defaultActiveKey={['1']}>
              <Panel header="Thông tin chủ sở hữu" key="1">
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  labelStyle={{ fontWeight: 'bold' }}
                >
                  <Descriptions.Item label="Chủ sở hữu">
                    {ownerInfo.fullName || 'Không có'}
                  </Descriptions.Item>
                </Descriptions>
              </Panel>
            </Collapse>
          )}

          {values.length > 0 && (
            <Collapse defaultActiveKey={['1']}>
              <Panel header={`Giá trị chính sách (${values.length})`} key="1">
                <Table
                  dataSource={values}
                  columns={valuesColumns}
                  rowKey="_id"
                  pagination={values.length > 5 ? { pageSize: 5 } : false}
                  size="small"
                  scroll={{ x: 'max-content' }}
                />
              </Panel>
            </Collapse>
          )}
        </Space>
      )}
    </Modal>
  );
};

export default DetailPolicyModal;
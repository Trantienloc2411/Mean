import { Modal, Descriptions, Table, Typography, Tag, Collapse, Space, Spin } from 'antd';
import styles from './DetailPolicyModal.module.scss';
import dayjs from 'dayjs';

const { Panel } = Collapse;

const DetailPolicyModal = ({ 
  isOpen, 
  policy, 
  policyDetailData,
  isLoadingPolicyDetail,
  policyDetailError,
  onCancel 
}) => {
  if (!policy && !policyDetailData) {
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

  const policyData = policyDetailData?.data || policy?._original || policy;
  const values = policyData?.values || [];
  
  const ownerInfo = policyData?.ownerId && typeof policyData.ownerId === 'object' && policyData.ownerId.userId
    ? policyData.ownerId.userId
    : null;

  const hasOwnerDetails = ownerInfo && typeof ownerInfo === 'object';

  const valuesColumns = [
    { 
      title: 'Giá trị', 
      dataIndex: 'val', 
      key: 'val',
      render: (text) => text || 'Không có'
    },
    { 
      title: 'Mô tả', 
      dataIndex: 'description', 
      key: 'description',
      render: (text) => text || 'Không có'
    },
    { 
      title: 'Đơn vị', 
      dataIndex: 'unit', 
      key: 'unit',
      render: (text) => text || 'Không có'
    },
    { 
      title: 'Loại giá trị', 
      dataIndex: 'valueType', 
      key: 'valueType',
      render: (text) => text || 'Không có'
    },
    { 
      title: 'Ghi chú', 
      dataIndex: 'note', 
      key: 'note',
      render: (text) => text || 'Không có'
    },
    {
      title: 'Hashtag',
      dataIndex: 'hashTag',
      key: 'hashTag',
      render: (tag) => tag ? <Tag color="blue">{tag}</Tag> : 'Không có',
    },
    { 
      title: 'Ngày tạo', 
      dataIndex: 'createdAt', 
      key: 'createdAt', 
      render: formatDate 
    },
    { 
      title: 'Ngày cập nhật', 
      dataIndex: 'updatedAt', 
      key: 'updatedAt', 
      render: formatDate 
    },
  ];

  console.log("API Policy Data:", policyDetailData);
  console.log("Policy Data:", policyData);
  console.log("Policy Values:", values);

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
      {isLoadingPolicyDetail ? (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '10px' }}>Đang tải thông tin chi tiết...</p>
        </div>
      ) : policyDetailError ? (
        <div style={{ textAlign: 'center', color: 'red' }}>
          <p>Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
          <p>Chi tiết lỗi: {policyDetailError.message || JSON.stringify(policyDetailError)}</p>
        </div>
      ) : policyData ? (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Descriptions
            title="Thông tin chính sách"
            bordered
            column={1}
            size="middle"
            labelStyle={{ fontWeight: 'bold', width: '200px' }}
          >
            <Descriptions.Item label="ID">
              {policyData._id || policyData.id || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Tên chính sách">
              {policyData.policyTitle || policy?.Name || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {policyData.policyDescription || policy?.Description || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày áp dụng">
              {formatDate(policyData.startDate) || formatDate(policy?.ApplyDate) || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">
              {formatDate(policyData.endDate) || formatDate(policy?.EndDate) || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {formatDate(policyData.createdAt) || formatDate(policy?.CreatedDate) || 'Không có'}
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

          {values && values.length > 0 && (
            <Collapse defaultActiveKey={['1']}>
              <Panel header={`Giá trị chính sách (${values.length})`} key="1">
                <Table
                  dataSource={values}
                  columns={valuesColumns}
                  rowKey={record => record._id || record.id}
                  pagination={values.length > 5 ? { pageSize: 5 } : false}
                  size="small"
                  scroll={{ x: 'max-content' }}
                />
              </Panel>
            </Collapse>
          )}
        </Space>
      ) : (
        <p>Không có thông tin chính sách để hiển thị.</p>
      )}
    </Modal>
  );
};

export default DetailPolicyModal;
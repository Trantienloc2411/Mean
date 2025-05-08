import { Modal, Descriptions, Table, Typography, Collapse, Space, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import styles from './DetailPolicyModal.module.scss';

const { Panel } = Collapse;
const { Text } = Typography;

const DetailPolicyModal = ({ isOpen, onCancel, policy, isLoading }) => {
  if (!policy) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có';
    try {
      return dayjs(dateString, "DD/MM/YYYY HH:mm:ss").format('HH:mm DD/MM/YYYY');
    } catch (e) {
      return dateString; 
    }
  };

  const formatUnit = (unit) => {
    if (!unit) return 'N/A';
    return unit.toLowerCase() === 'percent' ? 'Phần trăm (%)' : 
           unit.toLowerCase() === 'vnd' ? 'VND' : unit;
  };

  const getStaffName = (staffId) => {
    if (!staffId) return 'Không có thông tin';
    if (staffId.userId?.fullName) {
      return staffId.userId.fullName;
    }
    return 'Không có thông tin';
  };

  const values = policy?.values || [];

  const valuesColumns = [
    { 
      title: 'Giá trị', 
      dataIndex: 'val',
      key: 'val',
      render: (text) => text || 'Không có'
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { title: 'Đơn vị', dataIndex: 'unit', key: 'unit', render: formatUnit },
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
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Descriptions
            title="Thông tin chính sách"
            bordered
            column={1}
            size="middle"
            labelStyle={{ fontWeight: 'bold', width: '200px' }}
          >
            <Descriptions.Item label="ID">
              <Text copyable>{policy._id || 'Không có'}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Tên chính sách">
              {policy.name || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {policy.description || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Người tạo">
              {getStaffName(policy.staffId)}
            </Descriptions.Item>
            <Descriptions.Item label="Danh mục">
              {policy.policySystemCategoryId?.categoryName || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">
              {formatDate(policy.startDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">
              {formatDate(policy.endDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {formatDate(policy.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {formatDate(policy.updatedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <span className={`${styles.status} ${policy.isActive ? styles.active : styles.expired}`}>
                {policy.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
              </span>
            </Descriptions.Item>
          </Descriptions>

          {policy.policySystemCategoryId && (
            <Collapse defaultActiveKey={['1']}>
              <Panel header="Thông tin danh mục" key="1">
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  labelStyle={{ fontWeight: 'bold' }}
                >
                  <Descriptions.Item label="ID">
                    <Text copyable>{policy.policySystemCategoryId._id || 'Không có'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên danh mục">
                    {policy.policySystemCategoryId.categoryName || 'Không có'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả">
                    {policy.policySystemCategoryId.categoryDescription || 'Không có'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Key">
                    {policy.policySystemCategoryId.categoryKey || 'Không có'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">
                    {formatDate(policy.policySystemCategoryId.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày cập nhật">
                    {formatDate(policy.policySystemCategoryId.updatedAt)}
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
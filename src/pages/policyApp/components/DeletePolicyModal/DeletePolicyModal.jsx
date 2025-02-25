import React, { useState } from 'react';
import { Modal, Button, Typography, Alert } from 'antd';
import PropTypes from 'prop-types';
import styles from './DeletePolicyModal.module.scss';

const { Text } = Typography;

const DeletePolicyModal = ({ isOpen, onCancel, onConfirm, policyName }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm();
    } catch (error) {
      setError('Có lỗi xảy ra khi xoá chính sách. Vui lòng thử lại sau.');
      console.error('Error deleting policy:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onCancel();
  };

  return (
    <Modal
      title="Xác nhận xoá chính sách"
      open={isOpen}
      onCancel={handleCancel}
      maskClosable={!isDeleting}
      closable={!isDeleting}
      keyboard={!isDeleting}
      footer={[
        <Button 
          key="cancel" 
          onClick={handleCancel}
          disabled={isDeleting}
        >
          Huỷ
        </Button>,
        <Button 
          key="delete" 
          danger 
          type="primary" 
          onClick={handleConfirm}
          loading={isDeleting}
        >
          {isDeleting ? 'Đang xoá...' : 'Có, Tôi chắc chắn'}
        </Button>
      ]}
    >
      {error && (
        <Alert
          type="error"
          message={error}
          className={styles.errorAlert}
          style={{ marginBottom: 16 }}
        />
      )}
      
      <div className={styles.confirmationContent}>
        <p>
          Bạn đang sắp xoá chính sách <Text strong>"{policyName || 'Không có tên'}"</Text>
        </p>
        <Alert
          message="Cảnh báo"
          description="Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến chính sách này sẽ bị xoá vĩnh viễn."
          type="warning"
          showIcon
        />
      </div>
    </Modal>
  );
};

DeletePolicyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  policyName: PropTypes.string
};

DeletePolicyModal.defaultProps = {
  policyName: 'Không có tên'
};

export default DeletePolicyModal;
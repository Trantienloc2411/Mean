import { Modal, Input, Button, message, Spin } from 'antd';
import { useState, useEffect } from 'react';
import styles from './ReplyReport.module.scss';
import { useGetStaffByIdQuery } from '../../../../redux/services/staffApi';

const { TextArea } = Input;

export default function ReplyReport({ isOpen, onClose, report, onSubmit, isLoading }) {
  const [replyContent, setReplyContent] = useState('');
  const [staffData, setStaffData] = useState(null);

  const getCurrentUser = () => {
    try {
      const userId = localStorage.getItem('user_id');
      const userRole = localStorage.getItem('user_role');
      
      if (!userId || !userRole) {
        return null;
      }
      return {
        id: userId,
        role: userRole
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  const currentUser = getCurrentUser();

  const {
    data: staffResponse,
    isLoading: isLoadingStaff,
    error: staffError
  } = useGetStaffByIdQuery(currentUser?.id, {
    skip: !currentUser?.id || !isOpen
  });

  useEffect(() => {
    if (staffResponse && !isLoadingStaff) {
      const staff = staffResponse.data || staffResponse;
      setStaffData(staff);
      console.log('Staff ID:', staff.id); 
    }
  }, [staffResponse, isLoadingStaff]);
  useEffect(() => {
    if (isOpen && report) {
      setReplyContent('');
    }
  }, [isOpen, report]);

  const handleSubmit = () => {
    if (!replyContent.trim()) {
      message.error('Vui lòng nhập nội dung trả lời');
      return;
    }
  
    if (!staffData?.id) {
      message.error('Không thể xác định thông tin nhân viên');
      return;
    }
  
    console.log('Staff ID on submit:', staffData.id); 
  
    const replyData = {
      ...report.originalData,
      replyBy: staffData.id,
      contentReply: replyContent,
      isReviewed: true
    };
  
    onSubmit(replyData);
  };
  

  if (!report) return null;

  if (isLoadingStaff) {
    return (
      <Modal
        title="Trả lời báo cáo"
        open={isOpen}
        onCancel={onClose}
        footer={null}
        className={styles.modal}
        width={500}
      >
        <div className={styles.loadingContainer}>
          <Spin tip="Đang tải thông tin..." />
        </div>
      </Modal>
    );
  }

  if (staffError) {
    return (
      <Modal
        title="Trả lời báo cáo"
        open={isOpen}
        onCancel={onClose}
        footer={null}
        className={styles.modal}
        width={500}
      >
        <div className={styles.errorContainer}>
          <p>Không thể tải thông tin nhân viên. Vui lòng thử lại sau.</p>
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Trả lời báo cáo"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className={styles.modal}
      width={500}
    >
      <div className={styles.content}>
        <div className={styles.reportInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Booking ID:</span>
            <span className={styles.value}>{report.customerName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Lý do:</span>
            <span className={styles.value}>{report.reason}</span>
          </div>
        </div>

        <div className={styles.reportContent}>
          <h4>Nội dung báo cáo:</h4>
          <p>{report.content}</p>
          
          {report.images && report.images.length > 0 && (
            <div className={styles.imagesContainer}>
              <h4>Hình ảnh:</h4>
              <div className={styles.imageGallery}>
                {report.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={image} 
                    alt={`Report image ${index + 1}`} 
                    className={styles.reportImage}
                    onClick={() => window.open(image, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.replySection}>
          <h4>Nội dung trả lời:</h4>
          <TextArea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={4}
            placeholder="Nhập nội dung trả lời..."
            className={styles.replyInput}
          />
          
          <div className={styles.actions}>
            <Button onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit} 
              loading={isLoading}
            >
              Gửi trả lời
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
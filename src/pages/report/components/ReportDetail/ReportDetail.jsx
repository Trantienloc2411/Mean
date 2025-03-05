import { Modal, Image, Spin, Divider } from 'antd';
import { useEffect, useState } from 'react';
import styles from './ReportDetail.module.scss';

export default function ReportDetail({ isOpen, onClose, report, isLoading }) {
  const [staffName, setStaffName] = useState(null);

  useEffect(() => {
    if (report?.originalData?.replyBy?.userId?.fullName) {
      setStaffName(report.originalData.replyBy.userId.fullName);
    }
  }, [report]);

  if (!report && !isLoading) return null;

  return (
    <Modal
      title="Chi tiết báo cáo"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className={styles.modal}
      width={600}
    >
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.mainInfo}>
              <h3>Booking ID: {report.customerName}</h3>
              <span className={`${styles.status} ${styles[report.isReviewed ? 'replied' : 'pending']}`}>
                {report.isReviewed ? 'Đã xem' : 'Chưa xem'}
              </span>
            </div>
            <span className={styles.date}>{report.createdAt}</span>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>ID:</label>
              <span>{report.id}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Booking ID:</label>
              <span>{report.customerName}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Lý do:</label>
              <span>{report.reason}</span>
            </div>
          </div>

          <div className={styles.contentSection}>
            <label>Nội dung báo cáo:</label>
            <p>{report.content}</p>
          </div>

          {report.images && report.images.length > 0 && (
            <div className={styles.imagesSection}>
              <label>Hình ảnh:</label>
              <div className={styles.imageGallery}>
                {report.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Report image ${index + 1}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
                    preview={{
                      src: image,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {report.originalData?.contentReply && (
            <>
              <Divider style={{ margin: '16px 0' }} />
              <div className={styles.replySection}>
                <div className={styles.replyHeader}>
                  <label>Phản hồi:</label>
                  <span className={styles.replyInfo}>
                    Bởi: {staffName || 'Admin'} | {report.originalData.updatedAt || report.updatedAt}
                  </span>
                </div>
                <p className={styles.replyContent}>{report.originalData.contentReply}</p>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

import { Modal, Tag } from 'antd';
import styles from './ReportDetail.module.scss';

export default function ReportDetail({ isOpen, onClose, report }) {
  if (!report) return null;

  return (
    <Modal
      title="Chi tiết báo cáo"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className={styles.modal}
      width={600}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.mainInfo}>
            <h3>{report.locationName}</h3>
            <Tag className={`${styles.status} ${styles[report.status.toLowerCase()]}`}>
              {report.status === 'Reviewed' ? 'Đã xem' : 'Chưa xem'}
            </Tag>
          </div>
          <span className={styles.date}>{report.createdAt}</span>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label>ID:</label>
            <span>{report.id}</span>
          </div>
          <div className={styles.infoItem}>
            <label>Khách hàng:</label>
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
      </div>
    </Modal>
  );
}

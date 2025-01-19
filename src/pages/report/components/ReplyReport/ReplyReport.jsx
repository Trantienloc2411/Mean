import { Modal, Input, Button } from 'antd';
import { useState } from 'react';
import styles from './ReplyReport.module.scss';

const { TextArea } = Input;

export default function ReplyReport({ isOpen, onClose, report, onSubmit }) {
  const [reply, setReply] = useState('');

  const handleSubmit = () => {
    onSubmit(reply);
    setReply('');
  };

  if (!report) return null;

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
        <div className={styles.reportContent}>
          <h4>Nội dung báo cáo:</h4>
          <p>{report.content}</p>
        </div>
        
        <div className={styles.replySection}>
          <h4>Nội dung trả lời:</h4>
          <TextArea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={4}
            placeholder="Nhập nội dung trả lời..."
            className={styles.replyInput}
          />
          
          <div className={styles.actions}>
            <Button onClick={onClose}>Hủy</Button>
            <Button type="primary" onClick={handleSubmit}>
              Gửi trả lời
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
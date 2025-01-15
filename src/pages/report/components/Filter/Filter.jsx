import { Checkbox, DatePicker } from 'antd';
import styles from './Filter.module.scss';

export default function Filter({ selectedValues, onFilterChange }) {
  const statusOptions = [
    { label: 'Đã xem', value: 'Reviewed' },
    { label: 'Chưa xem', value: 'Pending' }
  ];

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <h4>Trạng thái</h4>
        <Checkbox.Group
          options={statusOptions}
          value={selectedValues.status}
          onChange={(values) => onFilterChange('status', values)}
        />
      </div>
      
      <div className={styles.filterGroup}>
        <h4>Ngày tạo</h4>
        <DatePicker
          onChange={(date) => onFilterChange('dateRange', date)}
          format="DD/MM/YYYY"
          placeholder="Chọn ngày"
        />
      </div>
    </div>
  );
}
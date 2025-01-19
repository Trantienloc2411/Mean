import { Checkbox, DatePicker } from 'antd';
import styles from './Filter.module.scss';
import dayjs from 'dayjs';

export default function Filter({ selectedValues, onFilterChange }) {
  const statusOptions = [
    { label: 'Đã xem', value: 'Reviewed' },
    { label: 'Chưa xem', value: 'Pending' }
  ];

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <h4>Trạng thái</h4>
        <div className={styles.statusCheckboxes}>
          {statusOptions.map(option => (
            <Checkbox
              key={option.value}
              checked={selectedValues.status.includes(option.value)}
              onChange={(e) => {
                const newValues = e.target.checked
                  ? [...selectedValues.status, option.value]
                  : selectedValues.status.filter(v => v !== option.value);
                onFilterChange('status', newValues);
              }}
            >
              <span className={`${styles.status} ${styles[option.value.toLowerCase()]}`}>
                {option.label}
              </span>
            </Checkbox>
          ))}
        </div>
      </div>
      
      <div className={styles.filterGroup}>
        <h4>Ngày tạo</h4>
        <DatePicker
          value={selectedValues.date}
          onChange={(date) => onFilterChange('date', date)}
          format="DD/MM/YYYY"
          placeholder="Chọn ngày"
        />
      </div>
    </div>
  );
}
import { Checkbox, DatePicker } from 'antd';
import styles from './Filter.module.scss';

const Filter = ({ filterGroups, selectedValues, onFilterChange, onDateRangeChange }) => {
  return (
    <div className={styles.filterContainer}>
      {filterGroups.map((group) => (
        <div key={group.name} className={styles.filterGroup}>
          <h4>{group.title}</h4>
          <Checkbox.Group
            className={styles.checkboxGroup}
            options={group.options}
            value={selectedValues[group.name]}
            onChange={(checkedValues) => onFilterChange(group.name, checkedValues)}
          />
        </div>
      ))}

      <div className={styles.filterGroup}>
        <h4>Khoảng thời gian</h4>
        <DatePicker.RangePicker
          className={styles.rangePicker}
          onChange={onDateRangeChange}
          format="DD/MM/YYYY"
          placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
        />
      </div>
    </div>
  );
};

export default Filter;
import { Checkbox, InputNumber, Space } from 'antd';
import styles from './Filter.module.scss';

const Filter = ({ filterGroups, selectedValues, onFilterChange }) => {
  const handlePriceRangeChange = (type, value) => {
    const newPriceRange = {
      ...selectedValues.priceRange,
      [type]: value
    };
    onFilterChange('priceRange', newPriceRange);
  };

  const renderFilterContent = (group) => {
    switch (group.type) {
      case 'range':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ minWidth: '30px', fontSize: '12px' }}>Từ:</span>
              <InputNumber
                placeholder="Giá tối thiểu"
                value={selectedValues.priceRange?.min}
                onChange={(value) => handlePriceRangeChange('min', value)}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
                min={0}
              />
              <span>đ</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ minWidth: '30px', fontSize: '12px' }}>Đến:</span>
              <InputNumber
                placeholder="Giá tối đa"
                value={selectedValues.priceRange?.max}
                onChange={(value) => handlePriceRangeChange('max', value)}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
                min={selectedValues.priceRange?.min || 0}
              />
              <span>đ</span>
            </div>
          </Space>
        );
      case 'checkbox':
      default:
        return (
          <Checkbox.Group
            className={styles.checkboxGroup}
            options={group.options}
            value={selectedValues[group.name]}
            onChange={(checkedValues) => onFilterChange(group.name, checkedValues)}
          />
        );
    }
  };

  return (
    <div className={styles.filterContainer}>
      {filterGroups.map((group) => (
        <div key={group.name} className={styles.filterGroup}>
          <h4>{group.title}</h4>
          {renderFilterContent(group)}
        </div>
      ))}
    </div>
  );
};

export default Filter;
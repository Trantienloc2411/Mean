import React from 'react';
import { Select } from 'antd';
import styles from './Filter.module.scss';

const { Option } = Select;

const Filter = ({ selectedValues, onFilterChange }) => {
  const occupancyOptions = [
    { value: 2, label: '2 người' },
    { value: 4, label: '4 người' },
    { value: 6, label: '6 người' },
    { value: 8, label: '8 người' },
    { value: 10, label: '10 người' }
  ];
  const priceRangeOptions = [
    { value: '0-100000', label: 'Dưới 100.000đ' },
    { value: '100000-200000', label: '100.000đ - 200.000đ' },
    { value: '200000-300000', label: '200.000đ - 300.000đ' },
    { value: '300000-500000', label: '300.000đ - 500.000đ' },
    { value: '500000', label: 'Trên 500.000đ' }
  ];

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterSection}>
        <h4>Số người tối đa</h4>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Chọn số người tối đa"
          value={selectedValues.maxOccupancy}
          onChange={(value) => onFilterChange('maxOccupancy', value)}
          allowClear
        >
          {occupancyOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>

      <div className={styles.filterSection}>
        <h4>Khoảng giá</h4>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Chọn khoảng giá"
          value={selectedValues.priceRange}
          onChange={(value) => onFilterChange('priceRange', value)}
          allowClear
        >
          {priceRangeOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default Filter;
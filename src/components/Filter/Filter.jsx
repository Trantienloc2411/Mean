import { useState } from "react";
import { Checkbox, Button, Divider, Typography, DatePicker, TimePicker } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styles from "./Filter.module.scss";
import dayjs from 'dayjs';

const { Text } = Typography;
const { RangePicker } = TimePicker;

export default function Filter({
  filterGroups,
  selectedValues,
  onFilterChange,
  bookingStatusCodes,
  paymentStatusCodes
}) {
  const [dateTime, setDateTime] = useState({
    date: null,
    timeRange: null
  });

  const handleResetFilters = () => {
    const emptyFilters = Object.keys(selectedValues).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});

    setDateTime({
      date: null,
      timeRange: null
    });

    onFilterChange("reset", {
      ...emptyFilters,
      dateFilter: null
    });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      "Đã xác nhận": "confirmed",
      "Chờ xác nhận": "pending",
      "Cần check-in": "needcheckin",
      "Đã check-in": "inprogress",
      "Cần check-out": "needcheckout",
      "Đã check-out": "checkedout",
      "Đã hủy": "cancelled", 
      "Hoàn tất": "complete",
      "Hoàn tiền": "refund"
    };

    return statusMap[status] || "pending";
  };

  const getPaymentClass = (payment) => {
    const paymentMap = {
      "Đã đặt": "booked",
      "Chờ thanh toán": "pending",
      "Đã thanh toán": "paid",
      "Đã hoàn tiền": "refund",
      "Thanh toán thất bại": "failed", 
    };

    return paymentMap[payment] || "pending";
  };

  const handleDateChange = (date) => {
    setDateTime(prev => ({
      ...prev,
      date
    }));
    
    if (!date && !dateTime.timeRange) {
      onFilterChange("dateFilter", null);
      return;
    }
    
    onFilterChange("dateFilter", {
      date: date,
      timeRange: dateTime.timeRange
    });
  };

  const handleTimeRangeChange = (times) => {
    setDateTime(prev => ({
      ...prev,
      timeRange: times
    }));
    
    if (!times && !dateTime.date) {
      onFilterChange("dateFilter", null);
      return;
    }
    
    onFilterChange("dateFilter", {
      date: dateTime.date,
      timeRange: times
    });
  };

  const isDateTimeFilterActive = dateTime.date || dateTime.timeRange;

  const hasActiveFilters = () => {
    const hasRegularFilters = Object.entries(selectedValues).some(([key, values]) => 
      key !== 'dateFilter' && Array.isArray(values) && values.length > 0
    );
    
    const hasDateFilter = !!selectedValues.dateFilter;
    
    return hasRegularFilters || hasDateFilter || isDateTimeFilterActive;
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <h3>Bộ lọc</h3>
        <Button type="text" onClick={handleResetFilters} className={styles.resetButton}>
          Đặt lại
        </Button>
      </div>

      <Divider className={styles.divider} />

      <div className={styles.filterGroup}>
        <h4>Ngày và Giờ</h4>
        <div className={styles.dateTimeContainer}>
          <div className={styles.datePickerWrapper}>
            <div className={styles.filterLabel}>Ngày:</div>
            <DatePicker
              placeholder="Chọn ngày"
              format="DD/MM/YYYY"
              value={dateTime.date}
              onChange={handleDateChange}
              className={styles.datePicker}
            />
          </div>
          
          <div className={styles.timePickerWrapper}>
            <div className={styles.filterLabel}>Thời gian:</div>
            <RangePicker
              format="HH:mm"
              value={dateTime.timeRange}
              onChange={handleTimeRangeChange}
              className={styles.timePicker}
              placeholder={['Giờ check-in', 'Giờ check-out']}
            />
          </div>
        </div>
      </div>

      <Divider className={styles.divider} />

      {filterGroups.map((group) => (
        <div key={group.name} className={styles.filterGroup}>
          <h4>{group.title}</h4>
          <div className={styles.optionsContainer}>
            {group.options.map((option) => {
              const isSelected = Array.isArray(selectedValues[group.name]) && 
                selectedValues[group.name].includes(option.value);
              
              return (
                <div
                  key={option.value}
                  className={`${styles.filterOption} ${isSelected ? styles.selected : ""}`}
                  onClick={() => {
                    const currentValues = Array.isArray(selectedValues[group.name]) ? 
                      [...selectedValues[group.name]] : [];
                    const newValues = isSelected
                      ? currentValues.filter((val) => val !== option.value)
                      : [...currentValues, option.value];

                    onFilterChange(group.name, newValues);
                  }}
                >
                  <Checkbox checked={isSelected} />
                  {group.name === "status" ? (
                    <span className={`${styles.statusBadge} ${styles[getStatusClass(option.value)]}`}>
                      {option.value}
                    </span>
                  ) : (
                    <span className={`${styles.statusBadge} ${styles[getPaymentClass(option.value)]}`}>
                      {option.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <Divider className={styles.divider} />

      {hasActiveFilters() && (
        <div className={styles.activeFilters}>
          <h4>Bộ lọc đang áp dụng</h4>
          <div className={styles.filterTags}>
            {Object.entries(selectedValues).map(([key, values]) =>
              key !== "dateFilter" && Array.isArray(values) && values.length > 0 && values.map((value) => (
                <div key={`${key}-${value}`} className={styles.filterTag}>
                  {key === "status" ? (
                    <span className={`${styles.statusBadge} ${styles[getStatusClass(value)]}`}>
                      {value}
                    </span>
                  ) : (
                    <span className={`${styles.statusBadge} ${styles[getPaymentClass(value)]}`}>
                      {value}
                    </span>
                  )}
                  <CloseOutlined
                    className={styles.removeTag}
                    onClick={() => {
                      const newValues = selectedValues[key].filter((v) => v !== value);
                      onFilterChange(key, newValues);
                    }}
                  />
                </div>
              ))
            )}
            
            {isDateTimeFilterActive && (
              <div className={styles.filterTag}>
                <span className={styles.dateTimeTag}>
                  {dateTime.date ? dateTime.date.format('DD/MM/YYYY') : 'Mọi ngày'}{' '}
                  {dateTime.timeRange ? 
                    `(${dateTime.timeRange[0].format('HH:mm')} - ${dateTime.timeRange[1].format('HH:mm')})` : 
                    '(Mọi giờ)'}
                </span>
                <CloseOutlined
                  className={styles.removeTag}
                  onClick={() => {
                    setDateTime({
                      date: null,
                      timeRange: null
                    });
                    onFilterChange("dateFilter", null);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
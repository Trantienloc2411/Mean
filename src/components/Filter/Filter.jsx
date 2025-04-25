import { useState } from "react";
import { Checkbox, Button, Divider, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styles from "./Filter.module.scss";

const { Text } = Typography;

export default function Filter({
  filterGroups,
  selectedValues,
  onFilterChange,
  bookingStatusCodes,
  paymentStatusCodes
}) {
  const handleResetFilters = () => {
    const emptyFilters = Object.keys(selectedValues).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});

    onFilterChange("reset", emptyFilters);
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

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <h3>Bộ lọc</h3>
        <Button type="text" onClick={handleResetFilters} className={styles.resetButton}>
          Đặt lại
        </Button>
      </div>

      <Divider className={styles.divider} />

      {filterGroups.map((group) => (
        <div key={group.name} className={styles.filterGroup}>
          <h4>{group.title}</h4>
          <div className={styles.optionsContainer}>
            {group.options.map((option) => {
              const isSelected = selectedValues[group.name]?.includes(option.value);
              
              return (
                <div
                  key={option.value}
                  className={`${styles.filterOption} ${isSelected ? styles.selected : ""}`}
                  onClick={() => {
                    const currentValues = [...(selectedValues[group.name] || [])];
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

      {Object.values(selectedValues).some(values => values.length > 0) && (
        <div className={styles.activeFilters}>
          <h4>Bộ lọc đang áp dụng</h4>
          <div className={styles.filterTags}>
            {Object.entries(selectedValues).map(([key, values]) =>
              values.map((value) => (
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
          </div>
        </div>
      )}
    </div>
  );
}
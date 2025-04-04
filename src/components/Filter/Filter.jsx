import React, { useState } from 'react';
import { Checkbox, DatePicker, Select, Input } from 'antd';
import styles from './Filter.module.scss';

const { RangePicker } = DatePicker;

export default function Filter({ 
    filterGroups, 
    selectedValues, 
    onFilterChange,
    bookingStatusCodes,
    paymentStatusCodes,
    bookings
  }) {
    const [additionalFilters, setAdditionalFilters] = useState({
      dateFilter: null,
      timeFilter: null,
      priceRange: { min: null, max: null }
    });

  const generateStatusOptions = (statusCodes, statusMapper) => {
    return Object.entries(statusCodes).map(([key, value]) => ({
      label: statusMapper(value),
      value: statusMapper(value)
    }));
  };

  const bookingStatusMapper = (status) => {
    const statusLabels = {
      [bookingStatusCodes.CONFIRMED]: "Confirmed",
      [bookingStatusCodes.PENDING]: "Pending",
      [bookingStatusCodes.NEEDCHECKIN]: "Need Check-in",
      [bookingStatusCodes.CHECKEDIN]: "Checked In",
      [bookingStatusCodes.NEEDCHECKOUT]: "Need Check-out", 
      [bookingStatusCodes.CHECKEDOUT]: "Checked Out",
      [bookingStatusCodes.CANCELLED]: "Cancelled",
      [bookingStatusCodes.COMPLETED]: "Completed"
    };
    return statusLabels[status] || "Unknown Status";
  };

  const paymentStatusMapper = (status) => {
    const statusLabels = {
      [paymentStatusCodes.BOOKING]: "Booking",
      [paymentStatusCodes.PENDING]: "Pending",
      [paymentStatusCodes.PAID]: "Fully Paid",
      [paymentStatusCodes.REFUND]: "Refunded",
      [paymentStatusCodes.FAILED]: "Failed"
    };
    return statusLabels[status] || "Unknown Payment";
  };
  const additionalFilterGroups = [
    {
      name: "bookingStatus",
      title: "Booking Status",
      type: "checkbox",
      options: generateStatusOptions(bookingStatusCodes, bookingStatusMapper)
    },
    {
      name: "paymentStatus",
      title: "Payment Status", 
      type: "checkbox",
      options: generateStatusOptions(paymentStatusCodes, paymentStatusMapper)
    }
  ];

  const handleAdditionalFilterChange = (filterName, value) => {
    const updatedFilters = {
      ...additionalFilters,
      [filterName]: value
    };
    
    setAdditionalFilters(updatedFilters);
    
    onFilterChange('additionalFilters', updatedFilters);
  };

  const renderFilterInput = (group) => {
    switch(group.type) {
      case "checkbox":
        return (
          <Checkbox.Group
            className={styles.checkboxGroup}
            options={group.options}
            value={selectedValues[group.name]}
            onChange={(checkedValues) => onFilterChange(group.name, checkedValues)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={styles.advancedFilterContainer}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
        minWidth: '350px'
      }}
    >
      <div 
        className={styles.dynamicFilterGroups}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}
      >
        {[...filterGroups, ...additionalFilterGroups].map((group) => (
          <div 
            key={group.name} 
            className={styles.filterGroup}
          >
            <h4>{group.title}</h4>
            {renderFilterInput(group)}
          </div>
        ))}
      </div>

      <div 
        className={styles.advancedOptions}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div>
          <h4>Booking Date Range</h4>
          <RangePicker 
            style={{ width: '100%' }}
            onChange={(dates) => handleAdditionalFilterChange('dateRange', dates)}
          />
        </div>
        <div>
          <h4>Time Slot</h4>
          <RangePicker 
            picker="time"
            style={{ width: '100%' }}
            onChange={(times) => handleAdditionalFilterChange('timeRange', times)}
          />
        </div>
      </div>
    </div>
  );
}
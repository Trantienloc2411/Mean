import { useState } from "react"
import { Checkbox, DatePicker, TimePicker, Button, Divider, Typography } from "antd"
import { CalendarOutlined, ClockCircleOutlined, CloseOutlined } from "@ant-design/icons"
import styles from "./Filter.module.scss"

const { RangePicker: TimeRangePicker } = TimePicker
const { Text } = Typography

export default function Filter({
  filterGroups,
  selectedValues,
  onFilterChange,
  bookingStatusCodes,
  paymentStatusCodes,
}) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [timeRange, setTimeRange] = useState(null)

  const handleResetFilters = () => {
    const emptyFilters = Object.keys(selectedValues).reduce((acc, key) => {
      acc[key] = []
      return acc
    }, {})

    setSelectedDate(null)
    setTimeRange(null)
    onFilterChange("reset", emptyFilters)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    onFilterChange("date", date)
  }

  const handleTimeRangeChange = (times) => {
    setTimeRange(times)
    onFilterChange("timeRange", times)
  }

  const getStatusClass = (status) => {
    const statusMap = {
      Confirmed: "confirmed",
      Pending: "pending",
      "Need Check-in": "needcheckin",
      "Checked In": "checkedin",
      "Need Check-out": "needcheckout",
      "Checked Out": "checkedout",
      Cancelled: "cancelled",
      Completed: "completed",
    }
    return statusMap[status] || "pending"
  }

  const getPaymentClass = (payment) => {
    const paymentMap = {
      Booking: "booking",
      Pending: "pending",
      Paid: "paid",
      Refund: "refund",
      Failed: "failed",
    }
    return paymentMap[payment] || "pending"
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <h3>Bộ lọc</h3>
        <Button type="text" onClick={handleResetFilters} className={styles.resetButton}>
          Đặt lại
        </Button>
      </div>

      <Divider className={styles.divider} />

      {/* <div className={styles.dateSection}>
        <h4>Ngày đặt phòng</h4>
        <DatePicker
          className={styles.datePicker}
          value={selectedDate}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          placeholder="Chọn ngày"
          suffixIcon={<CalendarOutlined />}
        />
      </div> */}

      {/* <div className={styles.timeSection}>
        <h4>Khung giờ</h4>
        <TimeRangePicker
          className={styles.timePicker}
          value={timeRange}
          onChange={handleTimeRangeChange}
          format="HH:mm"
          placeholder={["Từ giờ", "Đến giờ"]}
          suffixIcon={<ClockCircleOutlined />}
        />
        <Text type="secondary" className={styles.timeHint}>
          Lọc theo khung giờ check-in/check-out
        </Text>
      </div> */}


      <Divider className={styles.divider} />

      {filterGroups.map((group) => (
        <div key={group.name} className={styles.filterGroup}>
          <h4>{group.title}</h4>
          <div className={styles.optionsContainer}>
            {group.options.map((option) => {
              const isSelected = selectedValues[group.name]?.includes(option.value)
              const statusClass = group.name === "status" ? getStatusClass(option.value) : getPaymentClass(option.value)

              return (
                <div
                  key={option.value}
                  className={`${styles.filterOption} ${isSelected ? styles.selected : ""}`}
                  onClick={() => {
                    const currentValues = [...(selectedValues[group.name] || [])]
                    const newValues = isSelected
                      ? currentValues.filter((val) => val !== option.value)
                      : [...currentValues, option.value]

                    onFilterChange(group.name, newValues)
                  }}
                >
                  <Checkbox checked={isSelected} />
                  <span className={`${styles.statusBadge} ${styles[statusClass]}`}>{option.value}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <Divider className={styles.divider} />

      <div className={styles.activeFilters}>
        <h4>Bộ lọc đang áp dụng</h4>
        <div className={styles.filterTags}>
          {Object.entries(selectedValues).map(([key, values]) =>
            values.map((value) => (
              <div key={`${key}-${value}`} className={styles.filterTag}>
                {value}
                <CloseOutlined
                  className={styles.removeTag}
                  onClick={() => {
                    const newValues = selectedValues[key].filter((v) => v !== value)
                    onFilterChange(key, newValues)
                  }}
                />
              </div>
            )),
          )}
          {selectedDate && (
            <div className={styles.filterTag}>
              {`Ngày: ${selectedDate.format("DD/MM/YYYY")}`}
              <CloseOutlined className={styles.removeTag} onClick={() => handleDateChange(null)} />
            </div>
          )}
          {timeRange && timeRange[0] && timeRange[1] && (
            <div className={styles.filterTag}>
              {`Giờ: ${timeRange[0].format("HH:mm")} - ${timeRange[1].format("HH:mm")}`}
              <CloseOutlined className={styles.removeTag} onClick={() => handleTimeRangeChange(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

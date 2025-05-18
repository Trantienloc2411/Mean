import React from "react";
import { Select, DatePicker, Space, Typography, Button } from "antd";
import { CalendarOutlined, ReloadOutlined } from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/vi_VN";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

const RevenueFilter = ({ filterType, setFilterType, dateRange, setDateRange }) => {
  const handleReset = () => {
    setDateRange([]);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
      <div>
        <Text strong style={{ marginRight: 12 }}>Lọc theo:</Text>
        <Space direction="horizontal" size="middle" wrap>
          <Select
            value={filterType}
            onChange={setFilterType}
            style={{ width: 160 }}
          >
            <Option value="month">Theo tháng</Option>
            <Option value="week">Theo tuần</Option>
            <Option value="day">Theo ngày</Option>
          </Select>

          <RangePicker
            picker={filterType}
            onChange={setDateRange}
            value={dateRange}
            style={{ width: 300 }}
            suffixIcon={<CalendarOutlined />}
            locale={locale}
            placeholder={['Từ ngày', 'Đến ngày']}
          />
        </Space>
      </div>
      
      <Button 
        icon={<ReloadOutlined />} 
        onClick={handleReset}
        disabled={!dateRange || dateRange.length === 0}
      >
        Đặt lại bộ lọc
      </Button>
    </div>
  );
};

export default RevenueFilter;
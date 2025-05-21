import React from "react";
import { DatePicker, Typography, Button } from "antd";
import { CalendarOutlined, ReloadOutlined } from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/vi_VN";

const { Text } = Typography;

const RevenueFilter = ({ date, setDate }) => {
  const handleReset = () => {
    setDate(null);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div>
        <Text strong style={{ marginRight: 12 }}>
          Chọn tháng:
        </Text>
        <DatePicker
          picker="month"
          onChange={setDate}
          value={date}
          style={{ width: 180 }}
          suffixIcon={<CalendarOutlined />}
          locale={locale}
          placeholder="Chọn tháng"
        />
      </div>

      <Button icon={<ReloadOutlined />} onClick={handleReset} disabled={!date}>
        Đặt lại bộ lọc
      </Button>
    </div>
  );
};

export default RevenueFilter;

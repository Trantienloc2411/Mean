import React, { useState } from "react";
import { Input, Select } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function SearchAndFilter({ onSearch, onFilterChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value); // Pass the value directly without trimming spaces
  };

  const handleInputBlur = () => {
    // Trim leading and trailing whitespace on blur
    const trimmedValue = inputValue.trim();
    setInputValue(trimmedValue);
    onSearch(trimmedValue);
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Input 
        prefix={<SearchOutlined />}
        placeholder="Tìm kiếm theo tên phòng"
        style={{ width: 300 }}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
      />

      <Select 
        prefix={<FilterOutlined />}
        defaultValue="all"
        onChange={onFilterChange}
        style={{ width: 200 }}
      >
        <Option value="all">Tất cả trạng thái</Option>
        <Option value="1">Sẵn sàng</Option>
        <Option value="2">Đã đặt</Option>
        <Option value="3">Đang dọn dẹp</Option>
        <Option value="4">Đang chuẩn bị</Option>
        <Option value="5">Bảo trì</Option>
        <Option value="6">Đóng</Option>
      </Select>
    </div>
  );
}
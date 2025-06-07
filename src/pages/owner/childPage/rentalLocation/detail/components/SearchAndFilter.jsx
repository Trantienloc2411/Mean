import React, { useState } from "react";
import { Input, Select } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function SearchAndFilter({ onSearch, onFilterChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
  };

  const handleInputBlur = () => {
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
        <Option value="1">Có sẵn</Option>
        <Option value="5">Bảo trì</Option>
      </Select>
    </div>
  );
}
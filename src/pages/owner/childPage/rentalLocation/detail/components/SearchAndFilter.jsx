import React from "react";
import { Input, Select } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function SearchAndFilter({ onSearch, onFilterChange }) {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Input 
        prefix={<SearchOutlined />}
        placeholder="Tìm kiếm theo tên phòng"
        style={{ width: 300 }}
        onChange={(e) => onSearch(e.target.value)}
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
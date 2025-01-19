import React, { useState, useEffect } from "react";
import { Button, Input, Spin } from "antd";
import { Flex } from "antd"; // Nếu không tồn tại, cần dùng styled-components hoặc CSS cho layout
import OverviewLocation from "./components/OverviewLocation";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import RentalLocationTable from "./components/RentalLocationTable";

export default function RentalLocation() {
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchRentalLocations();
  }, []);

  const fetchRentalLocations = async () => {
    setIsLoading(true);
    try {
      // Giả sử API fetch danh sách địa điểm cho thuê
      const response = await fetch("/api/rental-locations");
      const data = await response.json();
      setAllUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching rental locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    const filtered = allUsers.filter((user) =>
      user.phone.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const openFilterModal = () => {
    // Hàm mở modal bộ lọc
    console.log("Open filter modal");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý địa điểm</h1>
      <OverviewLocation />
      <div style={{ marginTop: 20 }}>
        <h1 style={{ fontSize: 20 }}>Danh sách địa điểm</h1>
        <div style={{ background: "#fff", borderRadius: 20, padding: 20 }}>
          <Flex style={{ gap: "30px", alignItems: "center" }}>
            <div>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm bằng số điện thoại"
                style={{ width: 300, marginBottom: 10 }}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button onClick={openFilterModal}>
              <FilterOutlined />
              Bộ lọc
            </Button>
          </Flex>
          {isLoading ? (
            <Spin style={{ marginTop: 20 }} />
          ) : (
            <RentalLocationTable data={filteredUsers} />
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button, Input } from "antd";
import OverviewAccount from "./components/OverviewAccount";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import AccountTable from "./components/AccountTable";
import { useGetUsersQuery } from "../../features/user/userApiSlice";
import FilterModal from "./components/FilterModal";
import { Flex } from "antd";
import { RoleEnum, StatusEnum, ApproveEnum } from "../../enums/accountEnums";

export default function Account() {
  const { data: users, error, isLoading } = useGetUsersQuery();
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    roles: [],
    statuses: [],
    approves: [],
  });

  const handleSearch = () => {
    if (users) {
      const result = users.filter((user) => {
        const matchesSearch = user.phoneNumber.includes(searchValue);
        const matchesRole =
          selectedFilters.roles.length === 0 ||
          selectedFilters.roles.includes(user.role);
        const matchesStatus =
          selectedFilters.statuses.length === 0 ||
          selectedFilters.statuses.includes(user.status);
        const matchesApprove =
          selectedFilters.approves.length === 0 ||
          selectedFilters.approves.includes(user.approve);

        return matchesSearch && matchesRole && matchesStatus && matchesApprove;
      });
      setFilteredUsers(result);
    }
  };

  useEffect(() => {
    // Lọc ngay khi có sự thay đổi về users hoặc selectedFilters
    handleSearch();
  }, [selectedFilters, users]);

  const handleFilterChange = (key, values) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [key]: values,
    }));
  };

  const resetFilters = () => {
    setSelectedFilters({
      roles: [],
      statuses: [],
      approves: [],
    });
  };

  const openFilterModal = () => setIsFilterModalVisible(true);
  const closeFilterModal = () => setIsFilterModalVisible(false);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "10px 20px" }}>
      <h1 style={{ fontSize: 32 }}>Quản lý tài khoản</h1>
      <div>
        <OverviewAccount />
      </div>
      <div style={{ marginTop: 20 }}>
        <h1 style={{ fontSize: 20 }}>Danh sách tài khoản</h1>
        <div style={{ background: "#fff", borderRadius: 20, padding: 20 }}>
          <Flex justify="space-between">
            <div>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm bằng số điện thoại"
                style={{ width: 300, marginBottom: 10 }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onPressEnter={handleSearch} // Thực hiện tìm kiếm khi nhấn Enter
              />
              <Button style={{marginLeft:10}} onClick={handleSearch}>Tìm kiếm</Button>
            </div>
            <Button onClick={openFilterModal}>
              <FilterOutlined />
              Bộ lọc
            </Button>
          </Flex>
          <AccountTable loading={isLoading} data={filteredUsers} />
        </div>
      </div>
      <FilterModal
        visible={isFilterModalVisible}
        onClose={closeFilterModal}
        filters={selectedFilters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />
    </div>
  );
}

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
  const [tempFilters, setTempFilters] = useState({
    // State để lưu trữ tạm thời các lựa chọn filter
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
    handleSearch();
  }, [selectedFilters, users]); // Chỉ lọc khi selectedFilters thay đổi

  const handleFilterChange = (key, values) => {
    setTempFilters((prevFilters) => ({
      ...prevFilters,
      [key]: values, // Chỉ thay đổi filter tạm thời mà không ảnh hưởng đến dữ liệu
    }));
  };

  const resetFilters = () => {
    setTempFilters({
      roles: [],
      statuses: [],
      approves: [],
    });
  };

  const openFilterModal = () => setIsFilterModalVisible(true);
  const closeFilterModal = () => setIsFilterModalVisible(false);

  const applyFilters = () => {
    setSelectedFilters(tempFilters); // Cập nhật filter chính thức sau khi nhấn "Áp dụng"
    handleSearch(); // Lọc dữ liệu khi áp dụng bộ lọc
    closeFilterModal(); // Đóng modal sau khi áp dụng bộ lọc
  };

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
                onPressEnter={handleSearch}
              />
              <Button style={{ marginLeft: 10 }} onClick={handleSearch}>
                Tìm kiếm
              </Button>
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
        filters={tempFilters} // Truyền filter tạm thời vào modal
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        onApplyFilters={applyFilters} // Truyền hàm applyFilters vào modal
      />
    </div>
  );
}

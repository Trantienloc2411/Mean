import { useState, useEffect } from "react";
import { Input, message } from "antd";
import OverviewAccount from "./components/OverviewAccount";
import { SearchOutlined } from "@ant-design/icons";
import AccountTable from "./components/AccountTable";
import FilterAccount from "./components/FilterAccount";
import {
  useGetRolesQuery,
  useGetUsersQuery,
} from "../../redux/services/userApi";

export default function Account() {
  const { data: users, error, isLoading } = useGetUsersQuery();
  const { data: roles } = useGetRolesQuery();
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    roles: [],
  });

  // Hàm lấy tên role từ roleID
  const getRoleName = (roleID) => {
    const role = roles?.find((r) => r._id === roleID);
    return role ? role.roleName : "Unknown";
  };

  useEffect(() => {
    if (users) {
      const filtered = users
        .map((user) => ({
          ...user,
          roleName: getRoleName(user.roleID),
        }))
        .filter((user) => {
          const matchesSearch =
            user.phone?.toLowerCase().includes(searchValue.toLowerCase()) ??
            false;
          const matchesRole =
            selectedFilters.roles.length === 0 ||
            selectedFilters.roles.includes(user.roleID);

          return matchesSearch && matchesRole;
        });
      setFilteredUsers(filtered);
    }
  }, [users, searchValue, selectedFilters, roles]);

  const handleFilterChange = (key, values) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: values }));
  };

  const resetFilters = () => {
    setSelectedFilters({
      roles: [],
    });
  };

  if (error) {
    message.error("Đã xảy ra lỗi khi tải dữ liệu");
    return <p>Error: {error.message}</p>;
  }

  return (
    <div style={{ padding: "10px 20px" }}>
      <h1 style={{ fontSize: 32 }}>Quản lý tài khoản</h1>
      <OverviewAccount />
      <div style={{ marginTop: 20 }}>
        <h1 style={{ fontSize: 20 }}>Danh sách tài khoản</h1>
        <div style={{ background: "#fff", borderRadius: 20, padding: 20 }}>
          <div style={{ display: "flex", gap: 20 }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm bằng số điện thoại"
              style={{ width: 300 }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {/* <FilterAccount
              filters={selectedFilters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
              onApplyFilters={(filters) => setSelectedFilters(filters)}
            /> */}
          </div>
          <AccountTable loading={isLoading} data={filteredUsers} />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { Button, Input, message } from "antd";
import OverviewAccount from "./components/OverviewAccount";
import { SearchOutlined } from "@ant-design/icons";
import AccountTable from "./components/AccountTable";
import FilterAccount from "./components/FilterAccount";
import {
  useGetRolesQuery,
  useGetUsersQuery,
} from "../../redux/services/userApi";
import CreateAccountForm from "./components/CreateAccountForm";
import { useLazyRefreshTokenQuery } from "../../redux/services/authApi";
import { IoCreate } from "react-icons/io5";

export default function Account() {
  const { data: users, error, isLoading } = useGetUsersQuery();
  const { data: roles } = useGetRolesQuery();
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [refreshToken, { isFetching }] = useLazyRefreshTokenQuery();

  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    roles: [],
    isActive: null,
    isVerified: null,
  });

  // Tạo một object lookup roleID -> roleName
  const roleMap = useMemo(() => {
    return (
      roles?.reduce((acc, role) => {
        acc[role._id] = role.roleName;
        return acc;
      }, {}) || {}
    );
  }, [roles]);

  useEffect(() => {
    if (users) {
      const filtered = users
        .map((user) => ({
          ...user,
          roleName: roleMap[user.roleID] || "Unknown",
          isVerified: user.isVerifiedEmail || user.isVerifiedPhone,
        }))
        .filter((user) => {
          const matchesSearch =
            user.phone?.toLowerCase().includes(searchValue.toLowerCase()) ??
            false;
          const matchesRole =
            selectedFilters.roles.length === 0 ||
            selectedFilters.roles.includes(user.roleName);
          const matchesActive =
            selectedFilters.isActive === null ||
            user.isActive === selectedFilters.isActive;
          const matchesVerified =
            selectedFilters.isVerified === null ||
            user.isVerified === selectedFilters.isVerified;

          return (
            matchesSearch && matchesRole && matchesActive && matchesVerified
          );
        });
      setFilteredUsers(filtered);
    }
  }, [users, searchValue, selectedFilters, roleMap]);

  // const handleRefreshToken = async () => {
  //   try {
  //     const result = await refreshToken().unwrap();
  //     console.log(result);
  //     message.success("Refresh Thành Công!");
  //   } catch {
  //     message.error("Lỗi Refresh Token!");
  //   }
  // };

  const handleFilterChange = (key, values) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: values }));
  };

  const resetFilters = () => {
    setSelectedFilters({
      roles: [],
      isActive: null,
      isVerified: null,
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
        {/* <Button
          type="primary"
          onClick={handleRefreshToken}
          loading={isFetching}
        >
          Refresh Token
        </Button> */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 20, flexGrow: 1 }}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm bằng số điện thoại"
                style={{ width: 300 }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <FilterAccount
                users={users}
                roles={roles?.map((role) => role.roleName) || []} // Truyền roleName vào filter
                filters={selectedFilters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
                onApplyFilters={(filters) => setSelectedFilters(filters)}
              />
            </div>
            <Button
              icon={<IoCreate />}
              type="primary"
              onClick={() => setOpenCreateUser(true)}
            >
              Tạo tài khoản
            </Button>
          </div>

          <AccountTable loading={isLoading} data={filteredUsers} />
        </div>
      </div>
      <CreateAccountForm
        open={openCreateUser}
        onClose={() => setOpenCreateUser(false)}
        roles={roles || []}
      />
    </div>
  );
}

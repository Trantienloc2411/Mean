import { useState, useEffect } from "react";
import { Input } from "antd";
import OverviewAccount from "./components/OverviewAccount";
import { SearchOutlined } from "@ant-design/icons";
import AccountTable from "./components/AccountTable";
import { useGetUsersQuery } from "../../features/user/userApiSlice";

export default function Account() {
  const { data: users, error, isLoading } = useGetUsersQuery();
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (users) {
      const result = users.filter((user) =>
        user.phoneNumber.includes(searchValue)
      );
      setFilteredUsers(result);
    }
  }, [searchValue, users]);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "10px 20px" }}>
      <h1 style={{ fontSize: 32 }}>Quản lý tài khoản</h1>
      <div>
        <OverviewAccount />
      </div>
      <div style={{ marginTop: 20 }}>
        <h1 style={{ fontSize: 20 }}>Danh sách tài khoản</h1>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm bằng số điện thoại"
          style={{ width: 400, marginBottom: 20 }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)} // Cập nhật giá trị search
        />
        <AccountTable loading={isLoading} data={filteredUsers} />
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { Button, Input, message, Card } from "antd";
import OverviewAccount from "./components/OverviewAccount";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import AccountTable from "./components/AccountTable";
import FilterAccount from "./components/FilterAccount";
import styles from "./Account.module.scss";
import {
  useGetRolesQuery,
  useGetUsersQuery,
} from "../../redux/services/userApi";
import CreateAccountForm from "./components/CreateAccountForm";
// import { useLazyRefreshTokenQuery } from "../../redux/services/authApi";
import { IoCreate } from "react-icons/io5";
import { Spin } from "antd";

export default function Account() {
  const { data: users, refetch, error, isLoading } = useGetUsersQuery();
  const { data: roles } = useGetRolesQuery();
  const [openCreateUser, setOpenCreateUser] = useState(false);
  // const [refreshToken, { isFetching }] = useLazyRefreshTokenQuery();

  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    roles: [],
    isActive: null,
    isVerified: null,
    isOwnerApproved: null,
  });
  const [isReloading, setIsReloading] = useState(false);

  // Tạo một object lookup roleID -> roleName
  const roleMap = useMemo(() => {
    return (
      roles?.reduce((acc, role) => {
        acc[role._id] = role.roleName;
        return acc;
      }, {}) || {}
    );
  }, [roles]);

  const countUser = (users) => {
    if (!users)
      return {
        totalUser: 0,
        countCustomer: 0,
        countAdmin: 0,
        countOwner: 0,
      };

    let totalUser = users.length;
    let countCustomer = 0;
    let countAdmin = 0;
    let countOwner = 0;
    console.log(roles);

    users.forEach((user) => {
      if (
        user.roleID === roles?.find((role) => role.roleName === "Customer")?._id
      ) {
        countCustomer++;
      } else if (
        user.roleID === roles?.find((role) => role.roleName === "Admin")?._id
      ) {
        countAdmin++;
      } else if (
        user.roleID === roles?.find((role) => role.roleName === "Owner")?._id
      ) {
        countOwner++;
      }
    });

    return { totalUser, countCustomer, countAdmin, countOwner };
  };

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
          const matchesOwnerApproved =
            selectedFilters.isOwnerApproved === null ||
            user?.owner?.approvalStatus === selectedFilters.isOwnerApproved;

          return (
            matchesSearch &&
            matchesRole &&
            matchesActive &&
            matchesVerified &&
            matchesOwnerApproved
          );
        });
      setFilteredUsers(filtered);
    }
  }, [users, searchValue, selectedFilters, roleMap]);

  const handleFilterChange = (key, values) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: values }));
  };

  const resetFilters = () => {
    setSelectedFilters({
      roles: [],
      isActive: null,
      isVerified: null,
      isOwnerApproved: null,
    });
  };

  if (error) {
    message.error("Đã xảy ra lỗi khi tải dữ liệu");
    return <p>Error: {error.message}</p>;
  }

  const handleReload = async () => {
    try {
      setIsReloading(true);
      await refetch();
      message.success("Dữ liệu đã được làm mới");
    } catch (error) {
      // console.error("Error refreshing data:", error);
      message.error("Làm mới dữ liệu thất bại", error);
    } finally {
      setIsReloading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      <h2 className={styles.sectionTitle}>Quản lý tài khoản</h2>

      {/* Overview Section */}
      <div className={styles.overviewSection}>
        <OverviewAccount
          totalUser={countUser(users).totalUser}
          countCustomer={countUser(users).countCustomer}
          countAdmin={countUser(users).countAdmin}
          countOwner={countUser(users).countOwner}
        />
      </div>

      {/* Account List Section */}
      <div className={styles.accountSection}>
        <h2 className={styles.sectionTitle}>Danh sách tài khoản</h2>
        <Card className={styles.accountCard} bordered={false}>
          <div className={styles.toolbarContainer}>
            <div className={styles.searchFilterGroup}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm bằng số điện thoại"
                className={styles.searchInput}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <FilterAccount
                users={users}
                roles={roles?.map((role) => role.roleName) || []}
                filters={selectedFilters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
                onApplyFilters={(filters) => setSelectedFilters(filters)}
              />
              <Button
                icon={<ReloadOutlined spin={isReloading} />}
                onClick={handleReload}
                loading={isReloading}
              >
                Làm mới
              </Button>
            </div>
            {/* <Button
              icon={<IoCreate />}
              type="default"
              className={styles.createButton}
              onClick={() => setOpenCreateUser(true)}
              style={{
                backgroundColor: "#fff",
                borderColor: "#667085",
                color: "#667085",
              }}
            >
              Tạo tài khoản
            </Button> */}
          </div>

          <div className={styles.tableContainer}>
            <AccountTable
              loading={isLoading || isReloading}
              data={filteredUsers}
              refetch={refetch}
            />
          </div>
        </Card>
      </div>

      <CreateAccountForm
        open={openCreateUser}
        onClose={() => setOpenCreateUser(false)}
        roles={roles || []}
      />
    </div>
  );
}

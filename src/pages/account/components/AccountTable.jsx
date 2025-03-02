import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Table, message } from "antd";
import styles from "../components/AccountTable.module.scss";
import UserDetailModal from "./UserDetailModal";
import {
  useActiveUserMutation,
  useBlockUserMutation,
} from "../../../redux/services/userApi";
import { FaEye } from "react-icons/fa";

export default function AccountTable({ data, loading }) {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeUser] = useActiveUserMutation();
  const [blockUser] = useBlockUserMutation();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: data.length,
  });

  const columns = [
    {
      title: "No.",
      key: "no",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Loại",
      dataIndex: "roleName",
      align: "center",
      key: "roleName",
      render: (role) => (
        <span className={`${styles.role} ${styles[role.toLowerCase()]}`}>
          {role === "Staff"
            ? "Nhân viên"
            : role === "Owner"
            ? "Chủ hộ"
            : "Khách hàng"}
        </span>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      align: "center",
      key: "isActive",
      render: (isActive) => (
        <span className={`${styles.isActive} ${styles[isActive]}`}>
          {isActive ? "Hoạt động" : "Ngừng hoạt động"}
        </span>
      ),
    },
    {
      title: "Xác thực",
      dataIndex: "isVerified",
      align: "center",

      key: "isVerified",
      render: (_, record) => (
        <div className={styles.verifyContainer}>
          <span
            className={`${styles.isVerifiedEmail} ${
              styles[record.isVerifiedEmail]
            }`}
          >
            Email
          </span>
          <span
            className={`${styles.isVerifiedPhone} ${
              styles[record.isVerifiedPhone]
            }`}
          >
            Phone
          </span>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      align: "center",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (createdAt) => new Date(createdAt).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      align: "center",
      key: "updatedAt",
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: (updatedAt) =>
        updatedAt ? new Date(updatedAt).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      key: "view",
      align: "center",
      render: (_, record) => (
        <span
          className={styles.iconViewDetail}
          onClick={(e) => {
            handleViewModel(record);
          }}
        >
          <FaEye />
        </span>
      ),
    },
    {
      // title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu onClick={(e) => e.domEvent.stopPropagation()}>
              {["Customer", "Owner"].includes(record.roleName) && (
                <Menu.Item key="1" onClick={() => handleViewModel(record)}>
                  Xem Chi Tiết
                </Menu.Item>
              )}

              {/* <Menu.Item key="1" onClick={() => handleViewDetails(record)}>
                Xem Chi Tiết
              </Menu.Item> */}
              {record.isActive ? (
                <Menu.Item key="2" onClick={() => handleBlockUser(record)}>
                  Khóa tài khoản
                </Menu.Item>
              ) : (
                <Menu.Item key="3" onClick={() => handleActiveUser(record)}>
                  Cho phép hoạt động
                </Menu.Item>
              )}
            </Menu>
          }
          trigger={["click"]}
          className="action-menu" // Thêm class này để kiểm tra trong onRow
        >
          <MoreOutlined />
        </Dropdown>
      ),
    },
  ];

  const handleViewDetails = (user) => {
    navigate(
      user.roleName === "Customer"
        ? `/customer/${user._id}`
        : `/owner/${user._id}/dashboard`
    );
  };

  const handleActiveUser = async (user) => {
    try {
      await activeUser(user._id).unwrap();
      message.success("Cho phép hoạt động thành công!");
    } catch {
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  const handleBlockUser = async (user) => {
    try {
      await blockUser(user._id).unwrap();
      message.success("Khóa tài khoản thành công!");
    } catch {
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };
  const handleViewModel = (user) => {
    setSelectedUser(user); // Lưu user được chọn
    setIsDetailOpen(true); // Mở modal
  };

  return (
    <div style={{ marginTop: 10 }}>
      <Table
        scroll={{ x: "max-content" }}
        dataSource={data}
        loading={loading}
        columns={columns}
        rowKey="_id"
        pagination={{
          ...pagination,
          showSizeChanger: false,
          onChange: (page) =>
            setPagination((prev) => ({ ...prev, current: page })),
        }}
        className={styles.accountTable}
      />

      <UserDetailModal
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}

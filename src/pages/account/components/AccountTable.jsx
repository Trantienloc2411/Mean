import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MoreOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import styles from "../components/AccountTable.module.scss";
import { Dropdown, Menu, Table, Tag, message } from "antd";
import UserDetailModal from "./UserDetailModal"; // Component modal chi tiết
import {
  useActiveUserMutation,
  useBlockUserMutation,
  // useDeleteUserMutation,
} from "../../../redux/services/userApi";

export default function AccountTable({ data, loading }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeUser] = useActiveUserMutation();
  const [blockUser] = useBlockUserMutation();
  // const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();

  const roleColors = {
    Staff: "blue",
    Owner: "gold",
    Customer: "green",
    Unknown: "gray",
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => {
        const { current, pageSize } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    { title: "Tên", dataIndex: "fullName", key: "fullName" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Loại",
      dataIndex: "roleName",
      key: "roleName",
      render: (role) => {
        return (
          <span className={`${styles.role} ${styles[role.toLowerCase()]}`}>
            {role === "Staff"
              ? "Nhân viên"
              : role === "Owner"
              ? "Chủ hộ"
              : "Khách hàng"}
          </span>
        );
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      align: "center",
      key: "isActive",
      render: (isActive) => {
        console.log(isActive);
        return (
          <span className={`${styles.isActive} ${styles[isActive]}`}>
            {isActive ? "Hoạt động" : "Ngừng hoạt động"}
          </span>
        );
      },
    },
    {
      title: "Xác thực",
      dataIndex: "isVerified",
      align: "center",
      key: "approve",
      render: (_, record) => {
        return (
          <div className={styles.verifyContainer}>
            <span
              className={`${styles.isVerifiedEmail} ${
                styles[record.isVerifiedEmail]
              }`}
            >
              {"Email"}
            </span>
            <span
              className={`${styles.isVerifiedPhone} ${
                styles[record.isVerifiedPhone]
              }`}
            >
              {"Phone"}
            </span>
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={() => handleViewModel(record)}>
                Xem
              </Menu.Item>
              {record.roleName == "Staff" ? null : (
                <Menu.Item key="2" onClick={() => handleViewDetails(record)}>
                  Xem Chi Tiết
                </Menu.Item>
              )}
              {record.isActive ? (
                <Menu.Item key="3" onClick={() => handleBlockUser(record)}>
                  Khóa tài khoản
                </Menu.Item>
              ) : (
                <Menu.Item key="4" onClick={() => handleActiveUser(record)}>
                  Cho phép hoạt động
                </Menu.Item>
              )}
              {/* <Menu.Item key="5" onClick={() => handleDelete(record)}>
                Xóa
              </Menu.Item> */}
            </Menu>
          }
          trigger={["click"]}
        >
          <MoreOutlined />
        </Dropdown>
      ),
    },
  ];

  // Add pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: data.length,
  });

  const handleViewModel = (user) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };
  const handleViewDetails = (user) => {
    if (user.roleName == "Customer") {
      navigate(`/customer/${user._id}`);
    } else if (user.roleName == "Owner") {
      navigate(`/owner/${user._id}/dashboard`);
    }
  };
  const handleActiveUser = async (user) => {
    try {
      await activeUser(user._id).unwrap();
      message.success("Cho phép thành công thành công!");
    } catch {
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };
  const handleBlockUser = async (user) => {
    try {
      await blockUser(user._id).unwrap();
      message.success("Khóa thành công!");
    } catch {
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };
  // const handleDelete = (user) => {
  //   Modal.confirm({
  //     title: "Xác nhận xóa tài khoản?",
  //     icon: <ExclamationCircleOutlined />,
  //     content: `Bạn có chắc chắn muốn xóa tài khoản của ${user.fullName}?`,
  //     okText: "Xóa",
  //     okType: "danger",
  //     cancelText: "Hủy",
  //     onOk: async () => {
  //       try {
  //         await deleteUser(user.id).unwrap();
  //         message.success("Xóa tài khoản thành công!");
  //       } catch {
  //         message.error("Lỗi khi xóa tài khoản!");
  //       }
  //     },
  //   });
  // };

  return (
    <div style={{ marginTop: 10 }}>
      <Table
        scroll={{ x: "max-content" }}
        dataSource={data}
        loading={loading}
        columns={columns}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: false,
          className: styles.customPagination,
          onChange: (page) => {
            setPagination(prev => ({ ...prev, current: page }));
          },
          itemRender: (page, type, originalElement) => {
            const totalPages = Math.ceil(data.length / 7);
            if (type === "prev") {
              return (
                <button
                  className={styles.paginationButton}
                  disabled={page === 1} // First page starts at 1
                >
                  « Trước
                </button>
              );
            }
            if (type === "next") {
              return (
                <button
                  className={styles.paginationButton}
                  disabled={page === totalPages} // Disable when on the last page
                >
                  Tiếp »
                </button>
              );
            }
            return originalElement;
          },
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

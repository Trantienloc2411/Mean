import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MoreOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
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
      render: (_, __, index) => index + 1,
    },
    { title: "Tên", dataIndex: "fullName", key: "fullName" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Loại",
      dataIndex: "roleName",
      key: "roleName",
      render: (role) => <Tag color={roleColors[role] || "gray"}>{role}</Tag>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      align: "center",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Không Hoạt động</Tag>
        ),
    },
    {
      title: "Xác thực",
      dataIndex: "isVerified",
      align: "center",
      key: "approve",
      render: (_, record) => (
        <>
          <Tag color={record.isVerifiedEmail ? "green" : "red"}>Email</Tag>
          <Tag color={record.isVerifiedPhone ? "green" : "red"}>Phone</Tag>
        </>
      ),
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
              <Menu.Item key="2" onClick={() => handleViewDetails(record)}>
                Xem Chi Tiết
              </Menu.Item>
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

  const handleViewModel = (user) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };
  const handleViewDetails = (user) => {
    navigate(`/customer/${user._id}`);
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
      />
      <UserDetailModal
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}

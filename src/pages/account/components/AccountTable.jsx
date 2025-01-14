import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Table, Tag } from "antd";
import { RoleEnum, StatusEnum, ApproveEnum } from "../../../enums/accountEnums"; // Import enum từ file khác

// eslint-disable-next-line react/prop-types
export default function AccountTable({ data, loading }) {
  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1, // Tự động đánh số
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Loại",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const roleData = RoleEnum[role];
        return roleData ? (
          <Tag color={roleData.color}>{roleData.label}</Tag>
        ) : null;
      },
    },

    {
      title: "Trạng Thái",
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (status) => {
        const statusData = StatusEnum[status];
        return statusData ? (
          <Tag color={statusData.color}>{statusData.label}</Tag>
        ) : null;
      },
    },
    {
      title: "Xác thực",
      dataIndex: "approve",
      align: "center",
      key: "approve",
      render: (approve) => {
        const approveData = ApproveEnum[approve];
        return approveData ? (
          <Tag color={approveData.color}>{approveData.label}</Tag>
        ) : null;
      },
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Dropdown
          menu={
            <Menu>
              <Menu.Item key="1" onClick={() => handleViewDetails(record)}>
                Xem chi tiết
              </Menu.Item>
              <Menu.Item key="2" onClick={() => handleChangeStatus(record)}>
                Thay đổi trạng thái
              </Menu.Item>
              <Menu.Item key="3" onClick={() => handleDelete(record)}>
                Xóa
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <MoreOutlined />
        </Dropdown>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    console.log("Xem chi tiết:", record);
  };

  const handleChangeStatus = (record) => {
    console.log("Thay đổi trạng thái cho:", record);
  };

  const handleDelete = (record) => {
    console.log("Xóa người dùng:", record);
  };

  return (
    <div style={{ marginTop: 10 }}>
      <Table
        dataSource={data}
        loading={loading}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
}

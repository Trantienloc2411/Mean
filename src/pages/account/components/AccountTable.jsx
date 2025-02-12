import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Table, Tag } from "antd";

// eslint-disable-next-line react/prop-types
export default function AccountTable({ data, loading }) {
  console.log(data);
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
      render: (_, __, index) => index + 1, // Tự động đánh số
    },
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Loại",
      dataIndex: "roleName",
      key: "roleName",
      render: (role) => {
        const color = roleColors[role] || "gray";
        return <Tag color={color}>{role}</Tag>;
      },
    },

    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      align: "center",
      key: "isActive",
      render: (isActive) => {
        return isActive ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Không Hoạt động</Tag>
        );
      },
    },
    {
      title: "Xác thực",
      dataIndex: "isVerified", // Chỉ cần đặt một giá trị đại diện (có thể không cần)
      align: "center",
      key: "approve",
      render: (_, record) => {
        const { isVerifiedEmail, isVerifiedPhone } = record;

        return (
          <>
            {isVerifiedEmail ? (
              <Tag color="green">Email</Tag>
            ) : (
              <Tag color="red">Email</Tag>
            )}
            {isVerifiedPhone ? (
              <Tag color="green">Phone</Tag>
            ) : (
              <Tag color="red">Phone</Tag>
            )}
          </>
        );
      },
    },

    {
      title: "",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Dropdown
          overlay={
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
        scroll={{ x: "max-content" }}
        dataSource={data}
        loading={loading}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
}

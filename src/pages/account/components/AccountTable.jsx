import { MoreOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { Menu } from "antd";
import { Table, Tag } from "antd";

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
      title: "Vai trò",
      dataIndex: "role",
      align: "center",
      key: "role",
      // filters: [
      //   { text: "Admin", value: "Admin" },
      //   { text: "Người dùng", value: "Người dùng" },
      //   { text: "Quản lý", value: "Quản lý" },
      // ],
      // onFilter: (value, record) => record.role === value,
      render: (role) => {
        let color =
          role === "Admin" ? "red" : role === "Quản lý" ? "blue" : "green";
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      key: "status",
      // filters: [
      //   { text: "Hoạt động", value: "Hoạt động" },
      //   { text: "Chờ xác nhận", value: "Chờ xác nhận" },
      //   { text: "Đã khóa", value: "Đã khóa" },
      // ],
      // onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color =
          status === "Hoạt động"
            ? "green"
            : status === "Chờ xác nhận"
            ? "orange"
            : "volcano";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Phê duyệt",
      dataIndex: "approve",
      align: "center",
      key: "approve",
      // filters: [
      //   { text: "Đã phê duyệt", value: "Đã phê duyệt" },
      //   { text: "Chưa phê duyệt", value: "Chưa phê duyệt" },
      // ],
      // onFilter: (value, record) => record.approve === value,
      render: (approve) => {
        let color = approve === "Đã phê duyệt" ? "green" : "red";
        return <Tag color={color}>{approve}</Tag>;
      },
    },
    {
      title: "Action",
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
        dataSource={data}
        loading={loading}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
}

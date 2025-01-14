import { MoreOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { Menu } from "antd";
import { Tag } from "antd";
import { Table } from "antd";

export default function TransactionTable({ data, loading }) {
  const statusMapping = {
    active: "Hoạt động",
    pending: "Chờ xác nhận",
    inactive: "Hủy",
  };
  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1, // Tự động đánh số
    },
    {
      title: "Mã giao dịch",
      dataIndex: "transactionCode",
      key: "transactionCode",
    },
    {
      title: "Mã đặt phòng",
      dataIndex: "bookingCode",
      key: "bookingCode",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Số tiền",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      key: "status",

      render: (status) => {
        let color =
          status === "active"
            ? "green"
            : status === "pending"
            ? "orange"
            : "volcano";

        // Lấy trạng thái hiển thị tiếng Việt
        const displayStatus = statusMapping[status] || "Không xác định";

        return <Tag color={color}>{displayStatus}</Tag>;
      },
    },
    {
      title: "Loại giao dịch",
      dataIndex: "typeTransaction",
      align: "center",
      key: "typeTransaction",

      render: (typeTransaction) => {
        // Mapping trạng thái giao dịch sang tiếng Việt và màu sắc
        const transactionMapping = {
          deposit: { display: "Tiền cọc", color: "blue" },
          full_payment: { display: "Trả full", color: "green" },
          refund: { display: "Hoàn tiền", color: "red" },
          final_payment: { display: "Thanh toán cuối", color: "orange" },
        };

        // Lấy giá trị tương ứng hoặc sử dụng mặc định
        const { display = "Không xác định", color = "gray" } =
          transactionMapping[typeTransaction] || {};

        return <Tag color={color}>{display}</Tag>;
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

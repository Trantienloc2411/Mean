import { MoreOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { Menu } from "antd";
import { Tag } from "antd";
import { Table } from "antd";
import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from "../../../enums/transactionEnums";
import TransactionDetailModal from "./TransactionDetailModal";
import { useState } from "react";

export default function TransactionTable({ data, loading }) {
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

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
        const { label = "Không xác định", color = "gray" } =
          TransactionStatusEnum[status.toUpperCase()] || {};
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Loại giao dịch",
      dataIndex: "typeTransaction",
      align: "center",
      key: "typeTransaction",
      render: (typeTransaction) => {
        const { label = "Không xác định", color = "gray" } =
          TransactionTypeEnum[typeTransaction.toUpperCase()] || {};
        return <Tag color={color}>{label}</Tag>;
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
    setSelectedTransaction(record);
    setDetailModalVisible(true);
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
      <TransactionDetailModal
        visible={isDetailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}

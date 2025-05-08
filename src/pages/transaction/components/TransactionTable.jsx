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
import styles from "./TransactionTable.module.scss";
import { FaEye } from "react-icons/fa";

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
    // {
    //   title: "Mã đặt phòng",
    //   dataIndex: "bookingCode",
    //   key: "bookingCode",
    // },
    {
      title: "Thời gian tạo",
      dataIndex: "createTime",
      key: "createTime",
    },
    // {
    //   title: "Thời gian kết thúc",
    //   dataIndex: "endTime",
    //   key: "endTime",
    // },
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
        return status.en == "PENDING" ? (
          <span style={{ background: "#fff7e6", color: "#fa8c16", borderRadius: 20, padding: "4px 12px" }}>
            {status.vi}
          </span>
        ) : status.en == "COMPLETED" ? (
          <span style={{ background: "#d1fae5", color: "#059669", borderRadius: 20, padding: "4px 12px" }}>
            {status.vi}
          </span>
        ) : status.en == "FAILED" ? (
          <span style={{ background: "red", color: "#fff", borderRadius: 20, padding: "4px 12px" }}>
            {status.vi}
          </span>
        ) : (
          <span style={{ background: "#333", color: "#fff", borderRadius: 20, padding: "4px 12px" }}>
            {status.vi}
          </span>
        );
      },
    },
    {
      title: "Loại giao dịch",
      dataIndex: "typeTransaction",
      align: "center",
      key: "typeTransaction",
      render: (typeTransaction) => {
        return typeTransaction.en == "MOMO_PAYMENT" ? (
          <span
            style={{ background: "#a21d65", color: "#fff", borderRadius: 20, padding: "4px 12px" }}
          >
            {typeTransaction.vi}
          </span>
        ) : (
          <span style={{ background: "#333", color: "#fff", borderRadius: 20, padding: "4px 12px" }}>
            {typeTransaction.vi}
          </span>
        );
      },
    },
    {
      key: "view",
      align: "center",
      render: (_, record) => (
        <span
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            handleViewDetails(record);
          }}
        >
          <FaEye />
        </span>
      ),
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   align: "center",
    //   render: (text, record) => (
    //     <Dropdown
    //       overlay={
    //         <Menu>
    //           <Menu.Item key="1" onClick={() => handleViewDetails(record)}>
    //             Xem chi tiết
    //           </Menu.Item>
    //           <Menu.Item key="2" onClick={() => handleChangeStatus(record)}>
    //             Thay đổi trạng thái
    //           </Menu.Item>
    //           <Menu.Item key="3" onClick={() => handleDelete(record)}>
    //             Xóa
    //           </Menu.Item>
    //         </Menu>
    //       }
    //       trigger={["click"]}
    //     >
    //       <MoreOutlined />
    //     </Dropdown>
    //   ),
    // },
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
        scroll={{ x: "max-content" }}
        pagination={{
          total: data.length,
          pageSize: 7,
          showSizeChanger: false,
          className: styles.customPagination,
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
        className={styles.transactionTable}
      />
      <TransactionDetailModal
        visible={isDetailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}

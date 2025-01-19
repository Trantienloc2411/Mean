import styles from "../Wallet/MeanWallet.module.scss";
import React from "react";
import { Table, Tag, Button, Card } from "antd";
const MeanWallet = ({ walletData, transactionData }) => {
  const columns = [
    {
      title: "No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Mã giao dịch",
      dataIndex: "transactionCode",
      key: "transactionCode",
    },
    {
      title: "Loại giao dịch",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color="green">{type}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        switch (status) {
          case "Active":
            color = "green";
            break;
          case "Paused":
            color = "orange";
            break;
          case "Expired":
            color = "red";
            break;
          default:
            color = "blue";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "",
      key: "action",
      render: () => <Button type="link">...</Button>,
    },
  ];

  return (
    <div className={styles.content}>
      <div className={styles.headerContent}>
        <h2>Ví Mean</h2>
        <Button type="primary" className={styles.topUpButton}>
          Tạo lệnh nạp tiền
        </Button>
      </div>
      <div className={styles.walletSection}>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 400, marginRight: 120 }}>
          <h4>Số tiền khả dụng: </h4>
          <Card
            className={styles.walletCard}
            style={{ backgroundColor: "#1890ff", color: "#fff" }}
          >
            <div>
              <div>{walletData.userName}</div>
              <div>Mean</div>
            </div>
            <div>{walletData.availableBalance}</div>
          </Card>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", minWidth: 400 }}
        >
          <h4>Số tiền khoá: </h4>
          <Card
            className={styles.walletCard}
            style={{ backgroundColor: "#d9d9d9" }}
          >
            <div>
              <div>{walletData.userName}</div>
              <div>Mean</div>
            </div>
            <div>{walletData.pendingBalance}</div>
          </Card>
        </div>
      </div>
      <h3>Lịch sử ví:</h3>
      <Table
        columns={columns}
        dataSource={transactionData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default MeanWallet;

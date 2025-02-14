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
      render: (type) => {
        return (
          <span className={`${styles.type} ${styles[type.toLowerCase()]}`}>
            {type}
          </span>
        );
      }
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
        let className = '';
        switch (status) {
          case 'Active':
            className = styles.active;
            break;
          case 'Paused':
            className = styles.paused;
            break;
          case 'Expired':
            className = styles.expired;
            break;
          default:
            break;
        }
        return <span className={`${styles.status} ${className}`}>
          {status === 'Active' ? 'Đang hoạt động' : status === 'Paused' ? 'Tạm dừng' : 'Hết hạn'}
        </span>;
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

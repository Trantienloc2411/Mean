import React from "react";
import { Card, Typography, Col, Statistic } from "antd";
import {
  WalletOutlined,
  PercentageOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const RevenueSummary = ({ summary }) => {
  return (
    <>
      <Col span={8}>
        <Card bordered style={{ background: "#f6ffed" }}>
          <Statistic
            title={<Text strong>Tổng doanh thu</Text>}
            value={summary.totalRevenue}
            precision={0}
            valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
            suffix="VND"
            prefix={<WalletOutlined />}
            formatter={(value) => value.toLocaleString()}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered style={{ background: "#fffbe6" }}>
          <Statistic
            title={<Text strong>Phí nền tảng</Text>}
            value={summary.totalPlatformFee}
            precision={0}
            valueStyle={{ color: "#faad14", fontWeight: "bold" }}
            suffix="VND"
            prefix={<DollarOutlined />}
            formatter={(value) => value.toLocaleString()}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered style={{ background: "#e6f7ff" }}>
          <Statistic
            title={<Text strong>Tiền trả cho Owner</Text>}
            value={summary.totalOwnerProfit}
            precision={0}
            valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
            suffix="VND"
            prefix={<DollarOutlined />}
            formatter={(value) => value.toLocaleString()}
          />
        </Card>
      </Col>
    </>
  );
};

export default RevenueSummary;

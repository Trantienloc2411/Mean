import { Typography } from "antd";
import {
  DollarOutlined,
  WalletOutlined,
  BankOutlined,
  UndoOutlined,
  CloseCircleOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseSquareOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Card, Space, Statistic } from "antd";

function SummaryCard({
  title,
  value,
  suffix,
  icon,
  bgColor = "#fcefe6",
  iconColor = "#d46b08",
}) {
  return (
    <Card style={{ minWidth: 220 }}>
      <Space align="start">
        <Statistic
          title={
            <div style={{ fontSize: 14, color: "#666", fontWeight: "normal" }}>
              {title}
            </div>
          }
          value={value}
          suffix={suffix}
          valueStyle={{ fontSize: 20, color: "#000", fontWeight: 600 }}
        />
        <div
          style={{
            backgroundColor: bgColor,
            padding: 12,
            marginLeft: 8,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: iconColor,
            minWidth: 48,
            minHeight: 48,
          }}
        >
          {icon}
        </div>
      </Space>
    </Card>
  );
}

export default function RevenueSummary({ summary }) {
  return (
    <div style={{ display: "grid", gap: 24, marginBottom: 24 }}>
      {/* Nhóm 1: Thống kê tiền */}
      <div>
        <Typography.Title level={4}>💰 Thống kê tiền</Typography.Title>
        <div
          style={{
            display: "flex",
            gap: 16,
            // overflowX: "auto",
            flexWrap: "wrap",
            paddingBottom: 8,
          }}
        >
          <SummaryCard
            title="Tổng doanh thu (PAID)"
            value={summary.totalRevenue}
            suffix="VND"
            icon={<DollarOutlined />}
            bgColor="#e6f7ff"
            iconColor="#1890ff"
          />
          <SummaryCard
            title="Tiền Owner nhận"
            value={summary.ownerEarnings}
            suffix="VND"
            icon={<WalletOutlined />}
            bgColor="#f6ffed"
            iconColor="#52c41a"
          />
          <SummaryCard
            title="Phí hệ thống thu"
            value={summary.platformFeeTotal}
            suffix="VND"
            icon={<BankOutlined />}
            bgColor="#fffbe6"
            iconColor="#faad14"
          />
          <SummaryCard
            title="Tổng tiền hoàn"
            value={summary.totalRefundAmount}
            suffix="VND"
            icon={<UndoOutlined />}
            bgColor="#f9f0ff"
            iconColor="#722ed1"
          />
          <SummaryCard
            title="Tổng tiền huỷ"
            value={summary.totalCancelledAmount}
            suffix="VND"
            icon={<CloseCircleOutlined />}
            bgColor="#fff1f0"
            iconColor="#f5222d"
          />
        </div>
      </div>

      {/* Nhóm 2: Thống kê đơn */}
      <div>
        <Typography.Title level={4}>📦 Thống kê đơn</Typography.Title>
        <div
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            paddingBottom: 8,
          }}
        >
          <SummaryCard
            title="Tổng Booking"
            value={summary.bookingCount}
            icon={<ShoppingOutlined />}
            bgColor="#e6fffb"
            iconColor="#13c2c2"
          />
          <SummaryCard
            title="Thanh toán thành công (PAID)"
            value={summary.successCount}
            icon={<CheckCircleOutlined />}
            bgColor="#f0f5ff"
            iconColor="#2f54eb"
          />
          <SummaryCard
            title="Đơn huỷ"
            value={summary.cancelledCount}
            icon={<CloseSquareOutlined />}
            bgColor="#fff1f0"
            iconColor="#f5222d"
          />
          <SummaryCard
            title="Đơn hoàn tiền "
            value={summary.refundCount}
            icon={<ReloadOutlined />}
            bgColor="#fff0f6"
            iconColor="#eb2f96"
          />
        </div>
      </div>
    </div>
  );
}

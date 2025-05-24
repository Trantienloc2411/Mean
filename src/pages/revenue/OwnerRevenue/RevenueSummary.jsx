import { Card, Statistic, Typography } from "antd";

export default function RevenueSummary({ summary }) {
  return (
    <div style={{ display: "grid", gap: 24, marginBottom: 24 }}>
      {/* Nhóm 1: Thống kê tiền */}
      <div>
        <Typography.Title level={4}>💰 Thống kê tiền</Typography.Title>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <Card>
            <Statistic
              title="Tổng doanh thu (PAID)"
              value={summary.totalRevenue}
              suffix="VND"
            />
          </Card>
          <Card>
            <Statistic
              title="Tiền Owner nhận"
              value={summary.ownerEarnings}
              suffix="VND"
            />
          </Card>
          <Card>
            <Statistic
              title="Phí hệ thống thu"
              value={summary.platformFeeTotal}
              suffix="VND"
            />
          </Card>
          <Card>
            <Statistic
              title="Tổng tiền hoàn (REFUND)"
              value={summary.totalRefundAmount}
              suffix="VND"
            />
          </Card>
          <Card>
            <Statistic
              title="Tổng tiền huỷ (CANCELLED)"
              value={summary.totalCancelledAmount}
              suffix="VND"
            />
          </Card>
        </div>
      </div>

      {/* Nhóm 2: Thống kê đơn */}
      <div>
        <Typography.Title level={4}>📦 Thống kê đơn</Typography.Title>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <Card>
            <Statistic title="Tổng Booking" value={summary.bookingCount} />
          </Card>
          <Card>
            <Statistic title="Thanh toán thành công (PAID)" value={summary.successCount} />
          </Card>
          <Card>
            <Statistic
              title="Đơn huỷ (CANCELLED)"
              value={summary.cancelledCount}
            />
          </Card>
          <Card>
            <Statistic
              title="Đơn hoàn tiền (REFUND)"
              value={summary.refundCount}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

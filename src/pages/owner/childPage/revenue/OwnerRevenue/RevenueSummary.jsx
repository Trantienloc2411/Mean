import { Card, Statistic } from "antd";

export default function RevenueSummary({ summary }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 24,
      }}
    >
      <Card>
        <Statistic
          title="Tổng doanh thu"
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
        <Statistic title="Tổng Booking" value={summary.bookingCount} />
      </Card>
      <Card>
        <Statistic title="Booking thành công" value={summary.successCount} />
      </Card>
      {/* <Card>
        <Statistic
          title="Booking huỷ"
          value={summary.totalCancelled}
          suffix="VND"
        />
      </Card> */}
      <Card>
        <Statistic title="Đơn huỷ" value={summary.cancelledCount} />
      </Card>
    </div>
  );
}

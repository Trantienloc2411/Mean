import { useState } from "react";
import styles from "./Overview.module.scss";
import CardDashboard from "../../../../components/Card/CardDashboard";
import { Spin } from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  RiseOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import ReviewList from "./components/ReviewList.jsx";
import CardListBooking from "./components/CardListBooking.jsx";
import { useGetBookingsByOwnerIdQuery } from "../../../../redux/services/bookingApi.js";
import { useGetOwnerDetailByUserIdQuery } from "../../../../redux/services/ownerApi.js";
import { useGetFeedbackByOwnerIdQuery } from "../../../../redux/services/feedbackApi.js";
import { useParams } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect } from "react";

export default function Overview() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("weekly");
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState([]);

  const { data: ownerDetail } = useGetOwnerDetailByUserIdQuery(id);

  const { data: bookingDetail } = useGetBookingsByOwnerIdQuery(
    ownerDetail?.id,
    {
      skip: !ownerDetail?.id,
    }
  );

  const { data: feebackData, isLoadingFeedback } = useGetFeedbackByOwnerIdQuery(
    ownerDetail?.id,
    {
      skip: !ownerDetail?.id,
    }
  );

  useEffect(() => {
    if (isLoadingFeedback) {
      setIsLoading(true);
    } else {
      setFeedback(feebackData?.data);
      setIsLoading(false);
    }
  }, [feebackData, isLoadingFeedback]);

  const parseDate = (dateStr) => {
    const [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("/");
    return new Date(`${year}-${month}-${day}T${timePart}`);
  };

  const filterDataBooking =
    bookingDetail?.filter(
      (booking) => parseDate(booking.checkInHour) > new Date()
    ) || [];

  // Calculate statistics
  const totalBookings = bookingDetail?.length || 0;
  const completedBookings =
    bookingDetail?.filter((booking) => booking.status === 7).length || 0;
  const cancelledBookings =
    bookingDetail?.filter((booking) => booking.status === 6).length || 0;
  const totalRevenue =
    bookingDetail?.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0
    ) || 0;

  // Sample data for charts
  const weeklyData = [
    { name: "T2", bookings: 4, revenue: 400000 },
    { name: "T3", bookings: 3, revenue: 300000 },
    { name: "T4", bookings: 5, revenue: 500000 },
    { name: "T5", bookings: 7, revenue: 700000 },
    { name: "T6", bookings: 6, revenue: 600000 },
    { name: "T7", bookings: 8, revenue: 800000 },
    { name: "CN", bookings: 9, revenue: 900000 },
  ];

  const monthlyData = [
    { name: "Tháng 1", bookings: 30, revenue: 3000000 },
    { name: "Tháng 2", bookings: 25, revenue: 2500000 },
    { name: "Tháng 3", bookings: 35, revenue: 3500000 },
    { name: "Tháng 4", bookings: 40, revenue: 4000000 },
    { name: "Tháng 5", bookings: 45, revenue: 4500000 },
    { name: "Tháng 6", bookings: 50, revenue: 5000000 },
  ];

  const pieData = [
    { name: "Phòng Basic", value: 40 },
    { name: "Phòng Plus", value: 30 },
    { name: "Phòng VIP", value: 20 },
    { name: "Phòng Deluxe", value: 10 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const chartData = activeTab === "weekly" ? weeklyData : monthlyData;

  return (
    <div className={styles.contentContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <CalendarOutlined className={styles.headerIcon} />
          Tổng quan đặt phòng
        </h1>
        <p className={styles.pageSubtitle}>
          Xem thông tin đặt phòng và thống kê doanh thu
        </p>
      </div>

      <div className={styles.statsCards}>
        <CardDashboard
          title="Tổng đặt phòng"
          value={totalBookings.toString()}
          iconName={<TeamOutlined />}
          backgroundColorIcon="#e6f7ff"
          colorIcon="#1890ff"
          height="120"
          width="100%"
        />

        <CardDashboard
          title="Hoàn tất"
          value={completedBookings.toString()}
          iconName={<CheckCircleOutlined />}
          backgroundColorIcon="#f6ffed"
          colorIcon="#52c41a"
          height="120"
          width="100%"
        />

        <CardDashboard
          title="Huỷ"
          value={cancelledBookings.toString()}
          iconName={<CloseCircleOutlined />}
          backgroundColorIcon="#fff2f0"
          colorIcon="#ff4d4f"
          height="120"
          width="100%"
        />

        <CardDashboard
          title="Doanh thu"
          value={`${totalRevenue.toLocaleString("vi-VN")}đ`}
          iconName={<DollarOutlined />}
          backgroundColorIcon="#f9f0ff"
          colorIcon="#722ed1"
          height="120"
          width="100%"
        />
      </div>

      <h2 className={styles.sectionTitle}>
        <RiseOutlined className={styles.sectionIcon} />
        Đặt phòng hôm nay
      </h2>

      <div className={styles.bookingOverview}>
        <CardListBooking
          stageLevel="1"
          filterDataBooking={filterDataBooking}
          listBookingTypeName="Đặt phòng sắp tới"
        />
        <CardListBooking
          stageLevel="2"
          filterDataBooking={filterDataBooking}
          listBookingTypeName="Đang đặt phòng"
        />
        <CardListBooking
          stageLevel="3"
          filterDataBooking={filterDataBooking}
          listBookingTypeName="Đặt phòng hoàn tất"
        />
      </div>

      <h2 className={styles.sectionTitle}>
        <BarChartOutlined className={styles.sectionIcon} />
        Thống kê & Phân tích
      </h2>

      <div className={styles.chartControls}>
        <div className={styles.tabButtons}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "weekly" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("weekly")}
          >
            Tuần này
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "monthly" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("monthly")}
          >
            Tháng này
          </button>
        </div>
      </div>

      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Số lượng đặt phòng</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, "Đặt phòng"]} />
                <Legend />
                <Bar dataKey="bookings" fill="#1890ff" name="Số đặt phòng" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Doanh thu</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString("vi-VN")}đ`,
                    "Doanh thu",
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#722ed1"
                  fill="#f9f0ff"
                  name="Doanh thu (VNĐ)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.pieChartCard}>
          <h3 className={styles.chartTitle}>Phân bổ loại phòng</h3>
          <div className={styles.pieChartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.reviewsCard}>
          <h3 className={styles.chartTitle}>Đánh giá gần đây</h3>
          <div className={styles.reviewsWrapper}>
            {!isLoading && feedback ? (
              <ReviewList reviews={feedback} />
            ) : (
              <Spin size="large" className={styles.loadingSpinner} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
import { useGetBoookingStatsWeeklyQuery, useGetBookingStatsMonthlyQuery, useGetStatsRevenueWeeklyQuery, useGetStatsRevenueMonthlyQuery} from "../../../../redux/services/bookingApi.js"
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

  const { data: weeklyBookingStats, isLoading: isLoadingWeeklyStats } =
    useGetBoookingStatsWeeklyQuery(id);
  const { data: monthlyBookingStats, isLoading: isLoadingMonthlyStats } =
    useGetBookingStatsMonthlyQuery(id);
  const { data: weeklyRevenueStats, isLoading: isLoadingWeeklyRevenue } =
    useGetStatsRevenueWeeklyQuery(id);
  const { data: monthlyRevenueStats, isLoading: isLoadingMonthlyRevenue } =
    useGetStatsRevenueMonthlyQuery(id);


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
    bookingDetail?.filter((booking) => booking.paymentStatus === 3).  
    reduce(
      (sum, booking) => sum + (booking.totalPrice || 0)
      ,
      0
    ) || 0;

  const transformStatsData = (bookingStats, revenueStats) => {
  const mergedData = [];

  for (const key in bookingStats || {}) {
    mergedData.push({
      name: key, 
      bookings: bookingStats[key] || 0,
      revenue: revenueStats?.[key] || 0,
    });
  }

  return mergedData;
};



  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const chartData =
  activeTab === "weekly"
    ? transformStatsData(weeklyBookingStats, weeklyRevenueStats)
    : transformStatsData(monthlyBookingStats, monthlyRevenueStats);


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

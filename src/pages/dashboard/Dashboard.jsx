import styles from "./Dashboard.module.scss";
import { useState, useEffect } from "react";
import Table from "./components/Table";
import ReviewList from "./components/List";
import moment from "moment";
import { useGetUsersQuery } from "../../redux/services/userApi";
import { useGetAllBookingsQuery } from "../../redux/services/bookingApi";
import { useGetTotalRevenueQuery } from "../../redux/services/customQueryApi";
import { useGetTotalTransactionsQuery } from "../../redux/services/customQueryApi";

import { placeLove, reviewList } from "./data/dataFake";
import Overview from "./components/Overview";
import QuarterlyUsersChart from "./components/QuarterlyUsersChart";
import MonthlyBookingsChart from "./components/MonthlyBookingsChart";
import MonthlyRevenueChart from "./components/MonthlyRevenueChart";
import BookingStatusPieChart from "./components/BookingStatusPieChart";
import { Spin } from "antd";

export default function Dashboard() {
  // console.log("--- Dashboard Component Start ---")

  const {
    data: rawUserData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useGetUsersQuery();
  const {
    data: rawBookingData,
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
  } = useGetAllBookingsQuery();
  const { data: totalRevenueFromHook, isLoading: isLoadingTotalRevenue } =
    useGetTotalRevenueQuery();
  const {
    data: totalTransactionsFromHook,
    isLoading: isLoadingTotalTransactions,
  } = useGetTotalTransactionsQuery();

  const usersArray =
    rawUserData?.data || (Array.isArray(rawUserData) ? rawUserData : []);
  const bookingsArray =
    rawBookingData?.data ||
    (Array.isArray(rawBookingData) ? rawBookingData : []);

  const overviewTotalRevenue =
    totalRevenueFromHook?.totalRevenue || totalRevenueFromHook || 0;
  const overviewTotalTransactions =
    totalTransactionsFromHook?.totalTransactions ||
    totalTransactionsFromHook ||
    0;

  const columnPlace = [
    {
      title: <span className={styles.titleTable}>SL No</span>,
      dataIndex: "key",
      key: "key",
    },
    {
      title: <span className={styles.titleTable}>Tên Địa Điểm</span>,
      dataIndex: "placeName",
      key: "placeName",
    },
    {
      title: <span className={styles.titleTable}>Lượt Đặt Phòng</span>,
      dataIndex: "bookedCount",
      key: "bookedCount",
      sorter: (a, b) => a.bookedCount - b.bookedCount,
    },
    {
      title: <span className={styles.titleTable}>Đánh Giá Trung Bình</span>,
      dataIndex: "ratingAverage",
      key: "ratingAverage",
      sorter: (a, b) => a.ratingAverage - b.ratingAverage,
    },
  ];

  const [monthlyData, setMonthlyData] = useState([]);
  const [quarterlyData, setQuarterlyData] = useState([]);
  const [bookingStats, setBookingStats] = useState({ total: 0, data: [] });

  const processUsersByQuarter = (users) => {
    if (!users || users.length === 0) return [];
    const quarterCounts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    users.forEach((user, index) => {
      // Assuming user.createdAt might also be "DD/MM/YYYY HH:mm:ss" or ISO
      // Let moment try to parse it; if it's "DD/MM/YYYY...", provide format
      const dateString = user.createdAt?.$date || user.createdAt;
      let date = moment(dateString); // Try ISO/standard first
      if (
        !date.isValid() &&
        typeof dateString === "string" &&
        dateString.includes("/")
      ) {
        // If not valid and looks like "DD/MM/YYYY...", try with specific format
        date = moment(dateString, "DD/MM/YYYY HH:mm:ss");
      }

      if (date.isValid()) {
        const quarter = Math.ceil((date.month() + 1) / 3);
        const quarterKey = `Q${quarter}`;
        if (user.roleID !== "67927feaa0a58ce4f7e8e83a") {
          quarterCounts[quarterKey]++;
        }
      } else {
        console.warn(
          `[processUsersByQuarter] Invalid date for user ${index}:`,
          dateString,
          user
        );
      }
    });
    const currentYear = moment().year();
    const result = Object.entries(quarterCounts).map(([quarter, count]) => ({
      quarter: `${quarter}/${currentYear}`,
      users: count,
    }));
    return result;
  };

  const processBookingStatus = (bookings) => {
    // console.log("[processBookingStatus] Input bookings count:", bookings?.length)
    if (!bookings || bookings.length === 0) {
      return { total: 0, data: [] };
    }
    const statusCounts = { complete: 0, cancel: 0, pending: 0 };
    bookings.forEach((booking) => {
      let isComplete = false;
      if (
        booking.paymentStatus === 3 ||
        booking.paymentStatus === 4 ||
        (booking.completedDate &&
          moment(
            booking.completedDate.$date || booking.completedDate
          ).isValid())
      ) {
        isComplete = true;
        statusCounts.complete++;
      } else if (booking.isCancel) {
        statusCounts.cancel++;
      } else {
        statusCounts.pending++;
      }
    });
    const data = [
      { name: "Hoàn thành", value: statusCounts.complete, color: "#14b8a6" },
      { name: "Đã hủy", value: statusCounts.cancel, color: "#ef4444" },
      { name: "Chờ/Khác", value: statusCounts.pending, color: "#f59e0b" },
    ];
    const result = {
      total: bookings.length,
      data: data.filter((item) => item.value > 0),
    };
    // console.log("[processBookingStatus] Output:", result)
    return result;
  };

  const processBookingsByMonth = (bookings) => {
    console.log(
      "[processBookingsByMonth] Input bookings count:",
      bookings?.length
    );
    if (!bookings || bookings.length === 0) {
      return [];
    }
    const monthlyBookings = {};
    bookings.forEach((booking, index) => {
      // Extract the date string, assuming it might be in booking.createdAt directly
      // or nested if it were an object like { $date: "..." }
      const dateString = booking.createdAt?.$date || booking.createdAt;

      // IMPORTANT: Provide the format string to moment
      const date = moment(dateString, "DD/MM/YYYY HH:mm:ss", true); // Added format and strict parsing

      if (date.isValid()) {
        const monthKey = date.format("MM/YY");
        const fullMonth = date.format("MM/YYYY");
        if (!monthlyBookings[monthKey]) {
          monthlyBookings[monthKey] = {
            month: monthKey,
            fullMonth: fullMonth,
            bookings: 0,
            revenue: 0,
          };
        }
        monthlyBookings[monthKey].bookings++;
        if (booking.paymentStatus === 3) {
          monthlyBookings[monthKey].revenue += booking.totalPrice || 0;
        }
      } else {
        // Fallback: if strict parsing "DD/MM/YYYY HH:mm:ss" fails, try if it's an ISO string
        const isoDate = moment(dateString);
        if (isoDate.isValid()) {
          const monthKey = isoDate.format("MM/YY");
          const fullMonth = isoDate.format("MM/YYYY");
          if (!monthlyBookings[monthKey]) {
            monthlyBookings[monthKey] = {
              month: monthKey,
              fullMonth: fullMonth,
              bookings: 0,
              revenue: 0,
            };
          }
          monthlyBookings[monthKey].bookings++;
          if (booking.paymentStatus === 3) {
            monthlyBookings[monthKey].revenue += booking.totalPrice || 0;
          }
        } else {
          console.warn(
            `[processBookingsByMonth] Invalid date for booking ${index} (tried DD/MM/YYYY HH:mm:ss and ISO):`,
            dateString,
            booking
          );
        }
      }
    });
    console.log(
      "[processBookingsByMonth] Aggregated Data (before Object.values):",
      monthlyBookings
    );
    const result = Object.values(monthlyBookings)
      .sort(
        (a, b) =>
          moment(a.fullMonth, "MM/YYYY").valueOf() -
          moment(b.fullMonth, "MM/YYYY").valueOf()
      )
      .slice(-6);
    console.log("[processBookingsByMonth] Output (last 6 months):", result);
    return result;
  };

  const countUser = (users) => {
    if (!users || users.length === 0) return 0;
    return users.filter((user) => user.roleID !== "67927feaa0a58ce4f7e8e83a")
      .length;
  };

  useEffect(() => {
    // console.log("--- useEffect Start ---")
    // console.log("Raw User Data in useEffect:", rawUserData)
    // console.log("Raw Booking Data in useEffect:", rawBookingData)
    // console.log("Processed usersArray length in useEffect:", usersArray.length)
    // console.log("Processed bookingsArray length in useEffect:", bookingsArray.length)

    if (usersArray.length > 0) {
      const qData = processUsersByQuarter(usersArray);
      // console.log("Setting Quarterly Data:", qData)
      setQuarterlyData(qData);
    } else {
      // console.log("No users, setting empty Quarterly Data")
      setQuarterlyData([]);
    }

    if (bookingsArray.length > 0) {
      // console.log("Processing bookingsArray for monthlyData and bookingStats. Count:", bookingsArray.length)
      const mData = processBookingsByMonth(bookingsArray);
      const bStats = processBookingStatus(bookingsArray);
      // console.log("Setting Monthly Data:", mData)
      setMonthlyData(mData);
      // console.log("Setting Booking Stats:", bStats)
      setBookingStats(bStats);
    } else {
      // console.log("No bookings, setting empty Monthly Data and Booking Stats")
      setMonthlyData([]);
      setBookingStats({ total: 0, data: [] });
    }
    // console.log("--- useEffect End ---")
  }, [rawUserData, rawBookingData, usersArray, bookingsArray]); // Added usersArray and bookingsArray to dependencies

  const isLoading =
    isLoadingUsers ||
    isLoadingBookings ||
    isLoadingTotalRevenue ||
    isLoadingTotalTransactions;

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (isErrorUsers || isErrorBookings) {
    // console.error("Error fetching data. User error:", isErrorUsers, "Booking error:", isErrorBookings)
    return <div>Error loading dashboard data. Please try again.</div>;
  }

  // console.log("--- Dashboard Render ---")

  return (
    <>
      <div className={styles.contentContainer}>
        <h1 className={styles.sectionTitle}>Tổng quan</h1>
        <Overview
          totalUser={
            countUser(usersArray) > 1000
              ? `${(countUser(usersArray) / 1000).toFixed(1)}K`
              : countUser(usersArray)
          }
          totalTransaction={
            overviewTotalTransactions > 1000
              ? `${(overviewTotalTransactions / 1000).toFixed(1)}K`
              : overviewTotalTransactions
          }
          totalRevenue={
            overviewTotalRevenue > 1000
              ? `${(overviewTotalRevenue / 1000).toFixed(1)}K VNĐ`
              : `${overviewTotalRevenue} VNĐ`
          }
        />

        <h1 className={styles.sectionTitle}>Thống kê chi tiết</h1>
        <div className={styles.chartList}>
          <QuarterlyUsersChart
            data={quarterlyData}
            year={quarterlyData[0]?.quarter.split("/")[1] || moment().year()}
          />
          <MonthlyBookingsChart data={monthlyData} />
          <MonthlyRevenueChart data={monthlyData} />
          <BookingStatusPieChart
            data={bookingStats.data}
            total={bookingStats.total}
          />
        </div>
      </div>
    </>
  );
}

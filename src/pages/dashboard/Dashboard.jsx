import styles from "./Dashboard.module.scss";
import { useState, useEffect } from "react";
import Table from "./components/Table";
import ReviewList from "./components/List";
import moment from "moment";
import { useGetUsersQuery } from "../../redux/services/userApi";
import { useGetAllBookingsQuery } from "../../redux/services/bookingApi";

import { placeLove, reviewList } from "./data/dataFake";
import Overview from "./components/Overview";
import {
  Area,
  AreaChart,
  CartesianAxis,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Space, Card, Row, Col, Statistic } from "antd";
import { ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Legend } from 'recharts';
import QuarterlyUsersChart from './components/QuarterlyUsersChart';
import MonthlyBookingsChart from './components/MonthlyBookingsChart';
import MonthlyRevenueChart from './components/MonthlyRevenueChart';
import BookingStatusPieChart from './components/BookingStatusPieChart';

export default function Dashboard() {
  const { data: userData, isLoading: isLoadingUsers } = useGetUsersQuery();
  const { data: bookingData, isLoading: isLoadingBookings } = useGetAllBookingsQuery();

  console.log(bookingData);

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


  // State to store the data
  const [monthlyData, setMonthlyData] = useState([]);
  const [quarterlyData, setQuarterlyData] = useState([]);
  const [bookingStats, setBookingStats] = useState({ total: 0, data: [] });

  // Add this function to process API data and count users by quarter
  const processUsersByQuarter = (users) => {
    if (!users) return [];
    
    const quarterCounts = {
      Q1: 0,
      Q2: 0,
      Q3: 0,
      Q4: 0
    };

    users.forEach(user => {
      const date = moment(user.createdAt, "DD/MM/YYYY HH:mm:ss");
      const quarter = Math.ceil((date.month() + 1) / 3);
      const quarterKey = `Q${quarter}`;
      if (user.roleID != "67927feaa0a58ce4f7e8e83a") {
        quarterCounts[quarterKey]++;
      }
    });

    const currentYear = moment().year();
    return Object.entries(quarterCounts).map(([quarter, count]) => ({
      quarter: `${quarter}/${currentYear}`,
      users: count
    }));
  };

  // Update the processBookingStatus function
  const processBookingStatus = (bookings) => {
    if (!bookings) return { total: 0, data: [] };
    
    const statusCounts = {
      complete: 0,
      cancel: 0,
      pending: 0
    };
    console.log(bookings);
    
    bookings.forEach(booking => {
      // Đã hoàn thành: có completedDate hoặc paymentStatus là "Hoàn thành"
      if (booking.completedDate || booking.paymentStatus === "Hoàn thành") {
        statusCounts.complete++;
      }
      // Đã hủy: isCancel là true
      else if (booking.isCancel) {
        statusCounts.cancel++;
      }
      // Chờ thanh toán: các trường hợp còn lại
      else {
        statusCounts.pending++;
      }
    });

    const data = [
      { 
        name: 'Hoàn thành', 
        value: statusCounts.complete, 
        color: '#14b8a6',
        description: 'Đã thanh toán và hoàn thành'
      },
      { 
        name: 'Đã hủy', 
        value: statusCounts.cancel, 
        color: '#ef4444',
        description: 'Đơn đặt phòng đã bị hủy'
      },
      { 
        name: 'Chờ thanh toán', 
        value: statusCounts.pending, 
        color: '#f59e0b',
        description: 'Đang chờ thanh toán'
      }
    ];

    return {
      total: bookings.length,
      data: data.filter(item => item.value > 0)
    };
  };

  // Update the monthly bookings processing
  const processBookingsByMonth = (bookings) => {
    if (!bookings) return [];
    
    const monthlyBookings = {};
    
    bookings.forEach(booking => {
      const date = moment(booking.createdAt, "DD/MM/YYYY HH:mm:ss");
      const monthKey = date.format("MM/YY");
      const fullMonth = date.format("MM/YYYY");
      
      if (!monthlyBookings[monthKey]) {
        monthlyBookings[monthKey] = {
          month: monthKey,
          fullMonth: fullMonth,
          bookings: 0,
          revenue: 0
        };
      }
      
      monthlyBookings[monthKey].bookings++;
      // Sử dụng totalPrice từ API
      monthlyBookings[monthKey].revenue += booking.totalPrice || 0;
    });

    return Object.values(monthlyBookings)
      .sort((a, b) => moment(a.fullMonth, "MM/YYYY") - moment(b.fullMonth, "MM/YYYY"))
      .slice(-6);
  };

  const countUser = (users) => {
    if (!users) return 0;
    let userCount = 0;
    users.forEach(user => {
      if (user.roleID != "67927feaa0a58ce4f7e8e83a") {
        userCount++;
      }
    });
    return userCount;
  }

  const countBooking = (bookings) => {
    if (!bookings?.data) return 0; // Check if bookings exists and has 'data'
    console.log("Line 187",bookings.data.length);
    return bookings.data.length;
  };
  

  const countRevenue = (bookings) => {
    console.log("Line 192",bookings);
    if (!bookings) return 0;
    let revenue = 0;
    bookings.forEach(booking => {
      revenue += booking.totalPrice || 0;
    });
    return revenue;
  }
  

  
  // Update useEffect
  useEffect(() => {
    if (userData) {
      setQuarterlyData(processUsersByQuarter(userData));
    }
    
    if (bookingData?.data) {
      const processedBookings = processBookingsByMonth(bookingData.data);
      setMonthlyData(processedBookings);
      setBookingStats(processBookingStatus(bookingData.data));
    }
  }, [userData, bookingData]);

  // Loading state
  const isLoading = isLoadingUsers || isLoadingBookings;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.contentContainer}>
        <h1 className={styles.sectionTitle}>Tổng quan</h1>
        <Overview
          totalUser={
              countUser(userData) >  1000 ? `${(countUser(userData) / 1000).toFixed(1)}K` : countUser(userData)
          }
          totalTransaction={countBooking(bookingData) >  1000 ? `${(countBooking(bookingData) / 1000).toFixed(1)}K` : countBooking(bookingData)}
          totalRevenue={countRevenue(bookingData) >  1000 ? `${(countRevenue(bookingData) / 1000).toFixed(1)}K` : countRevenue(bookingData)         + " VNĐ"}
          countViewer="10"
        />
        
        <h1 className={styles.sectionTitle}>Thống kê chi tiết</h1>
        <div className={styles.chartList}>
          <QuarterlyUsersChart 
            data={quarterlyData} 
            year={quarterlyData[0]?.quarter.split('/')[1]} 
          />
          <MonthlyBookingsChart data={monthlyData} />
          <MonthlyRevenueChart data={monthlyData} />
          <BookingStatusPieChart 
            data={bookingStats.data} 
            total={bookingStats.total} 
          />
        </div>

        {/* Bottom section with tables */}
        <div className={styles.listGroupContainer}>
          <div className={styles.listLovePlaceContainer}>
            <h1 className={styles.sectionTitle}>
              Top 5 địa điểm được yêu thích nhất
            </h1>
            <div className={styles.tableContainer}>
              <Table
                tableColumn={columnPlace}
                tableData={placeLove}
                isPagination={false}
              />
            </div>
          </div>

          <div className={styles.listReviewCustomerContainer}>
            <h1 className={styles.sectionTitle}>Đánh giá khách hàng</h1>
            <ReviewList itemLayout={"horizontal"} dataSource={reviewList} />
          </div>
        </div>
      </div>
    </>
  );
}

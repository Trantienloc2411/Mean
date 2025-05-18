import React, { useState, useEffect, useMemo } from "react";
import { Card, Typography, Row, Spin, Alert, Empty } from "antd";
import RevenueFilter from "./RevenueFilter";
import RevenueSummary from "./RevenueSummary";
import RevenueTable from "./RevenueTable";
import { useGetAllOwnerBookingsQuery } from "../../redux/services/bookingApi";
import { useNavigate } from "react-router-dom";

// Trong component

const { Title } = Typography;

const Revenue = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("month");
  const [dateRange, setDateRange] = useState([]);

  const {
    data: ownerBookingData,
    refetch,
    error,
    isLoading,
  } = useGetAllOwnerBookingsQuery();

  const processedData = useMemo(() => {
    console.log(ownerBookingData);

    if (!ownerBookingData?.owners?.length)
      return {
        tableData: [],
        summary: { totalRevenue: 0, totalPlatformFee: 0, totalOwnerProfit: 0 },
      };

    const PLATFORM_FEE_PERCENTAGE = 0.15;

    const filteredOwners = ownerBookingData.owners.map((owner) => {
      let filteredBookings = [...owner.bookings];

      if (dateRange && dateRange.length === 2) {
        const startDate = dateRange[0]?.startOf("day")?.valueOf();
        const endDate = dateRange[1]?.endOf("day")?.valueOf();

        if (startDate && endDate) {
          filteredBookings = filteredBookings.filter((booking) => {
            const bookingDate = new Date(booking.createdAt).getTime();
            return bookingDate >= startDate && bookingDate <= endDate;
          });
        }
      }

      return {
        ...owner,
        bookings: filteredBookings,
      };
    });

    // Calculate revenue statistics
    let totalRevenue = 0;
    let totalPlatformFee = 0;
    let totalOwnerProfit = 0;

    // Process data for table display
    const tableData = filteredOwners.map((owner, index) => {
      // Calculate revenue metrics for this owner
      const ownerRevenue = owner.bookings.reduce(
        (sum, booking) => sum + (booking.totalPrice || 0),
        0
      );

      const platformFee = Math.round(ownerRevenue * PLATFORM_FEE_PERCENTAGE);
      const ownerProfit = ownerRevenue - platformFee;

      // Accumulate totals
      totalRevenue += ownerRevenue;
      totalPlatformFee += platformFee;
      totalOwnerProfit += ownerProfit;

      // Format data for table display
      return {
        id: owner.ownerId,
        key: index.toString(),
        name: owner.ownerName,
        status: owner.bookings.length > 0 ? "ACTIVE" : "PENDING",
        revenue: ownerRevenue,
        platformFee: platformFee,
        bookingCount: owner.bookings.length,
      };
    });

    return {
      tableData,
      summary: {
        totalRevenue,
        totalPlatformFee,
        totalOwnerProfit,
      },
    };
  }, [ownerBookingData, dateRange]);

  // Handle view details
  const handleViewDetail = (ownerId) => {
    // console.log("View details for owner:", ownerId);
    // Add navigation or modal display logic here
    navigate(`/admin/revenue/owner/${ownerId}`);
  };

  // Refetch when filter changes
  useEffect(() => {
    refetch();
  }, [filterType, dateRange, refetch]);

  return (
    <div
      style={{
        padding: 30,
        background: "#f6f8fa",
        margin: 20,
        borderRadius: 20,
      }}
    >
      <Title level={3}>Thống kê doanh thu</Title>

      {isLoading ? (
        <Spin tip="Đang tải dữ liệu booking..." />
      ) : error ? (
        <Alert message="Lỗi khi tải dữ liệu booking" type="error" showIcon />
      ) : (
        <>
          <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: 16 }}>
            <RevenueFilter
              filterType={filterType}
              setFilterType={setFilterType}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </Card>

          <Row gutter={16} style={{ marginBottom: 24 }}>
            <RevenueSummary summary={processedData.summary} />
          </Row>

          <Card>
            {processedData.tableData.length > 0 ? (
              <RevenueTable
                data={processedData.tableData}
                handleViewDetail={handleViewDetail}
              />
            ) : (
              <Empty description="Không có dữ liệu doanh thu trong khoảng thời gian đã chọn" />
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default Revenue;

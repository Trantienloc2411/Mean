import React, { useState, useEffect, useMemo } from "react";
import { Card, Typography, Row, Spin, Alert, Empty } from "antd";
import RevenueFilter from "./RevenueFilter";
import RevenueSummary from "./RevenueSummary";
import RevenueTable from "./RevenueTable";
import { useGetAllOwnerBookingsQuery } from "../../redux/services/bookingApi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useGetPolicyByHashtagQuery } from "../../redux/services/policySystemApi";

const { Title } = Typography;
const COMPLETED_STATUS = 7;

const Revenue = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(null); // chỉ 1 tháng được chọn

  const {
    data: ownerBookingData,
    refetch,
    error,
    isLoading,
  } = useGetAllOwnerBookingsQuery();
  const { data: policyPrice } = useGetPolicyByHashtagQuery("phihethong");

  const processedData = useMemo(() => {
    if (!ownerBookingData?.owners?.length)
      return {
        tableData: [],
        summary: { totalRevenue: 0, totalPlatformFee: 0, totalOwnerProfit: 0 },
      };

    const PLATFORM_FEE_PERCENTAGE = parseFloat(
      policyPrice?.data?.[0]?.values?.[0]?.val || "0.1"
    );
    const filteredOwners = ownerBookingData.owners.map((owner) => {
      // Lọc booking đã hoàn tất và đã thanh toán
      let filteredBookings = owner.bookings.filter(
        (booking) => booking.paymentStatus === 3
        // booking.status === COMPLETED_STATUS || booking.paymentStatus === 3
      );

      if (date) {
        const startDate = dayjs(date).startOf("month").valueOf();
        const endDate = dayjs(date).endOf("month").valueOf();

        filteredBookings = filteredBookings.filter((booking) => {
          const bookingDate = new Date(booking.createdAt).getTime();
          return bookingDate >= startDate && bookingDate <= endDate;
        });
      }

      return {
        ...owner,
        bookings: filteredBookings,
      };
    });

    let totalRevenue = 0;
    let totalPlatformFee = 0;
    let totalOwnerProfit = 0;

    const tableData = filteredOwners.map((owner, index) => {
      const ownerRevenue = owner.bookings.reduce(
        (sum, booking) => sum + (booking.totalPrice || 0),
        0
      );
      const platformFee = Math.round(ownerRevenue * PLATFORM_FEE_PERCENTAGE);
      const ownerProfit = ownerRevenue - platformFee;

      totalRevenue += ownerRevenue;
      totalPlatformFee += platformFee;
      totalOwnerProfit += ownerProfit;

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
  }, [ownerBookingData, date, policyPrice]);

  const handleViewDetail = (ownerId) => {
    navigate(`/admin/revenue/owner/${ownerId}`);
  };

  useEffect(() => {
    refetch();
  }, [date, refetch]);

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
            <RevenueFilter date={date} setDate={setDate} />
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
              <Empty description="Không có dữ liệu doanh thu trong tháng đã chọn" />
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default Revenue;

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DatePicker, Button, Tabs, message } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import viVN from "antd/es/date-picker/locale/vi_VN";
import { useGetBookingsByOwnerIdQuery } from "../../../redux/services/bookingApi";
import {
  useCreateTransactionMutation,
  useGetAllTransactionByOwnerQuery,
  useUpdateTransactionMutation,
} from "../../../redux/services/transactionApi";
import RevenueSummary from "./RevenueSummary";
import BookingTable from "./BookingTable";
import TransactionTable from "./TransactionTable";

import TransactionModal from "./TransactionModal";
import {
  useGetOwnerByIdQuery,
  useGetOwnerDetailByUserIdQuery,
} from "../../../redux/services/ownerApi";
import { useGetPolicyByHashtagQuery } from "../../../redux/services/policySystemApi";
import { ReloadOutlined } from "@ant-design/icons";

dayjs.extend(isBetween);
const { MonthPicker } = DatePicker;

const BOOKING_STATUS_MAP = {
  1: "CONFIRMED",
  2: "NEEDCHECKIN",
  3: "CHECKEDIN",
  4: "NEEDCHECKOUT",
  5: "CHECKEDOUT",
  6: "CANCELLED",
  7: "COMPLETED",
  8: "PENDING",
  9: "REFUND",
};
const PAYMENT_STATUS_MAP = {
  1: "BOOKING",
  2: "PENDING",
  3: "PAID",
  4: "REFUND",
  5: "FAILED",
};

export default function OwnerRevenuePage() {
  const { id } = useParams();
  const [date, setDate] = useState(dayjs());
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterTransaction, setFilterTransaction] = useState([]);
  const [isTransferring, setIsTransferring] = useState(false);
  const [createTransaction] = useCreateTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const {
    data: bookings = [],
    isLoading,
    refetch: refetchBookings,
  } = useGetBookingsByOwnerIdQuery(id);

  const { data: transactions, refetch: refetchTransactions } =
    useGetAllTransactionByOwnerQuery(id);
  const { data: userOwner } = useGetOwnerByIdQuery(id);
  const { data: ownerDetail } = useGetOwnerDetailByUserIdQuery(
    userOwner?.userId
  );

  const { data: policyPrice } = useGetPolicyByHashtagQuery("phihethong");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!transactions) return;
    const start = date.startOf("month");
    const end = date.endOf("month");

    const filtered = transactions?.data.filter((t) =>
      dayjs(t.transactionCreatedDate, "DD/MM/YYYY HH:mm:ss").isBetween(
        start,
        end,
        null,
        "[]"
      )
    );

    setFilterTransaction(filtered);
  }, [transactions, date]);

  useEffect(() => {
    if (!bookings || bookings.length === 0) return;
    const start = date.startOf("month");
    const end = date.endOf("month");

    const filtered = bookings.filter((b) =>
      dayjs(b.createdAt, "DD/MM/YYYY HH:mm:ss").isBetween(
        start,
        end,
        null,
        "[]"
      )
    );

    setFilteredBookings(filtered);
  }, [bookings, date]);

  const summary = useMemo(() => {
    let totalRevenue = 0;
    let totalRefundAmount = 0;
    let totalCancelledAmount = 0;

    let successCount = 0;
    let cancelledCount = 0;
    let refundCount = 0;
    let pendingCount = 0;
    let bookingCount = 0;

    let ownerEarnings = 0;
    let platformFeeTotal = 0;

    const platformFee = parseFloat(
      policyPrice?.data?.[0]?.values?.[0]?.val || "0.1"
    );

    filteredBookings.forEach((b) => {
      const statusText = BOOKING_STATUS_MAP[b.status];
      const paymentStatusText = PAYMENT_STATUS_MAP[b.paymentStatus];
      bookingCount += 1;

      if (paymentStatusText === "PAID") {
        totalRevenue += b.totalPrice;
        const fee = b.totalPrice * (platformFee / 100);
        ownerEarnings += b.totalPrice - fee;
        platformFeeTotal += fee;
        successCount += 1;
      } else if (statusText === "CANCELLED") {
        totalCancelledAmount += b.totalPrice;
        cancelledCount += 1;
      } else if (statusText === "REFUND") {
        totalRefundAmount += b.totalPrice;
        refundCount += 1;
      } else if (statusText === "PENDING") {
        pendingCount += 1;
      }
    });

    return {
      totalRevenue,
      totalRefundAmount,
      totalCancelledAmount,
      ownerEarnings,
      platformFeeTotal,
      bookingCount,
      successCount,
      cancelledCount,
      refundCount,
      pendingCount,
    };
  }, [filteredBookings, policyPrice]);

  // const handleTransfer = async () => {
  //   setIsTransferring(true);

  //   try {
  //     const response = await createTransaction({
  //       ownerId: id,
  //       paymentCode: `PAY${Date.now()}`, // Tạo mã giao dịch ngẫu nhiên
  //       transactionEndDate: null,
  //       transactionStatus: 1,
  //       description: `Payment for owner ${id} in ${date.format("MM/YYYY")}`,
  //       typeTransaction: null,
  //       amount: summary.ownerEarnings,
  //     }).unwrap();

  //     message.success("Chuyển tiền cho Owner thành công!");
  //   } catch (error) {
  //     console.error("Lỗi khi chuyển tiền:", error);
  //     message.error("Chuyển tiền thất bại!");
  //   } finally {
  //     setIsTransferring(false);
  //   }
  // };
  return (
    <div
      style={{
        padding: 30,
        background: "#f6f8fa",
        margin: 20,
        borderRadius: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>
          Chi tiết doanh thu{" "}
          <span style={{ fontWeight: 700 }}>
            {ownerDetail?.userId?.fullName || "Không rõ"}
          </span>
        </h1>

        <div style={{ display: "flex", gap: 12 }}>
          <MonthPicker
            value={date}
            onChange={(val) => {
              if (val) setDate(val);
            }}
            locale={viVN}
            format="MM/YYYY"
            placeholder="Chọn tháng"
            allowClear={false}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              refetchBookings();
              refetchTransactions();
              message.success("Tải lại dữ liệu thành công!");
            }}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            disabled={summary.totalRevenue === 0}
          >
            Chuyển tiền ({date.format("MM/YYYY")})
          </Button>
        </div>
      </div>
      <RevenueSummary summary={summary} />

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Giao dịch" key="1">
          <TransactionTable
            onUpdateStatus={updateTransaction}
            transactions={filterTransaction}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Đơn đặt phòng" key="2">
          <BookingTable bookings={filteredBookings} loading={isLoading} />
        </Tabs.TabPane>
      </Tabs>

      <TransactionModal
        ownerDetail={ownerDetail}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={async (values, resetForm) => {
          const selectedMonth = date.month(); // 0-indexed
          const selectedYear = date.year();
          const now = dayjs();

          const currentMonth = now.month();
          const currentYear = now.year();

          if (selectedMonth === currentMonth && selectedYear === currentYear) {
            message.warning("Không thể tạo giao dịch trong tháng hiện tại!");
            return;
          }
          setIsTransferring(true);

          try {
            await createTransaction({
              ...values,
              ownerId: id,
              transactionStatus: 2,
              transactionEndDate: null,
              typeTransaction: 3,
            }).unwrap();
            message.success("Tạo giao dịch thành công!");
            setIsModalOpen(false);
            resetForm();
          } catch (error) {
            message.error("Tạo giao dịch thất bại!");
          } finally {
            setIsTransferring(false);
          }
        }}
        isLoading={isTransferring}
        summary={summary}
        policyPlatformFee={{
          policyPrice: policyPrice?.data?.[0]?.values?.[0]?.val || "0.1",
          namePolicy: policyPrice?.data?.[0]?.name,
          description: policyPrice?.data?.[0]?.description,
          unit: policyPrice?.data?.[0]?.values?.[0]?.unit,
        }}
        ownerBankInfo={{
          ownerName: ownerDetail?.userId?.fullName || "Không rõ",
          bankAccount:
            ownerDetail?.paymentInformationId?.bankAccountName || "Không rõ",
          bankName: ownerDetail?.paymentInformationId?.bankName || "Không rõ",
          bankNo: ownerDetail?.paymentInformationId?.bankNo || "Không rõ",
        }}
        ownerId={id}
      />
    </div>
  );
}

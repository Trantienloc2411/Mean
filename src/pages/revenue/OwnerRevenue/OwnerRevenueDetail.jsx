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

dayjs.extend(isBetween);
const { MonthPicker } = DatePicker;

const BOOKING_STATUS_MAP = {
  1: "PENDING",
  2: "WAITING_FOR_CHECK_IN",
  3: "USING",
  4: "WAITING_FOR_CHECK_OUT",
  5: "CHECKED_OUT",
  6: "CANCELLED_BY_CUSTOMER",
  7: "CANCELLED_BY_OWNER",
  8: "REJECTED",
  9: "COMPLETED",
};

export default function OwnerRevenuePage() {
  const { id } = useParams();
  const [date, setDate] = useState(dayjs());
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterTransaction, setFilterTransaction] = useState([]);
  const [isTransferring, setIsTransferring] = useState(false);
  const [createTransaction] = useCreateTransactionMutation();
  const { data: bookings = [], isLoading } = useGetBookingsByOwnerIdQuery(id);
  const { data: transactions } = useGetAllTransactionByOwnerQuery(id);
  const { data: userOwner } = useGetOwnerByIdQuery(id);
  const { data: ownerDetail } = useGetOwnerDetailByUserIdQuery(
    userOwner?.userId
  );

  const { data: policyPrice } = useGetPolicyByHashtagQuery("phihethong");
  console.log("policyPrice", policyPrice);

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
      dayjs(b.checkIn).isBetween(start, end, null, "[]")
    );

    setFilteredBookings(filtered);
  }, [bookings, date]);
  const summary = useMemo(() => {
    let totalRevenue = 0;
    let totalCancelled = 0;
    let bookingCount = 0;
    let successCount = 0;
    let cancelledCount = 0;
    let ownerEarnings = 0;
    let platformFeeTotal = 0;

    // Lấy phí nền tảng từ policy, fallback là 0.1 nếu chưa có dữ liệu
    const platformFee = parseFloat(
      policyPrice?.data?.[0]?.values?.[0]?.val || "0.1"
    );

    filteredBookings.forEach((b) => {
      const statusText = BOOKING_STATUS_MAP[b.status];
      if (statusText === "COMPLETED") {
        totalRevenue += b.totalPrice;
        successCount += 1;
        ownerEarnings += b.totalPrice * (1 - platformFee);
        platformFeeTotal += b.totalPrice * platformFee;
        bookingCount += 1;
      } else if (
        statusText === "CANCELLED_BY_CUSTOMER" ||
        statusText === "CANCELLED_BY_OWNER"
      ) {
        totalCancelled += b.totalPrice;
        cancelledCount += 1;
        bookingCount += 1;
      }
    });

    return {
      totalRevenue,
      totalCancelled,
      successCount,
      cancelledCount,
      ownerEarnings,
      platformFeeTotal,
      bookingCount,
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
            type="primary"
            onClick={() => setIsModalOpen(true)}
            disabled={summary.totalRevenue === 0}
          >
            Chuyển tiền ({date.format("MM/YYYY")})
          </Button>
        </div>
      </div>

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Giao dịch" key="1">
          <RevenueSummary summary={summary} />
          <TransactionTable transactions={filterTransaction} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Đơn đặt phòng" key="2">
          <RevenueSummary summary={summary} />
          <BookingTable bookings={filteredBookings} loading={isLoading} />
        </Tabs.TabPane>
      </Tabs>

      <TransactionModal
        ownerDetail={ownerDetail}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={async (values, resetForm) => {
          setIsTransferring(true);
          try {
            await createTransaction({
              ...values,
              ownerId: id,
              transactionStatus: true,
              transactionEndDate: null,
              typeTransaction: null,
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

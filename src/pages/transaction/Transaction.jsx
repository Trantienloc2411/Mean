import { useState } from "react";
import { Button, Input } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import TransactionTable from "./components/TransactionTable";
import FilterModal from "./components/FilterModal";
import OverviewTransaction from "./components/OverviewTransaction";
import styles from "./Transaction.module.scss";
import { useGetAllTransactionQuery } from "../../redux/services/transactionApi";
export default function Transaction() {
  const [searchValue, setSearchValue] = useState(""); // Tìm kiếm theo mã giao dịch hoặc mã đặt phòng
  const [filters, setFilters] = useState({
    statuses: [], // Lọc theo trạng thái
    transactionTypes: [], // Lọc theo loại giao dịch
  });

  const { data: transactionData } = useGetAllTransactionQuery();
  const convertTransactionData = (data) => {
    return (
      data?.map((item) => ({
        id: item._id,
        transactionCode: item.paymentCode,
        bookingCode: item.bookingId,
        createTime: item.transactionCreatedDate,
        endTime: item.transactionEndDate,
        price: `${item.amount.toLocaleString("vi-VN")} VND`,
        status: convertStatus(item.transactionStatus),
        typeTransaction: convertType(item.typeTransaction),
      })) || []
    );
  };

  const convertStatus = (statusCode) => {
    switch (statusCode) {
      case 1:
        return { en: "PENDING", vi: "Đang xử lý" };
      case 2:
        return { en: "COMPLETED", vi: "Hoàn thành" };
      case 3:
        return { en: "FAILED", vi: "Thất bại" };
      default:
        return { en: "unknown", vi: "Không xác định" };
    }
  };

  const convertType = (typeCode) => {
    switch (typeCode) {
      case 1:
        return { en: "MOMO_PAYMENT", vi: "Thanh toán MoMo" };
      default:
        return { en: "unknown", vi: "Không xác định" };
    }
  };
  console.log(transactionData);

  const transformedData = convertTransactionData(transactionData?.data);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const openFilterModal = () => setIsFilterModalVisible(true);
  const closeFilterModal = () => setIsFilterModalVisible(false);

  // Dữ liệu mock cho trạng thái và loại giao dịch (tiếng Anh)
  const statuses = [
    { en: "PENDING", vi: "Đang xử lý" },
    { en: "COMPLETED", vi: "Hoàn thành" },
    { en: "FAILED", vi: "Thất bại" }
  ];
  const transactionTypes = [
    { en: "MOMO_PAYMENT", vi: "Thanh toán MoMo" }
  ];

  // Hàm lọc dữ liệu
  const filteredData = transformedData.filter((item) => {
    const isStatusMatch =
      filters.statuses.length === 0 || filters.statuses.includes(item.status.en);
    const isTypeMatch =
      filters.transactionTypes.length === 0 ||
      filters.transactionTypes.includes(item.typeTransaction.en);
    const isSearchMatch =
      item.transactionCode.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.bookingCode.toLowerCase().includes(searchValue.toLowerCase());

    return isStatusMatch && isTypeMatch && isSearchMatch;
  });

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (key, updatedValues) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: updatedValues,
    }));
  };

  // Reset bộ lọc
  const handleReset = () => {
    setFilters({
      statuses: [],
      transactionTypes: [],
    });
  };

  const transactionOverviewData = {
    totalTransaction: transformedData.length,
    pendingCount: transformedData.filter((item) => item.status.en === "PENDING")
      .length,
    completedCount: transformedData.filter(
      (item) => item.status.en === "COMPLETED"
    ).length,
    failedCount: transformedData.filter((item) => item.status.en === "FAILED")
      .length,
    momoPaymentCount: transformedData.filter(
      (item) => item.typeTransaction.en === "MOMO_PAYMENT"
    ).length,
  };

  return (
    <div className={styles.contentContainer}>
      <h1 className={styles.sectionTitle}>Quản lý giao dịch</h1>
      <div className={styles.overviewSection}>
        <OverviewTransaction
          transactionOverviewData={transactionOverviewData}
        />
      </div>
      <div className={styles.transactionSection}>
        <h1 className={styles.sectionTitle}>Lịch sử giao dịch</h1>
        <div className={styles.contentTable}>
          <Flex gap={30}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm bằng mã giao dịch hoặc mã đặt phòng"
              className={styles.searchInput}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button onClick={openFilterModal}>
              <FilterOutlined />
              Lọc
            </Button>
          </Flex>
          <TransactionTable data={filteredData} />
        </div>
      </div>
      {/* Modal lọc */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={closeFilterModal}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        statuses={statuses}
        transactionTypes={transactionTypes}
      />
    </div>
  );
}

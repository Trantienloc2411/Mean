import { useState } from "react";
import { Button, Input, message } from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Flex } from "antd";
import TransactionTable from "./components/TransactionTable";
import FilterModal from "./components/FilterModal";
import OverviewTransaction from "./components/OverviewTransaction";
import styles from "./Transaction.module.scss";
import { useGetAllTransactionQuery } from "../../redux/services/transactionApi";
import { Dropdown } from "antd";

export default function Transaction() {
  const [searchValue, setSearchValue] = useState(""); // Tìm kiếm theo mã giao dịch hoặc mã đặt phòng
  const [filters, setFilters] = useState({
    statuses: [], // Lọc theo trạng thái
    transactionTypes: [], // Lọc theo loại giao dịch
  });
  const [isReloading, setIsReloading] = useState(false);

  const {
    data: transactionData,
    isLoading,
    refetch,
  } = useGetAllTransactionQuery();
  const convertTransactionData = (data) => {
    return (
      data?.map((item) => ({
        id: item._id,
        transactionCode: item.paymentCode,
        bookingCode: item.bookingId,
        ownerId: item.ownerId,
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
    { en: "FAILED", vi: "Thất bại" },
  ];
  const transactionTypes = [{ en: "MOMO_PAYMENT", vi: "Thanh toán MoMo" }];

  // Hàm lọc dữ liệu
  const filteredData = transformedData.filter((item) => {
    const isStatusMatch =
      filters.statuses.length === 0 ||
      filters.statuses.includes(item.status.en);
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

  const handleReload = async () => {
    try {
      setIsReloading(true);
      await refetch();
      message.success("Dữ liệu đã được làm mới");
    } catch (error) {
      message.error("Làm mới dữ liệu thất bại");
    } finally {
      setIsReloading(false);
    }
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

  const transactionStatusInfo = (
    <div className={styles.statusDescriptionPopover}>
      {/* <div className={styles.descriptionSection}>
        <h4>Trạng thái giao dịch</h4>
        <div className={styles.descriptionItem}>
          <span className={`${styles.statusDot} ${styles.pending}`} />
          <div>
            <div className={styles.descriptionTitle}>PENDING</div>
            <div className={styles.descriptionText}>
              Giao dịch đang được xử lý.
            </div>
          </div>
        </div>
        <div className={styles.descriptionItem}>
          <span className={`${styles.statusDot} ${styles.completed}`} />
          <div>
            <div className={styles.descriptionTitle}>COMPLETED</div>
            <div className={styles.descriptionText}>
              Giao dịch đã hoàn tất thành công.
            </div>
          </div>
        </div>
        <div className={styles.descriptionItem}>
          <span className={`${styles.statusDot} ${styles.failed}`} />
          <div>
            <div className={styles.descriptionTitle}>FAILED</div>
            <div className={styles.descriptionText}>
              Giao dịch thất bại hoặc bị hủy.
            </div>
          </div>
        </div>
      </div> */}

      <div className={styles.descriptionSection}>
        <h4>Loại giao dịch</h4>
        <div className={styles.descriptionItem}>
          <span className={`${styles.statusDot} ${styles.momo}`} />
          <div>
            <div className={styles.descriptionTitle}>MOMO</div>
            <div className={styles.descriptionText}>
              Thanh toán bằng ví MoMo cho Booking.
            </div>
          </div>
        </div>
        <div className={styles.descriptionItem}>
          <span className={`${styles.statusDot} ${styles.payOwner}`} />
          <div>
            <div className={styles.descriptionTitle}>PAY_OWNER</div>
            <div className={styles.descriptionText}>
              Hệ thống chuyển doanh thu cho chủ phòng.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
          <Flex gap={15} justify="space-between">
            <Flex gap={15}>
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
              <Button
                icon={<ReloadOutlined spin={isReloading} />}
                onClick={handleReload}
                loading={isReloading}
              >
                Làm mới
              </Button>
            </Flex>
            <Dropdown
              overlay={transactionStatusInfo}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                className={styles.infoButton}
                icon={<InfoCircleOutlined />}
              >
                Thông tin trạng thái
              </Button>
            </Dropdown>
          </Flex>
          <TransactionTable
            data={filteredData}
            loading={isLoading || isReloading}
          />
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

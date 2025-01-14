import { useState } from "react";
import { Button, Input } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import TransactionTable from "./components/TransactionTable";
import FilterModal from "./components/FilterModal";
import OverviewTransaction from "./components/OverviewTransaction";

export default function Transaction() {
  const [searchValue, setSearchValue] = useState(""); // Tìm kiếm theo mã giao dịch hoặc mã đặt phòng
  const [filters, setFilters] = useState({
    statuses: [], // Lọc theo trạng thái
    transactionTypes: [], // Lọc theo loại giao dịch
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const openFilterModal = () => setIsFilterModalVisible(true);
  const closeFilterModal = () => setIsFilterModalVisible(false);

  const data = [
    {
      id: 1,
      transactionCode: "TX123456",
      bookingCode: "BC98765",
      createTime: "2025-01-14 10:00",
      endTime: "2025-01-14 12:00",
      price: "500,000 VND",
      status: "active",
      typeTransaction: "Thanh toán cuối",
    },
    {
      id: 2,
      transactionCode: "TX234567",
      bookingCode: "BC87654",
      createTime: "2025-01-13 11:00",
      endTime: "2025-01-13 13:00",
      price: "1,000,000 VND",
      status: "pending",
      typeTransaction: "Hoàn tiền",
    },
    {
      id: 3,
      transactionCode: "TX345678",
      bookingCode: "BC76543",
      createTime: "2025-01-12 09:00",
      endTime: "2025-01-12 11:00",
      price: "200,000 VND",
      status: "cancel",
      typeTransaction: "Trả full",
    },
    {
      id: 4,
      transactionCode: "TX456789",
      bookingCode: "BC65432",
      createTime: "2025-01-11 15:00",
      endTime: "2025-01-11 16:00",
      price: "750,000 VND",
      status: "active",
      typeTransaction: "Tiền cọc",
    },
  ];

  // Dữ liệu mock cho trạng thái và loại giao dịch (tiếng Anh)
  const statuses = ["Hoạt động", "Chờ xác nhận", "Hủy"];
  const transactionTypes = [
    "Tiền cọc",
    "Trả full",
    "Hoàn tiền",
    "Thanh toán cuối",
  ];

  // Hàm lọc dữ liệu
  const filteredData = data.filter((item) => {
    const isStatusMatch =
      filters.statuses.length === 0 || filters.statuses.includes(item.status);
    const isTypeMatch =
      filters.transactionTypes.length === 0 ||
      filters.transactionTypes.includes(item.typeTransaction);
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

  return (
    <div style={{ padding: "10px 20px" }}>
      <h1 style={{ fontSize: 32 }}>Quản lý giao dịch</h1>
      <div>
        <OverviewTransaction />
      </div>
      <div style={{ marginTop: 10 }}>
        <h1 style={{ fontSize: 20 }}>Lịch sử giao dịch</h1>
        <div style={{ padding: "20px", background: "#fff", borderRadius: 20 }}>
          <Flex gap={30}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm bằng mã giao dịch hoặc mã đặt phòng"
              style={{ width: 300, marginBottom: 20 }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button onClick={openFilterModal}>
              <FilterOutlined />
              Bộ lọc
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

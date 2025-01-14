import { useState, useEffect } from "react";
import { Button, Input } from "antd";
import OverviewTransaction from "./components/OverviewTransaction";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import TransactionTable from "./components/TransactionTable";
import FilterModal from "./components/FilterModal";

export default function Transaction() {
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const openFilterModal = () => setIsFilterModalVisible(true);
  const closeFilterModal = () => setIsFilterModalVisible(false);

  return (
    <div style={{ padding: "10px 20px" }}>
      <h1 style={{ fontSize: 32 }}>Quản lý giao dịch</h1>
      <div>
        <OverviewTransaction />
      </div>
      <div style={{ marginTop: 20 }}>
        <h1 style={{ fontSize: 20 }}>Lịch sử giao dịch</h1>
        <Flex gap={30}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm bằng số điện thoại"
            style={{ width: 300, marginBottom: 20 }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button onClick={openFilterModal}>
            <FilterOutlined />
            Bộ lọc
          </Button>
        </Flex>
        <TransactionTable data={filteredUsers} />
      </div>
      {/* <FilterModal
        visible={isFilterModalVisible}
        onClose={closeFilterModal}
        filters={selectedFilters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      /> */}
    </div>
  );
}

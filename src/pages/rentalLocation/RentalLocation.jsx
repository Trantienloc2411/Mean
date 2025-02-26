import { useState, useEffect } from "react";
import { Input } from "antd";
import { Flex } from "antd";
import OverviewLocation from "./components/OverviewLocation";
import { SearchOutlined } from "@ant-design/icons";
import RentalLocationTable from "./components/RentalLocationTable";
import FilterRentalLocation from "./components/FilterRentalLocation";
import { useGetAllRentalLocationQuery } from "../../redux/services/rentalApi";

export default function RentalLocation() {
  const { data, isLoading } = useGetAllRentalLocationQuery();
  const allLocations = data?.success ? data.data : [];

  const [searchValue, setSearchValue] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);

  const [filters, setFilters] = useState({ statuses: [] });
  useEffect(() => {
    setFilteredLocations(allLocations);
  }, [allLocations]);

  const handleSearch = (value) => {
    setSearchValue(value);
    applyFilters(value, filters);
  };

  const handleFilterChange = (key, values) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
    applyFilters(searchValue, { ...filters, [key]: values });
  };

  const applyFilters = (search, filterValues) => {
    const filtered = allLocations.filter((location) => {
      const matchesSearch = location.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        filterValues.statuses.length === 0 ||
        filterValues.statuses.includes(location.status);
      return matchesSearch && matchesStatus;
    });
    setFilteredLocations(filtered);
  };

  const handleResetFilters = () => {
    setFilters({ statuses: [] });
    setFilteredLocations(allLocations);
    setSearchValue("");
  };
  console.log(filteredLocations);

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý địa điểm</h1>
      <OverviewLocation />
      <div style={{ marginTop: 20 }}>
        <h1 style={{ fontSize: 20 }}>Danh sách địa điểm</h1>
        <div style={{ background: "#fff", borderRadius: 20, padding: 20 }}>
          <Flex gap={20}>
            <div>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm bằng tên địa điểm"
                style={{ width: 300, marginBottom: 10 }}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <FilterRentalLocation
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              onApplyFilters={() => applyFilters(searchValue, filters)}
            />
          </Flex>
          {/* Truyền toàn bộ dữ liệu vào table */}
          <RentalLocationTable data={filteredLocations} loading={isLoading} />
        </div>
      </div>
    </div>
  );
}

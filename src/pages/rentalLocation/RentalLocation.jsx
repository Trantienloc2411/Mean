import { useState, useEffect } from "react";
import { Button, Input } from "antd";
import { Flex } from "antd"; // Nếu không tồn tại, cần dùng styled-components hoặc CSS cho layout
import OverviewLocation from "./components/OverviewLocation";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import RentalLocationTable from "./components/RentalLocationTable";
import FilterRentalLocation from "./components/FilterRentalLocation";

export default function RentalLocation() {
  const [searchValue, setSearchValue] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    statuses: [],
  });

  useEffect(() => {
    // Fetch initial data
    fetchRentalLocations();
  }, []);

  const fetchRentalLocations = async () => {
    setIsLoading(true);
    try {
      // Dữ liệu tạm
      const data = [
        {
          id: 1,
          name: "Địa điểm A",
          representative: "Nguyễn Văn A",
          address: "123 Đường ABC, Quận 1",
          roomCount: 10,
          status: "Active",
        },
        {
          id: 2,
          name: "Địa điểm B",
          representative: "Trần Văn B",
          address: "456 Đường XYZ, Quận 2",
          roomCount: 5,
          status: "Paused",
        },
        {
          id: 3,
          name: "Địa điểm C",
          representative: "Lê Thị C",
          address: "789 Đường LMN, Quận 3",
          roomCount: 15,
          status: "Locked",
        },
      ];
      setAllLocations(data);
      setFilteredLocations(data);
    } catch (error) {
      console.error("Error fetching rental locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

          <RentalLocationTable data={filteredLocations} loading={isLoading} />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button, Input } from "antd";
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


  const fetchRentalLocations = async () => {
    setIsLoading(true);
    try {
      // Dữ liệu tạm
      const data = [
        { id: 1, name: "Ocean View Hotel", representative: "John Smith", address: "12 Beach Road, Miami, FL", roomCount: 45, status: "Active" },
        { id: 2, name: "Green Leaf Lodge", representative: "Lisa Brown", address: "34 Elm Street, Seattle, WA", roomCount: 23, status: "Pending" },
        { id: 3, name: "Sunset Inn", representative: "Mark Johnson", address: "78 Sunset Blvd, Los Angeles, CA", roomCount: 67, status: "Active" },
        { id: 4, name: "Cozy Stay", representative: "Sarah Adams", address: "90 Maple Ave, Denver, CO", roomCount: 12, status: "UnderReview" },
        { id: 5, name: "Grand Stay", representative: "Robert Wilson", address: "101 Broadway, New York, NY", roomCount: 98, status: "Suspended" },
        { id: 6, name: "Comfort Haven", representative: "Emily Davis", address: "303 Lakeview Dr, Chicago, IL", roomCount: 37, status: "Active" },
        { id: 7, name: "Moonlight Hotel", representative: "Kevin White", address: "505 Ocean Dr, San Diego, CA", roomCount: 82, status: "Inactive" },
        { id: 8, name: "Serene Nights", representative: "David Clark", address: "606 Pine Street, San Francisco, CA", roomCount: 55, status: "Active" },
        { id: 9, name: "Paradise Resort", representative: "Olivia Harris", address: "707 Grand Ave, Orlando, FL", roomCount: 42, status: "Pending" },
        { id: 10, name: "Dream Stay", representative: "Daniel Martinez", address: "808 King Street, Boston, MA", roomCount: 29, status: "Active" },
        { id: 11, name: "Elite Rooms", representative: "Jessica Moore", address: "909 Queen Street, Toronto, ON", roomCount: 75, status: "UnderReview" },
        { id: 12, name: "Urban Escape", representative: "Ryan Thomas", address: "123 River Road, Austin, TX", roomCount: 64, status: "Suspended" },
        { id: 13, name: "Tranquil Nest", representative: "Hannah Green", address: "234 Park Lane, Portland, OR", roomCount: 48, status: "Active" },
        { id: 14, name: "Breeze Lodge", representative: "Andrew Walker", address: "567 Cypress Ave, Atlanta, GA", roomCount: 20, status: "Pending" },
        { id: 15, name: "Cozy Corner", representative: "Megan Lewis", address: "678 Magnolia St, Houston, TX", roomCount: 14, status: "Inactive" },
        { id: 16, name: "Sunset Retreat", representative: "Christopher King", address: "789 Palm Road, Tampa, FL", roomCount: 91, status: "Active" },
        { id: 17, name: "Starry Nights", representative: "Sophia Hall", address: "890 Redwood Dr, Nashville, TN", roomCount: 33, status: "Active" },
        { id: 18, name: "Skyline Hotel", representative: "Matthew Allen", address: "910 Cedar Way, Philadelphia, PA", roomCount: 77, status: "UnderReview" },
        { id: 19, name: "Cloud Nine Inn", representative: "Chloe Scott", address: "112 Birch St, Las Vegas, NV", roomCount: 39, status: "Suspended" },
        { id: 20, name: "Harbor View", representative: "Ethan Lopez", address: "221 Sunset Pier, Charleston, SC", roomCount: 50, status: "Active" },
      ];
      setAllLocations(data);
      setFilteredLocations(data);
    } catch (error) {
      console.error("Error fetching rental locations:", error);
    } finally {
      setIsLoading(false);
    }
  };
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

import { useState, useEffect } from "react";
import FilterSection from "./components/FilterSection";
import RentalLocationList from "./components/RentalLocationList";
import { useGetAllRentalLocationQuery } from "../../../../redux/services/rentalApi";

export default function RentalLocation() {
  const {
    data: rentalData,
    isLoading,
    isError,
  } = useGetAllRentalLocationQuery();

  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    statuses: [],
  });
  const [rentalLocations, setRentalLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  // Khi có dữ liệu từ API, cập nhật vào state
  useEffect(() => {
    if (rentalData?.data) {
      setRentalLocations(rentalData.data);
      setFilteredLocations(rentalData.data);
    }
  }, [rentalData]);

  console.log (rentalData);
  const handleSearch = (value) => {
    setSearchValue(value);
    applyFilters(value, filters);
  };

  const handleFilterChange = (status) => {
    const updatedStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];

    setFilters({ statuses: updatedStatuses });
    applyFilters(searchValue, { statuses: updatedStatuses });
  };

  const applyFilters = (search, filterValues) => {
    const filtered = rentalLocations.filter((location) => {
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

  // if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error loading rental locations.</p>;

  return (
    <div>
      <h2>Địa điểm cho thuê</h2>
      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        <FilterSection
          searchValue={searchValue}
          filters={filters}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
        <RentalLocationList locations={filteredLocations} />
      </div>
    </div>
  );
}
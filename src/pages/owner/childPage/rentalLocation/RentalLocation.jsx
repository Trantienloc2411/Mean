import { useState } from "react";
import FilterSection from "./components/FilterSection";
import RentalLocationList from "./components/RentalLocationList";
import { useEffect } from "react";
export default function RentalLocation() {
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    statuses: [],
  });
  const [rentalLocations, setRentalLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  useEffect(() => {
    // Dữ liệu mẫu
    const data = [
      {
        id: 1,
        name: "Địa điểm A",
        address: "123 Đường ABC, Quận 1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwYgiVoOmUOj4hQwS1JUACNUmk5eBphBUDjA&s",
        rating: 4.5,
        openHours: "8:00 - 22:00",
        status: "Active",
      },
      {
        id: 2,
        name: "Địa điểm B",
        address: "456 Đường XYZ, Quận 2",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwYgiVoOmUOj4hQwS1JUACNUmk5eBphBUDjA&s",
        rating: 4.0,
        openHours: "9:00 - 21:00",
        status: "Paused",
      },
      {
        id: 3,
        name: "Địa điểm C",
        address: "789 Đường LMN, Quận 3",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwYgiVoOmUOj4hQwS1JUACNUmk5eBphBUDjA&s",
        rating: 3.5,
        openHours: "7:00 - 20:00",
        status: "Locked",
      },
    ];
    setRentalLocations(data);
    setFilteredLocations(data);
  }, []);

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

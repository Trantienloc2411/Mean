import { useState, useEffect } from "react";
import FilterSection from "./components/FilterSection";
import RentalLocationList from "./components/RentalLocationList";
import { useParams } from "react-router-dom";
import { useGetRentalLocationByOwnerIdQuery } from "../../../../redux/services/rentalApi";
import { useGetOwnerDetailByUserIdQuery } from "../../../../redux/services/ownerApi";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Image } from "antd";

export default function RentalLocation() {
  const { id } = useParams();

  // Lấy thông tin chủ sở hữu
  const {
    data: ownerDetailData,
    isLoading: ownerDetailIsLoading,
    isError: ownerDetailIsError,
  } = useGetOwnerDetailByUserIdQuery(id);

  const ownerId = ownerDetailData?.id;

  // Lấy danh sách địa điểm cho thuê theo ownerId
  const {
    data: rentalData,
    isLoading: rentalIsLoading,
    isError: rentalIsError,
  } = useGetRentalLocationByOwnerIdQuery(ownerId, { skip: !ownerId });

  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({ statuses: [] });
  const [rentalLocations, setRentalLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  // Cập nhật dữ liệu khi rentalData thay đổi
  useEffect(() => {
    if (rentalData?.data) {
      setRentalLocations(rentalData.data);
      setFilteredLocations(rentalData.data);
    }
  }, [rentalData]);

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

  if (ownerDetailIsLoading || rentalIsLoading)
    return (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    );

  if (ownerDetailIsError || rentalIsError) return <p>Lỗi khi tải dữ liệu.</p>;

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

import { useState, useEffect } from "react";
import FilterSection from "./components/FilterSection";
import RentalLocationList from "./components/RentalLocationList";
import { useNavigate, useParams } from "react-router-dom";
import { useGetRentalLocationByOwnerIdQuery } from "../../../../redux/services/rentalApi";
import { useGetOwnerDetailByUserIdQuery } from "../../../../redux/services/ownerApi";
import { Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Image } from "antd";
import { IoIosAdd } from "react-icons/io";
import { Typography } from "antd";
import { Flex } from "antd";
const { Title } = Typography;
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
  const navigate = useNavigate();

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
    <div style={{ padding: "10px 20px" }}>
      <Flex justify="space-between">
        <Title level={2}>Địa điểm cho thuê</Title>
        <Button
          type="primary"
          onClick={() => navigate("/rental-location/create")}
          icon={<IoIosAdd />}
        >
          Thêm địa điểm mới
        </Button>
      </Flex>
      <div style={{ display: "flex", gap: "20px", padding: "0 20px 20px" }}>
        <FilterSection
          searchValue={searchValue}
          filters={filters}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        {/* Kiểm tra nếu không có địa điểm nào */}
        {filteredLocations.length > 0 ? (
          <RentalLocationList locations={filteredLocations} />
        ) : (
          <div
            style={{
              flex: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "500",
              color: "#888",
              background: "#fff",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            Không có địa điểm nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}

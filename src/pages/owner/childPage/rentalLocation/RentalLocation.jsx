import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetRentalLocationByOwnerIdQuery } from "../../../../redux/services/rentalApi";
import { useGetOwnerDetailByUserIdQuery } from "../../../../redux/services/ownerApi";
import { Button, Spin, Input, Flex, message } from "antd";
import { LoadingOutlined, ReloadOutlined  } from "@ant-design/icons";
import { IoIosAdd } from "react-icons/io";
import { Typography } from "antd";
import RentalLocationTable from "./components/RentalLocationTable";
import FilterRentalLocation from "./components/FilterRentalLocation";
import NotApprove from "../notApprove/NotApprove";

const { Title } = Typography;

export default function RentalLocation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: ownerDetailData, isLoading: ownerDetailIsLoading } =
    useGetOwnerDetailByUserIdQuery(id);
  const ownerId = ownerDetailData?.id;
  const userRole = localStorage.getItem("user_role")?.toLowerCase(); // "owner" | "admin"
  const isAdmin = userRole === `"admin"` || userRole === `"staff"`;
  const isOwner = userRole === `"owner"`;

  const { data: rentalData, isLoading: rentalIsLoading, refetch } =
    useGetRentalLocationByOwnerIdQuery(ownerId, { skip: !ownerId });

  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({ statuses: [] });
  const [filteredLocations, setFilteredLocations] = useState([]);
  console.log(ownerDetailData);

  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    if (rentalData?.data) {
      applyFilters(searchValue, filters, rentalData.data);
    }
  }, [rentalData, searchValue, filters]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleBlur = (e) => {
    setSearchValue(e.target.value.trim());
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = (search, filterValues, data) => {
    const searchTerm = search.trim().toLowerCase();
    
    const filtered = data.filter((location) => {
      const matchesSearch = searchTerm === "" || location.name
        .toLowerCase()
        .includes(searchTerm);
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
  console.log(isAdmin);

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

  return (
    <div style={{ padding: "10px 20px" }}>
      {ownerDetailData?.approvalStatus == 2 || isAdmin ? (
        <div>
          <Flex
            justify="space-between"
            align="center"
            style={{ marginBottom: 16 }}
          >
            <Title level={2}>Địa điểm cho thuê</Title>

            {isOwner && (
              <Button
                type="primary"
                onClick={() => navigate("/rental-location/create")}
                icon={<IoIosAdd />}
              >
                Thêm địa điểm mới
              </Button>
            )}
          </Flex>
          <Flex gap={16} style={{ marginBottom: 16 }}>
            <Input
              placeholder="Tìm kiếm địa điểm..."
              value={searchValue}
              onChange={handleSearch}
              onBlur={handleBlur}
              style={{ width: 300 }}
            />
            <FilterRentalLocation
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={() => setFilters({ statuses: [] })}
              onApplyFilters={() =>
                applyFilters(searchValue, filters, rentalData?.data || [])
              }
            />

            <Button
              icon={<ReloadOutlined spin={isReloading} />}
              onClick={handleReload}
              loading={isReloading}
            >
              Làm mới
            </Button>
          </Flex>

          {filteredLocations.length > 0 ? (
            <RentalLocationTable
              data={filteredLocations}
              loading={rentalIsLoading || isReloading}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                fontSize: "18px",
                color: "#888",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              Không có địa điểm nào phù hợp.
            </div>
          )}
        </div>
      ) : (
        <NotApprove />
      )}
    </div>
  );
}
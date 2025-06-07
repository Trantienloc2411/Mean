import { useState, useEffect } from "react";
import { Input, Card, Button, message, Spin } from "antd";
import OverviewLocation from "./components/OverviewLocation";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import RentalLocationTable from "./components/RentalLocationTable";
import FilterRentalLocation from "./components/FilterRentalLocation";
import { useGetAllRentalLocationQuery } from "../../redux/services/rentalApi";
import styles from "./RentalLocation.module.scss";

export default function RentalLocation() {
  const { data, isLoading, refetch } = useGetAllRentalLocationQuery();
  const allLocations = data?.success ? data.data : [];

  const [searchValue, setSearchValue] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isReloading, setIsReloading] = useState(false);

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

  const countStatus = (data) => {
    const statusCounts = {
      total: data.length,
      active: 0, // 3
      inactive: 0, // 2
      pending: 0, // 1
      pause: 0, // 4
      needUpdate: 0, // 5
      deleted: 0, // 5
    };
    data.forEach((location) => {
      if (location.status === 3) {
        statusCounts.active++;
      } else if (location.status === 2) {
        statusCounts.inactive++;
      } else if (location.status === 1) {
        statusCounts.pending++;
      } else if (location.status === 4) {
        statusCounts.pause++;
      } else if (location.status === 5) {
        statusCounts.deleted++;
      } else if (location.status === 6) {
        statusCounts.needUpdate++;
      }
    });
    return statusCounts;
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

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  

  return (
    <div className={styles.contentContainer}>
      <h1 className={styles.sectionTitle}>Quản lý địa điểm</h1>

      <div className={styles.overviewSection}>
        <OverviewLocation data={countStatus(filteredLocations)} />
      </div>

      <div className={styles.locationSection}>
        <h2 className={styles.sectionTitle}>Danh sách địa điểm</h2>
        <Card className={styles.locationCard} bordered={false}>
          <div className={styles.toolbarContainer}>
            <div className={styles.searchFilterGroup}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm bằng tên địa điểm"
                className={styles.searchInput}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <FilterRentalLocation
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                onApplyFilters={() => applyFilters(searchValue, filters)}
              />
              <Button
                icon={<ReloadOutlined spin={isReloading} />}
                onClick={handleReload}
                loading={isReloading}
                style={{ marginLeft: 10 }}
              >
                Làm mới
              </Button>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <RentalLocationTable
              data={filteredLocations}
              loading={isLoading || isReloading}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

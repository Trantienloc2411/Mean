import { useState } from "react";
import { Table, Button } from "antd";
import { IoMdAdd } from "react-icons/io";
import SearchAndFilter from "./SearchAndFilter";
import RoomTableColumns from "./RoomTable";
import { Flex } from "antd";
import { useNavigate } from "react-router-dom";

export default function RoomList() {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  // Dữ liệu mẫu
  const data = [
    {
      key: "1",
      no: 1,
      name: "Phòng A",
      type: "Standard",
      createdAt: "2023-01-15",
      maxPeople: 2,
      amenities: ["Wi-Fi", "Máy lạnh", "Tủ lạnh"],
      initialPrice: "1,000,000 VND",
      hourlyPrice: "50,000 VND/giờ",
      condition: "READY",
      status: "APPROVED",
    },
    {
      key: "2",
      no: 2,
      name: "Phòng B",
      type: "Deluxe",
      createdAt: "2023-02-20",
      maxPeople: 4,
      amenities: ["TV", "Bồn tắm", "Mini Bar"],
      initialPrice: "1,500,000 VND",
      hourlyPrice: "80,000 VND/giờ",
      condition: "OCCUPIED",
      status: "INACTIVE",
    },
    {
      key: "3",
      no: 3,
      name: "Phòng C",
      type: "Suite",
      createdAt: "2023-03-05",
      maxPeople: 6,
      amenities: ["Bếp", "Máy giặt", "Máy sấy"],
      initialPrice: "2,000,000 VND",
      hourlyPrice: "100,000 VND/giờ",
      condition: "CLEANING",
      status: "PENDING",
    },
  ];

  // Bộ lọc và tìm kiếm
  const filteredData = data.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <Flex justify="space-between">
        <SearchAndFilter
          onSearch={setSearchText}
          onFilterChange={setFilterStatus}
        />

        <Button
          onClick={() => navigate("/accomodation/create")}
          icon={<IoMdAdd />}
        >
          Thêm phòng
        </Button>
      </Flex>
      <div style={{ marginTop: 20 }}>
        <Table columns={RoomTableColumns()} dataSource={filteredData} />
      </div>
    </div>
  );
}

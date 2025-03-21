import React, { useState } from "react";
import { Table, Button, message } from "antd";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import SearchAndFilter from "./SearchAndFilter";
import RoomTableColumns from "./RoomTable";
import { useGetAllAccommodationsQuery } from "../../../../../../redux/services/accommodationApi";

export default function RoomList() {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  const { data: accommodations, isLoading, isError } = useGetAllAccommodationsQuery();

  const handleDetailClick = (record) => {
    navigate(`/accommodation/${record.id}`);
  };

  const handleEditClick = (record) => {
    navigate(`/accommodation/edit/${record.id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    message.error("Tải danh sách phòng thất bại");
    return null;
  }
  const filteredData = accommodations?.filter((item) => {
    const matchesSearch = item.accommodationTypeId?.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.status.toString() === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <SearchAndFilter 
          onSearch={setSearchText} 
          onFilterChange={setFilterStatus}
        />
        <Button 
          type="primary" 
          icon={<IoMdAdd />}
          onClick={() => navigate("/accommodation/create")}
        >
          Thêm phòng
        </Button>
      </div>
      
      <Table 
        columns={RoomTableColumns({
          onDetailClick: handleDetailClick,
          onEditClick: handleEditClick
        })} 
        dataSource={filteredData} 
        rowKey="id"
      />
    </div>
  );
}
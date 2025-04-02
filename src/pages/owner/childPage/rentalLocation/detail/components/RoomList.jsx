import React, { useState, useEffect } from "react";
import { Table, Button, message, Spin } from "antd";
import { IoMdAdd } from "react-icons/io";
import { useParams } from "react-router-dom";
import SearchAndFilter from "./SearchAndFilter";
import RoomTableColumns from "./RoomTable";
import { 
  useGetAccommodationsByRentalLocationQuery,
  useGetAccommodationByIdQuery 
} from "../../../../../../redux/services/accommodationApi";
import AccommodationCreate from "../../../accomodation/childPage/AccomodationCreate/AccomodationCreate";
import AccomodationEdit from "../../../accomodation/childPage/AccomodationEdit/AccomodationEdit";
import AccommodationDetail from "../../../accomodation/childPage/AccomodationDetail/AccomodationDetail";

export default function RoomList() {
  const { id: rentalLocationId } = useParams();
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState(null);
  const [accommodationData, setAccommodationData] = useState(null);

  const { 
    data: accommodations, 
    isLoading, 
    isError, 
    refetch 
  } = useGetAccommodationsByRentalLocationQuery(rentalLocationId);

  const { 
    data: accommodationDetailResponse,
    isLoading: isLoadingDetail,
    refetch: refetchDetail
  } = useGetAccommodationByIdQuery(selectedAccommodationId, {
    skip: !selectedAccommodationId
  });

  useEffect(() => {
    console.log("Detail response:", accommodationDetailResponse);
    if (accommodationDetailResponse) {
      setAccommodationData(accommodationDetailResponse);
    }
  }, [accommodationDetailResponse]);

  const handleDetailClick = (record) => {
    setSelectedAccommodationId(record.id);
    setAccommodationData(record);
    setDetailModalVisible(true);
    if (record.id) {
      refetchDetail();
    }
  };

  const handleEditClick = (record) => {
    setSelectedAccommodationId(record.id);
    setAccommodationData(record);
    refetchDetail();
    setUpdateModalVisible(true);
  };

  const handleEditFromDetail = (data) => {
    setAccommodationData(data);
    setUpdateModalVisible(true);
    setDetailModalVisible(false);
  };

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    refetch();
  };

  const handleUpdateSuccess = () => {
    setUpdateModalVisible(false);
    refetch();
    if (detailModalVisible) {
      refetchDetail();
    }
  };

  if (isLoading) return <div className="loading-container"><Spin size="large" tip="Đang tải danh sách phòng..." /></div>;
  if (isError) {
    message.error("Tải danh sách phòng thất bại");
    return null;
  }

  const filteredData = accommodations?.filter((item) => {
    const matchesSearch = item.accommodationTypeId?.name
      ?.toLowerCase()
      ?.includes(searchText.toLowerCase()) || false;
    const matchesFilter =
      filterStatus === "all" || item.status?.toString() === filterStatus;
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
          onClick={() => setCreateModalVisible(true)}
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
        loading={isLoading}
      />

      <AccommodationCreate
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
        rentalLocationId={rentalLocationId}
      />

      <AccommodationDetail
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        loading={isLoadingDetail}
        accommodationData={accommodationData}
        onEdit={handleEditFromDetail}
      />

      <AccomodationEdit
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onSuccess={handleUpdateSuccess}
        accommodationId={selectedAccommodationId}
        accommodationData={accommodationData}
        isLoading={isLoadingDetail}
        rentalLocationId={rentalLocationId}
      />
    </div>
  );
}
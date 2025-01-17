import { useState, useEffect } from "react";
import { Table, Button, Input, Dropdown } from "antd";
import { MoreOutlined, PlusOutlined, FilterOutlined } from "@ant-design/icons";
import styles from "./RoomTypeManagement.module.scss";
import DeleteRoomTypeModal from "./components/DeleteRoomTypeModal/DeleteRoomTypeModal";
import AddRoomTypeModal from "./components/AddRoomTypeModal/AddRoomTypeModal.jsx";
import UpdateRoomTypeModal from "./components/UpdateRoomTypeModal/UpdateRoomTypeModal";
import DetailRoomTypeModal from "./components/DetailRoomTypeModal/DetailRoomTypeModal";
import { roomTypeData } from "./data/fakeData.js";
import debounce from "lodash/debounce";

const RoomTypeManagement = () => {
  const [selectedValues, setSelectedValues] = useState({
    maxOccupancy: [],
    priceRange: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(roomTypeData);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const menuItems = [
    {
      key: "1",
      label: "Chi tiết",
      onClick: (record) => {
        setSelectedRoomType(record);
        setIsDetailModalOpen(true);
      },
    },
    {
      key: "2",
      label: "Chỉnh sửa",
      onClick: (record) => {
        setSelectedRoomType(record);
        setIsUpdateModalOpen(true);
      },
    },
    {
      key: "3",
      label: "Xoá",
      danger: true,
      onClick: (record) => {
        setSelectedRoomType(record);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  const handleDeleteConfirm = () => {
    setFilteredData((prevData) =>
      prevData.filter((item) => item.No !== selectedRoomType?.No)
    );
    setIsDeleteModalOpen(false);
    setSelectedRoomType(null);
  };

  const handleAddRoomType = (values) => {
    const newRoomType = {
      ...values,
      No: filteredData.length + 1,
    };
    setFilteredData((prevData) => [...prevData, newRoomType]);
    setIsAddModalOpen(false);
  };

  const handleUpdateRoomType = (values) => {
    setFilteredData((prevData) =>
      prevData.map((item) =>
        item.No === selectedRoomType.No ? { ...item, ...values } : item
      )
    );
    setIsUpdateModalOpen(false);
    setSelectedRoomType(null);
  };

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  useEffect(() => {
    let filtered = [...roomTypeData];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedValues.maxOccupancy?.length > 0) {
      filtered = filtered.filter((item) =>
        selectedValues.maxOccupancy.includes(item.maxOccupancy)
      );
    }

    if (selectedValues.priceRange?.length > 0) {
      filtered = filtered.filter((item) => {
        return selectedValues.priceRange.some((range) => {
          const [min, max] = range.split("-").map(Number);
          if (max === undefined) return item.hourlyRate >= min;
          return item.hourlyRate >= min && item.hourlyRate <= max;
        });
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedValues]);

  const columns = [
    { title: "No.", dataIndex: "No", key: "No", align: "center" },
    { title: "Tên loại phòng", dataIndex: "name", key: "name", align: "left" },
    {
      title: "Số người tối đa",
      dataIndex: "maxOccupancy",
      key: "maxOccupancy",
      align: "center",
    },
    {
      title: "Tiện ích đi kèm",
      dataIndex: "amenities",
      key: "amenities",
      align: "center",
      render: (amenities) => `${amenities.length} tiện ích`,
    },
    {
      title: "Giá phòng theo giờ",
      dataIndex: "hourlyRate",
      key: "hourlyRate",
      align: "right",
      render: (price) => `${price.toLocaleString()}đ`,
    },
    {
      title: "",
      key: "operation",
      align: "center",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: menuItems.map((item) => ({
              ...item,
              onClick: () => item.onClick(record),
            })),
          }}
        >
          <MoreOutlined />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className={styles.contentContainer}>
      <h1>Quản lý Loại Phòng</h1>
      <div className={styles.contentTable}>
        <div className={styles.tool}>
          <div className={styles.searchFilter}>
            <Input
              placeholder="Tìm kiếm tên loại phòng"
              onChange={(e) => debouncedSearch(e.target.value)}
              style={{ width: "250px" }}
            />
            <Button icon={<FilterOutlined />}>Lọc</Button>
          </div>
          <Button
            type="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<PlusOutlined />}
          >
            Tạo loại phòng mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            total: filteredData.length,
            pageSize: 7,
            showSizeChanger: false,
          }}
          className={styles.reportTable}
        />

        <AddRoomTypeModal
          isOpen={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          onConfirm={handleAddRoomType}
        />

        <UpdateRoomTypeModal
          isOpen={isUpdateModalOpen}
          onCancel={() => {
            setIsUpdateModalOpen(false);
            setSelectedRoomType(null);
          }}
          onConfirm={handleUpdateRoomType}
          initialValues={selectedRoomType}
        />

        <DetailRoomTypeModal
          isOpen={isDetailModalOpen}
          roomType={selectedRoomType}
          onCancel={() => {
            setIsDetailModalOpen(false);
            setSelectedRoomType(null);
          }}
        />

        <DeleteRoomTypeModal
          isOpen={isDeleteModalOpen}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedRoomType(null);
          }}
          onConfirm={handleDeleteConfirm}
          roomTypeName={selectedRoomType?.name}
        />
      </div>
    </div>
  );
};

export default RoomTypeManagement;

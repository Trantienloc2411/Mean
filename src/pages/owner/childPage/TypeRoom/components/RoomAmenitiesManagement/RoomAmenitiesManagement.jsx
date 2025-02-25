import { useState, useEffect } from 'react';
import { Table, Button, Input, Dropdown, message } from 'antd';
import { MoreOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import styles from './RoomAmenitiesManagement.module.scss';
import DeleteAmenityModal from './components/DeleteAmenityModal/DeleteAmenityModal.jsx';
import AddAmenityModal from './components/AddAmenityModal/AddAmenityModal.jsx';
import UpdateAmenityModal from './components/UpdateAmenityModal/UpdateAmenityModal.jsx';
import DetailAmenityModal from './components/DetailAmenityModal/DetailAmenityModal.jsx';
import Filter from './components/Filter/Filter.jsx';
import debounce from 'lodash/debounce';
import { 
  useGetAllAmenitiesQuery, 
  useDeleteAmenityMutation, 
  useCreateAmenityMutation, 
  useUpdateAmenityMutation 
} from '../../../../../../redux/services/serviceApi.js';

const RoomAmenitiesManagement = () => {
  const [selectedValues, setSelectedValues] = useState({
    status: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // API queries and mutations
  const { data: amenitiesData, isLoading, refetch } = useGetAllAmenitiesQuery();
  const [deleteAmenity, { isLoading: isDeleting }] = useDeleteAmenityMutation();
  const [createAmenity, { isLoading: isCreating }] = useCreateAmenityMutation();
  const [updateAmenity, { isLoading: isUpdating }] = useUpdateAmenityMutation();

  const menuItems = [
    {
      key: '1',
      label: 'Chi tiết',
      onClick: (record) => {
        setSelectedAmenity(record);
        setIsDetailModalOpen(true);
      },
    },
    {
      key: '2',
      label: 'Chỉnh sửa',
      onClick: (record) => {
        setSelectedAmenity(record);
        setIsUpdateModalOpen(true);
      },
    },
    {
      key: '3',
      label: 'Xoá',
      danger: true,
      onClick: (record) => {
        setSelectedAmenity(record);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  const handleFilterChange = (filterType, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.values(selectedValues).flat().length;
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAmenity(selectedAmenity.id).unwrap();
      message.success(`Đã xoá tiện ích ${selectedAmenity.name} thành công`);
      setIsDeleteModalOpen(false);
      setSelectedAmenity(null);
    } catch (error) {
      message.error(`Xoá tiện ích thất bại: ${error.message}`);
    }
  };

  const handleAddAmenity = async (values) => {
    try {
      await createAmenity({
        ...values,
        accommodationTypeId: "63b92f4e17d7b3c2a4e4f3d2",
        status: values.status === 'Active', 
        isDelete: false
      }).unwrap();
      message.success('Thêm tiện ích thành công');
      setIsAddModalOpen(false);
    } catch (error) {
      message.error(`Thêm tiện ích thất bại: ${error.message}`);
    }
  };

  const handleUpdateAmenity = async (values) => {
    try {
      await updateAmenity({
        id: selectedAmenity.id,
        ...values,
        status: values.status === 'Active',
      }).unwrap();
      message.success('Cập nhật tiện ích thành công');
      setIsUpdateModalOpen(false);
      setSelectedAmenity(null);
    } catch (error) {
      message.error(`Cập nhật tiện ích thất bại: ${error.message}`);
    }
  };

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const transformedData = amenitiesData?.map((item, index) => ({
    key: item.id,
    No: index + 1,
    id: item.id,
    _id: item._id,
    name: item.name,
    description: item.description,
    status: item.status ? 'Active' : 'Inactive',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    accommodationTypeId: item.accommodationTypeId,
    isDelete: item.isDelete
  })) || [];

  useEffect(() => {
    if (amenitiesData) {
      let filtered = [...transformedData];

      if (searchTerm) {
        filtered = filtered.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedValues.status?.length > 0) {
        filtered = filtered.filter((item) =>
          selectedValues.status.includes(item.status)
        );
      }

      setFilteredData(filtered);
    }
  }, [searchTerm, selectedValues, amenitiesData, transformedData]);

  const filterGroups = [
    {
      name: 'status',
      title: 'Trạng thái',
      options: [
        { label: <span className={`${styles.status} ${styles.active}`}>Đang hoạt động</span>, value: 'Active' },
        { label: <span className={`${styles.status} ${styles.inactive}`}>Không hoạt động</span>, value: 'Inactive' },
      ],
    },
  ];

  const columns = [
    {
      title: 'No.',
      dataIndex: 'No',
      key: 'No',
      align: 'center',
    },
    {
      title: 'Tên tiện ích',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      align: 'left',
      ellipsis: true,
      width: '40%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        const isActive = status === 'Active';
        return (
          <span
            className={`${styles.status} ${isActive ? styles.active : styles.inactive}`}
          >
            {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
          </span>
        );
      },
    },
    {
      title: '',
      key: 'operation',
      align: 'center',
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
      <h1>Tiện ích Phòng</h1>
      <div className={styles.contentTable}>
        <div className={styles.tool}>
          <div className={styles.searchFilter}>
            <Input
              placeholder="Tìm kiếm tên tiện ích"
              onChange={(e) => debouncedSearch(e.target.value)}
              style={{ width: '250px' }}
            />
            <Dropdown
              trigger={['click']}
              dropdownRender={() => (
                <Filter
                  filterGroups={filterGroups}
                  selectedValues={selectedValues}
                  onFilterChange={handleFilterChange}
                />
              )}
            >
              <Button icon={<FilterOutlined />}>
                Lọc
                {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
              </Button>
            </Dropdown>
          </div>
          <Button
            type="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<PlusOutlined />}
            className={styles.addRoomButton}
          >
            Thêm tiện ích
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          pagination={{
            total: filteredData.length,
            pageSize: 7,
            showSizeChanger: false,
            className: styles.customPagination,
            itemRender: (page, type, originalElement) => {
              const totalPages = Math.ceil(filteredData.length / 7);
              if (type === 'prev') {
                return (
                  <button
                    className={styles.paginationButton}
                    disabled={page === 0}
                  >
                    « Trước
                  </button>
                );
              }
              if (type === 'next') {
                return (
                  <button
                    className={styles.paginationButton}
                    disabled={page >= totalPages}
                  >
                    Tiếp »
                  </button>
                );
              }
              return originalElement;
            },
          }}
          className={styles.reportTable}
        />

        <AddAmenityModal
          isOpen={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          onConfirm={handleAddAmenity}
          isLoading={isCreating}
        />

        <UpdateAmenityModal
          isOpen={isUpdateModalOpen}
          onCancel={() => {
            setIsUpdateModalOpen(false);
            setSelectedAmenity(null);
          }}
          onConfirm={handleUpdateAmenity}
          initialValues={selectedAmenity}
          isLoading={isUpdating}
        />

        <DetailAmenityModal
          isOpen={isDetailModalOpen}
          amenity={selectedAmenity}
          onCancel={() => {
            setIsDetailModalOpen(false);
            setSelectedAmenity(null);
          }}
        />

        <DeleteAmenityModal
          isOpen={isDeleteModalOpen}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedAmenity(null);
          }}
          onConfirm={handleDeleteConfirm}
          amenityName={selectedAmenity?.name}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default RoomAmenitiesManagement;
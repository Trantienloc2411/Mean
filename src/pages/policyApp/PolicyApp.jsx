import { useState, useEffect } from 'react';
import { Input, Button, DatePicker, Dropdown, Table, Spin } from 'antd';
import { FilterOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import debounce from 'lodash/debounce';
import styles from './PolicyApp.module.scss';
import Filter from './components/Filter/Filter.jsx';
import DeletePolicyModal from './components/DeletePolicyModal/DeletePolicyModal.jsx';
import AddPolicyModal from './components/AddPolicyModal/AddPolicyModal.jsx';
import UpdatePolicyModal from './components/UpdatePolicyModal/UpdatePolicyModal.jsx';
import DetailPolicyModal from './components/DetailPolicyModal/DetailPolicyModal.jsx';
import {
  useGetAllPolicySystemsQuery,
  useCreatePolicySystemMutation,
  useUpdatePolicySystemMutation,
  useDeletePolicySystemMutation,
} from '../../redux/services/policySystemApi.js';

export default function PolicyApp() {
  dayjs.extend(isBetween);
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    unit: [],
    dateRange: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data: policyData, isLoading } = useGetAllPolicySystemsQuery(undefined, {
    onSuccess: (data) => {
      console.log('Received policy data:', data);
    }
  });
  const [createPolicy] = useCreatePolicySystemMutation();
  const [updatePolicy] = useUpdatePolicySystemMutation();
  const [deletePolicy] = useDeletePolicySystemMutation();

  const filterGroups = [
    {
      name: "unit",
      title: "Đơn vị",
      options: [
        { key: '1', label: "Phần trăm", value: "percent" },
        { key: '2', label: "VND", value: "vnd" },
      ],
    },
    {
      name: 'status',
      title: 'Trạng thái',
      options: [
        {
          label: <span className={`${styles.status} ${styles.active}`}>Đang hoạt động</span>,
          value: true,
        },
        {
          label: <span className={`${styles.status} ${styles.expired}`}>Không hoạt động</span>,
          value: false,
        }
      ]
    }
  ];

  const menuItems = [
    {
      key: '1',
      label: 'Chi tiết',
      onClick: (record) => {
        setSelectedPolicy(record);
        setIsDetailModalOpen(true);
      },
    },
    {
      key: '2',
      label: 'Chỉnh sửa',
      onClick: (record) => {
        setSelectedPolicy(record);
        setIsUpdateModalOpen(true);
      },
    },
    {
      key: '3',
      label: 'Xoá',
      danger: true,
      onClick: (record) => {
        setSelectedPolicy(record);
        setIsDeleteModalOpen(true);
      },
    }
  ];

  const handleDeleteConfirm = async () => {
    try {
      await deletePolicy(selectedPolicy.id).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedPolicy(null);
    } catch (error) {
      console.error("Error deleting policy:", error);
    }
  };

  const handleAddPolicy = async (values) => {
    try {
      const newPolicy = {
        policySystemCategoryId: values.policySystemCategoryId,
        policySystemBookingId: values.policySystemBookingId || "",
        name: values.name,
        description: values.description || "",
        value: values.value || "",
        unit: values.unit || "",
        startDate: values.startDate ? dayjs(values.startDate).format('DD-MM-YYYY HH:mm:ss') : null,
        endDate: values.endDate ? dayjs(values.endDate).format('DD-MM-YYYY HH:mm:ss') : null,
        isActive: true
      };

      console.log("Creating policy with dates:", {
        startDate: newPolicy.startDate,
        endDate: newPolicy.endDate
      });

      await createPolicy(newPolicy).unwrap();
      setIsAddModalOpen(false);
      message.success('Tạo chính sách thành công');
    } catch (error) {
      console.error("Error adding policy:", error);
      message.error('Có lỗi xảy ra khi tạo chính sách');
    }
  };

  const handleUpdatePolicy = async (values) => {
    try {
      const updatedPolicy = {
        id: selectedPolicy.id,
        staffId: values.staffId,
        policySystemCategoryId: values.policySystemCategoryId,
        policySystemBookingId: values.policySystemBookingId || "",
        name: values.name,
        description: values.description || "",
        value: values.value || "",
        unit: values.unit || "",
        startDate: dayjs(values.startDate).format('DD-MM-YYYY HH:mm:ss'),
        endDate: dayjs(values.endDate).format('DD-MM-YYYY HH:mm:ss'),
        isActive: values.isActive === 'active'
      };

      await updatePolicy(updatedPolicy).unwrap();
      setIsUpdateModalOpen(false);
      setSelectedPolicy(null);
      message.success('Cập nhật chính sách thành công');
    } catch (error) {
      console.error('Error in handleUpdatePolicy:', error);
      message.error('Có lỗi xảy ra khi cập nhật chính sách');
    }
  };
  const handleFilterChange = (filterName, newValues) => {
    setSelectedValues(prev => ({
      ...prev,
      [filterName]: newValues,
    }));
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    setSelectedValues(prev => ({
      ...prev,
      dateRange: dates ? dateStrings : [],
    }));
  };

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  useEffect(() => {
    if (!policyData) return;

    let filtered = [...policyData];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedValues.status?.length > 0) {
      filtered = filtered.filter((item) =>
        selectedValues.status.includes(item.isActive)
      );
    }

    if (selectedValues.unit?.length > 0) {
      filtered = filtered.filter((item) =>
        selectedValues.unit.includes(item.unit)
      );
    }

    if (selectedValues.dateRange?.length === 2) {
      const [start, end] = selectedValues.dateRange;
      filtered = filtered.filter((item) => {
        const itemStart = dayjs(item.startDate, "DD/MM/YYYY HH:mm:ss");
        const itemEnd = dayjs(item.endDate, "DD/MM/YYYY HH:mm:ss");
        return itemStart.isAfter(dayjs(start)) && itemEnd.isBefore(dayjs(end));
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedValues, policyData]);

  const columns = [
    { title: "No.", dataIndex: "id", key: "id" },
    { title: "Tên chính sách", dataIndex: "name", key: "name" },
    { title: "Đơn vị", dataIndex: "unit", key: "unit" },
    { title: "Giá trị", dataIndex: "value", key: "value" },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY HH:mm:ss")
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => dayjs(date, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY HH:mm:ss")
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <span className={`${styles.status} ${isActive ? styles.active : styles.expired}`}>
          {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      title: "",
      key: "operation",
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
    }
  ];

  return (
    <div className={styles.contentContainer}>
      <h1>Quản lý Chính Sách Hệ Thống</h1>
      <div className={styles.contentTable}>
        <div className={styles.tool}>
          <div className={styles.searchFilter}>
            <Input
              placeholder="Tìm kiếm tên chính sách"
              onChange={(e) => debouncedSearch(e.target.value)}
              style={{ width: "250px", marginRight: "10px" }}
            />
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              dropdownRender={() => (
                <Filter
                  filterGroups={filterGroups}
                  selectedValues={selectedValues}
                  onFilterChange={handleFilterChange}
                  onDateRangeChange={handleDateRangeChange}
                />
              )}
            >
              <Button icon={<FilterOutlined />}>
                Lọc
                {Object.values(selectedValues).flat().length > 0 &&
                  (`(${Object.values(selectedValues).flat().length})`)}
              </Button>
            </Dropdown>
          </div>

          <Button
            type="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<PlusOutlined />}
            className={styles.addRoomButton}
          >
            Tạo chính sách mới
          </Button>
        </div>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{
              total: filteredData.length,
              pageSize: 7,
              showSizeChanger: false,
              className: styles.customPagination,
              itemRender: (page, type, originalElement) => {
                const totalPages = Math.ceil(filteredData.length / 7);
                if (type === "prev") {
                  return (
                    <button
                      className={styles.paginationButton}
                      disabled={page === 0}
                    >
                      « Trước
                    </button>
                  );
                }
                if (type === "next") {
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
        )}

        <AddPolicyModal
          isOpen={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          onConfirm={handleAddPolicy}
        />

        <UpdatePolicyModal
          isOpen={isUpdateModalOpen}
          onCancel={() => {
            setIsUpdateModalOpen(false);
            setSelectedPolicy(null);
          }}
          onConfirm={handleUpdatePolicy}
          initialValues={selectedPolicy}
        />

        <DetailPolicyModal
          isOpen={isDetailModalOpen}
          policy={selectedPolicy}
          onCancel={() => {
            setIsDetailModalOpen(false);
            setSelectedPolicy(null);
          }}
        />

        <DeletePolicyModal
          isOpen={isDeleteModalOpen}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedPolicy(null);
          }}
          onConfirm={handleDeleteConfirm}
          policyName={selectedPolicy?.name}
        />
      </div>
    </div>
  );
}
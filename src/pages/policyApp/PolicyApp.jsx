import { useState, useEffect } from 'react';
import { Input, Button, DatePicker, Dropdown, Table } from 'antd';
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
import { policyData } from './data/fakeData.js';

export default function PolicyApp() {
  dayjs.extend(isBetween);
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    unit: [],
    dateRange: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(policyData);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filterGroups = [
    {
      name: "unit",
      title: "Đơn vị",
      options: [
        { key: '1', label: "Phần trăm", value: "Percent" },
        { key: '2', label: "VND", value: "VND" },
      ],
    },
    {
      name: 'status',
      title: 'Trạng thái',
      options: [
        {
          label: <span className={`${styles.status} ${styles.active}`}>Đang hoạt động</span>,
          value: 'Active',
        },
        {
          label: <span className={`${styles.status} ${styles.expired}`}>Hết hạn</span>,
          value: 'Expired',
        },
        {
          label: <span className={`${styles.status} ${styles.paused}`}>Tạm dừng</span>,
          value: 'Paused',
        },
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

  const handleDeleteConfirm = () => {
    setFilteredData(prevData => prevData.filter(item => item.No !== selectedPolicy?.No));
    setIsDeleteModalOpen(false);
    setSelectedPolicy(null);
  };

  const handleAddPolicy = (values) => {
    const newPolicy = {
      ...values,
      No: filteredData.length + 1,
      StartTime: values.StartTime.format('HH:mm DD/MM/YYYY'),
      EndTime: values.EndTime.format('HH:mm DD/MM/YYYY'),
    };
    setFilteredData(prevData => [...prevData, newPolicy]);
    setIsAddModalOpen(false);
  };

  const handleUpdatePolicy = (values) => {
    setFilteredData(prevData =>
      prevData.map(item =>
        item.No === selectedPolicy.No
          ? {
              ...item,
              ...values,
              StartTime: values.StartTime,
              EndTime: values.EndTime,
            }
          : item
      )
    );
    setIsUpdateModalOpen(false);
    setSelectedPolicy(null);
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
    let filtered = [...policyData];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedValues.status?.length > 0) {
      filtered = filtered.filter((item) =>
        selectedValues.status.includes(item.Status)
      );
    }

    if (selectedValues.unit?.length > 0) {
      filtered = filtered.filter((item) =>
        selectedValues.unit.includes(item.Unit)
      );
    }

    if (selectedValues.dateRange?.length === 2) {
      const [start, end] = selectedValues.dateRange;
      filtered = filtered.filter((item) => {
        const itemStart = dayjs(item.StartTime, "HH:mm DD/MM/YYYY");
        const itemEnd = dayjs(item.EndTime, "HH:mm DD/MM/YYYY");
        return itemStart.isAfter(dayjs(start)) && itemEnd.isBefore(dayjs(end));
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedValues]);

  const columns = [
    { title: "No.", dataIndex: "No", key: "No" },
    { title: "Tên chính sách", dataIndex: "Name", key: "Name" },
    { title: "Đơn vị", dataIndex: "Unit", key: "Unit" },
    { title: "Giá trị", dataIndex: "Value", key: "Value" },
    { title: "Ngày bắt đầu", dataIndex: "StartTime", key: "StartTime" },
    { title: "Ngày kết thúc", dataIndex: "EndTime", key: "EndTime" },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "Status",
      render: (status) => {
        let className = '';
        switch (status) {
          case 'Active':
            className = styles.active;
            break;
          case 'Paused':
            className = styles.paused;
            break;
          case 'Expired':
            className = styles.expired;
            break;
          default:
            break;
        }
        return <span className={`${styles.status} ${className}`}>
          {status === 'Active' ? 'Đang hoạt động' : status === 'Paused' ? 'Tạm dừng' : 'Hết hạn'}
        </span>;
      },
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
          >
            Tạo chính sách mới
          </Button>
        </div>

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
          policyName={selectedPolicy?.Name}
        />
      </div>
    </div>
  );
}
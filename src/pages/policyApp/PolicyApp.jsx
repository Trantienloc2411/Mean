import { useState, useEffect } from "react";
import {
  Input,
  Button,
  DatePicker,
  Dropdown,
  Table,
  Spin,
  message,
  Tabs,
} from "antd";
import {
  FilterOutlined,
  PlusOutlined,
  MoreOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import debounce from "lodash/debounce";
import styles from "./PolicyApp.module.scss";
import Filter from "./components/Filter/Filter.jsx";
import DeletePolicyModal from "./components/DeletePolicyModal/DeletePolicyModal.jsx";
import AddPolicyModal from "./components/AddPolicyModal/AddPolicyModal.jsx";
import UpdatePolicyModal from "./components/UpdatePolicyModal/UpdatePolicyModal.jsx";
import DetailPolicyModal from "./components/DetailPolicyModal/DetailPolicyModal.jsx";
import PolicyCategory from "./components/PolicyCategory/PolicyCategory.jsx";
import {
  useGetAllPolicySystemsQuery,
  useCreatePolicySystemMutation,
  useUpdatePolicySystemMutation,
  useDeletePolicySystemMutation,
  useGetPolicySystemByIdQuery,
} from "../../redux/services/policySystemApi.js";
import { useGetAllPolicySystemCategoriesQuery } from "../../redux/services/policySystemCategoryApi.js";

// Component cho tab Chính sách
function PolicySystem() {
  dayjs.extend(isBetween);
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    unit: [],
    category: [],
    dateRange: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [displaySearchTerm, setDisplaySearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const [selectedPolicyDetail, setSelectedPolicyDetail] = useState(null);
  const { data: detailedPolicy, isLoading: isDetailLoading } =
    useGetPolicySystemByIdQuery(selectedPolicy?._id, {
      skip: !selectedPolicy?._id || !isDetailModalOpen,
    });

  const {
    data: policyData,
    isLoading,
    refetch,
  } = useGetAllPolicySystemsQuery(undefined, {
    onSuccess: (data) => {
      console.log("Received policy data:", data);
      if (data?.success && data.data) {
        setFilteredData(data.data);
      }
    },
  });

  const { data: categoryData } = useGetAllPolicySystemCategoriesQuery();

  const [createPolicy] = useCreatePolicySystemMutation();
  const [updatePolicy] = useUpdatePolicySystemMutation();
  const [deletePolicy] = useDeletePolicySystemMutation();

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

  const filterGroups = [
    {
      name: "unit",
      title: "Đơn vị",
      options: [
        { key: "1", label: "Phần trăm", value: "percent" },
        { key: "2", label: "VND", value: "vnd" },
      ],
    },
    {
      name: "status",
      title: "Trạng thái",
      options: [
        {
          label: (
            <span className={`${styles.status} ${styles.active}`}>
              Đang hoạt động
            </span>
          ),
          value: true,
        },
        {
          label: (
            <span className={`${styles.status} ${styles.expired}`}>
              Ngừng hoạt động
            </span>
          ),
          value: false,
        },
      ],
    },
    {
      name: "category",
      title: "Danh mục",
      options:
        categoryData?.data?.map((category) => ({
          key: category._id,
          label: category.categoryName,
          value: category._id,
        })) || [],
    },
  ];

  const menuItems = [
    {
      key: "1",
      label: "Chi tiết",
      onClick: (record) => {
        setSelectedPolicy(record);
        setIsDetailModalOpen(true);
      },
    },
    {
      key: "2",
      label: "Chỉnh sửa",
      onClick: (record) => {
        setSelectedPolicy(record);
        setIsUpdateModalOpen(true);
      },
    },
  ];

  const handleDeleteConfirm = async () => {
    try {
      await deletePolicy(selectedPolicy._id).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedPolicy(null);
      message.success("Xóa chính sách thành công");
    } catch (error) {
      console.error("Error deleting policy:", error);
      message.error("Có lỗi xảy ra khi xóa chính sách");
    }
  };

  const handleAddPolicy = async (values) => {
    try {
      const newPolicy = {
        policySystemCategoryId: values.policySystemCategoryId,
        name: values.name,
        description: values.description || "",
        values: values.values || [],
        startDate: values.startDate
          ? dayjs(values.startDate).format("DD/MM/YYYY HH:mm:ss")
          : null,
        endDate: values.endDate
          ? dayjs(values.endDate).format("DD/MM/YYYY HH:mm:ss")
          : null,
        isActive: true,
      };

      console.log("Creating policy with dates:", {
        startDate: newPolicy.startDate,
        endDate: newPolicy.endDate,
      });

      await createPolicy(newPolicy).unwrap();
      setIsAddModalOpen(false);
      message.success("Tạo chính sách thành công");
    } catch (error) {
      console.error("Error adding policy:", error);
      message.error("Có lỗi xảy ra khi tạo chính sách");
    }
  };

  const handleUpdatePolicy = async (values) => {
    try {
      console.log("[Debug] Submitting values:", values);

      if (!selectedPolicy?._id) {
        message.error("Không tìm thấy ID chính sách");
        return;
      }

      const formattedValues = {
        ...values,
        _id: selectedPolicy._id,
        startDate: values.startDate
          ? dayjs(values.startDate).format("DD-MM-YYYY HH:mm:ss")
          : null,
        endDate: values.endDate
          ? dayjs(values.endDate).format("DD-MM-YYYY HH:mm:ss")
          : null,
        isActive: values.isActive,
      };

      console.log("[Debug] Formatted payload:", formattedValues);

      const result = await updatePolicy(formattedValues).unwrap();
      console.log("[Debug] API Response:", result);

      message.success("Cập nhật thành công!");
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("[Debug] Update Error:", error);
      message.error(`Lỗi: ${error.data?.message || error.message}`);
    }
  };

  const handleFilterChange = (filterName, newValues) => {
    setSelectedValues((prev) => ({
      ...prev,
      [filterName]: newValues,
    }));
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    setSelectedValues((prev) => ({
      ...prev,
      dateRange: dates ? dateStrings : [],
    }));
  };

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value.trim());
  }, 500);

  useEffect(() => {
    if (!policyData?.data) return;

    let filtered = [...policyData.data];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(displaySearchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(displaySearchTerm.toLowerCase())
      );
    }

    if (selectedValues.status?.length > 0) {
      filtered = filtered.filter((item) =>
        selectedValues.status.includes(item.isActive)
      );
    }

    if (selectedValues.unit?.length > 0) {
      filtered = filtered.filter((item) => {
        return item.values?.some((val) =>
          selectedValues.unit.includes(val.unit)
        );
      });
    }

    if (selectedValues.category?.length > 0) {
      filtered = filtered.filter((item) =>
        selectedValues.category.includes(item.policySystemCategoryId?._id)
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
    {
      title: "No.",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên chính sách",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (desc) => {
        if (!desc) return "N/A";
        return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc;
      },
    },
    {
      title: "Danh mục",
      key: "category",
      render: (record) => record.policySystemCategoryId?.categoryName || "N/A",
    },
    {
      title: "Giá trị",
      key: "values",
      render: (record) => {
        if (!record.values || record.values.length === 0) return "Không có";

        return record.values.map((val, idx) => (
          <div key={idx}>
            {val.val1 && val.val2
              ? `${val.val1} - ${val.val2}`
              : val.val1 || val.val2}
            {val.unit &&
              ` (${
                val.unit === "percent"
                  ? "Phần trăm"
                  : val.unit === "vnd"
                  ? "VND"
                  : val.unit === "min"
                  ? "Phút"
                  : val.unit
              })`}
          </div>
        ));
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) =>
        date
          ? dayjs(date, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss")
          : "N/A",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) =>
        date
          ? dayjs(date, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss")
          : "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <span
          className={`${styles.status} ${
            isActive ? styles.active : styles.expired
          }`}
        >
          {isActive ? "Đang hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      title: "",
      key: "operation",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: menuItems.map((item) => ({
              ...item,
              onClick: () => item.onClick(record),
            })),
          }}
        >
          <MoreOutlined onClick={(e) => e.preventDefault()} />
        </Dropdown>
      ),
    },
  ];

  useEffect(() => {
    if (detailedPolicy?.success && detailedPolicy.data) {
      setSelectedPolicyDetail(detailedPolicy.data);
    }
  }, [detailedPolicy]);

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
    <>
      <div className={styles.contentTable}>
        <div className={styles.tool}>
          <div className={styles.searchFilter}>
            <Input
              placeholder="Tìm kiếm tên chính sách"
              value={displaySearchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setDisplaySearchTerm(value);
                debouncedSearch(value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                setDisplaySearchTerm(value.trim());
                setSearchTerm(value.trim());
              }}
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
                  `(${Object.values(selectedValues).flat().length})`}
              </Button>
            </Dropdown>
            <Button
              icon={<ReloadOutlined spin={isReloading} />}
              onClick={handleReload}
              loading={isReloading}
              style={{ marginLeft: 10 }}
            >
              Làm mới
            </Button>
          </div>

          <Button
            type="default"
            onClick={() => setIsAddModalOpen(true)}
            icon={<PlusOutlined />}
            className={styles.addRoomButton}
            style={{
              backgroundColor: "#fff",
              borderColor: "#667085",
              color: "#667085",
            }}
          >
            Tạo chính sách mới
          </Button>
        </div>

        {isLoading || isReloading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="_id"
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
      </div>

      <AddPolicyModal
        isOpen={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onConfirm={handleAddPolicy}
        categories={categoryData?.data || []}
      />

      <UpdatePolicyModal
        isOpen={isUpdateModalOpen}
        onCancel={() => {
          setIsUpdateModalOpen(false);
          setSelectedPolicy(null);
        }}
        onConfirm={handleUpdatePolicy}
        initialValues={selectedPolicy}
        categories={categoryData?.data || []}
      />

      <DetailPolicyModal
        isOpen={isDetailModalOpen}
        policy={detailedPolicy?.data || selectedPolicy}
        isLoading={isDetailLoading}
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
    </>
  );
}

// Component chính với tabs
export default function PolicyApp() {
  const [activeTab, setActiveTab] = useState("policies");
  const [isLoading, setIsLoading] = useState(false);

  const tabItems = [
    {
      key: "policies",
      label: "Chính sách",
      children: (
        <PolicySystem isLoading={isLoading} setIsLoading={setIsLoading} />
      ),
    },
    {
      key: "categories",
      label: "Danh mục chính sách",
      children: (
        <PolicyCategory isLoading={isLoading} setIsLoading={setIsLoading} />
      ),
    },
  ];

  return (
    <div className={styles.contentContainer}>
      <h1>Quản lý Chính Sách Hệ Thống</h1>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginTop: 20 }}
      />
    </div>
  );
}

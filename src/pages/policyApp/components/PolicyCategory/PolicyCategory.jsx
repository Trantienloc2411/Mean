import { useState, useEffect } from "react";
import { Input, Button, Table, Spin, message } from "antd";
import { PlusOutlined, EditOutlined, ReloadOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import styles from "../../PolicyApp.module.scss";
import {
  useGetAllPolicySystemCategoriesQuery,
  useCreatePolicySystemCategoryMutation,
  useUpdatePolicySystemCategoryMutation,
} from "../../../../redux/services/policySystemCategoryApi.js";
import PolicyCategoryModal from "./PolicyCategoryModal";

export default function PolicyCategory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isReloading, setIsReloading] = useState(false);

  const {
    data: categoryData,
    isLoading,
    refetch,
  } = useGetAllPolicySystemCategoriesQuery();
  const [createCategory] = useCreatePolicySystemCategoryMutation();
  const [updateCategory] = useUpdatePolicySystemCategoryMutation();

  useEffect(() => {
    let dataToFilter = null;

    if (Array.isArray(categoryData)) {
      dataToFilter = categoryData;
    } else if (categoryData?.data && Array.isArray(categoryData.data)) {
      dataToFilter = categoryData.data;
    } else if (categoryData?.success && categoryData?.data) {
      dataToFilter = categoryData.data;
    }

    if (!dataToFilter || !Array.isArray(dataToFilter)) {
      setFilteredData([]);
      return;
    }

    let filtered = [...dataToFilter];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.categoryKey?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.categoryDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, categoryData]);

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

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (record) => {
    setEditingCategory(record);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory._id,
          ...values,
        }).unwrap();
      } else {
        await createCategory(values).unwrap();
      }
      setIsModalOpen(false);
      await refetch();
    } catch (error) {
      console.error("Error saving category:", error);
      throw error;
    }
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Mã danh mục",
      dataIndex: "categoryKey",
      key: "categoryKey",
      width: 150,
    },
    {
      title: "Tên danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      width: 200,
    },
    {
      title: "Mô tả",
      dataIndex: "categoryDescription",
      key: "categoryDescription",
      render: (desc) => desc || "N/A",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date) => date || "N/A",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (date) => date || "N/A",
    },
    {
      title: "Thao tác",
      key: "operation",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEditCategory(record)}
        >
          Sửa
        </Button>
      ),
    },
  ];
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
    <div className={styles.contentTable}>
      <div className={styles.tool}>
        <div className={styles.searchFilter}>
          <Input
            placeholder="Tìm kiếm danh mục"
            onChange={(e) => debouncedSearch(e.target.value)}
            style={{ width: "300px", marginRight: "10px" }}
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

        <Button
          type="default"
          onClick={handleAddCategory}
          icon={<PlusOutlined />}
          className={styles.addRoomButton}
          style={{
            backgroundColor: "#fff",
            borderColor: "#667085",
            color: "#667085",
          }}
        >
          Tạo danh mục mới
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
          rowKey={(record) => record._id || record.id}
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

      <PolicyCategoryModal
        visible={isModalOpen}
        isEditing={!!editingCategory}
        editingId={editingCategory?._id}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        initialValues={{
          categoryKey: editingCategory?.categoryKey,
          categoryName: editingCategory?.categoryName,
          categoryDescription: editingCategory?.categoryDescription,
        }}
      />
    </div>
  );
}

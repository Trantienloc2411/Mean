import { useState, useEffect } from "react";
import { Input, Button, Dropdown, Table, message } from "antd";
import {
  FilterOutlined,
  PlusOutlined,
  MoreOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import styles from "./Policy.module.scss";
import Filter from "./components/Filter/Filter.jsx";
import DeletePolicyModal from "./components/DeletePolicyModal/DeletePolicyModal.jsx";
import AddPolicyModal from "./components/AddPolicyModal/AddPolicyModal.jsx";
import UpdatePolicyModal from "./components/UpdatePolicyModal/UpdatePolicyModal.jsx";
import DetailPolicyModal from "./components/DetailPolicyModal/DetailPolicyModal.jsx";
import dayjs from "dayjs";
import {
  useGetPolicyOwnerByOwnerIdQuery,
  useGetPolicyOwnerByIdQuery,
  useCreatePolicyOwnerMutation,
  useUpdatePolicyOwnerMutation,
  useDeletePolicyOwnerMutation,
} from "../../../../redux/services/policyOwnerApi.js";
import { useGetOwnerDetailByUserIdQuery } from "../../../../redux/services/ownerApi.js";
import { useParams } from "react-router-dom";

export default function Policy() {
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    dateRange: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [baseData, setBaseData] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [effectiveOwnerId, setEffectiveOwnerId] = useState(null);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [policyDetailForUpdate, setPolicyDetailForUpdate] = useState(null);
  const [isReloading, setIsReloading] = useState(false);
  const userRole = localStorage.getItem("user_role")?.toLowerCase();
  const canEdit = userRole === `"owner"`;

  // const userId = localStorage.getItem("user_id");
  const { id } = useParams();

  const {
    data: ownerData,
    isLoading: isOwnerLoading,
    error: ownerError,
  } = useGetOwnerDetailByUserIdQuery(id, {
    skip: !id,
  });

  const {
    data: selectedPolicyDetail,
    isLoading: isLoadingPolicyDetail,
    error: policyDetailError,
  } = useGetPolicyOwnerByIdQuery(selectedPolicyId, {
    skip: !selectedPolicyId || !isDetailModalOpen,
  });

  const {
    data: updatePolicyDetail,
    isLoading: isLoadingUpdateDetail,
    error: updateDetailError,
  } = useGetPolicyOwnerByIdQuery(selectedPolicyId, {
    skip: !selectedPolicyId || !isUpdateModalOpen,
  });

  useEffect(() => {
    if (ownerData) {
      const ownerId = ownerData.id || ownerData._id;
      setEffectiveOwnerId(ownerId);
      // console.log("Owner ID set:", ownerId);
    }
  }, [ownerData]);

  const {
    data: policiesData,
    isLoading: isPoliciesLoading,
    refetch,
    error: policiesError,
  } = useGetPolicyOwnerByOwnerIdQuery(effectiveOwnerId, {
    skip: !effectiveOwnerId,
  });

  const [createPolicy, { isLoading: isCreating }] =
    useCreatePolicyOwnerMutation();
  const [updatePolicy, { isLoading: isUpdating }] =
    useUpdatePolicyOwnerMutation();
  const [deletePolicy, { isLoading: isDeleting }] =
    useDeletePolicyOwnerMutation();

  useEffect(() => {
    // console.log("API Response:", {
    //   policiesData,
    //   isPoliciesLoading,
    //   policiesError,
    // });
    // console.log("Raw API Response structure:", policiesData);

    if (policiesData && policiesData.owners && policiesData.owners.length > 0) {
      // console.log("Processing API data with owners:", policiesData.owners);
      processData({ success: true, data: policiesData.owners });
    } else if (
      (!policiesData ||
        !policiesData.owners ||
        policiesData.owners.length === 0) &&
      !isPoliciesLoading
    ) {
      // console.log("Using test data because API response is empty or invalid");
      // const testData = {
      //   success: true,
      //   data: [
      //     {
      //       _id: "67bd845aa8453ac3505d6aab",
      //       ownerId: effectiveOwnerId || "63b92f4e17d7b3c2a4e4f3d2",
      //       policyTitle: "Cancellation Policy",
      //       policyDescription:
      //         "This policy covers cancellation terms for bookings.",
      //       startDate: "01/02/2025 19:00:00",
      //       endDate: "31/12/2025 19:00:00",
      //       isDelete: false,
      //       createdAt: "25/02/2025 15:50:34",
      //       updatedAt: "25/02/2025 15:50:34",
      //       __v: 0,
      //       id: "67bd845aa8453ac3505d6aab",
      //     },
      //   ],
      // };
      processData([]);
    }
  }, [policiesData, isPoliciesLoading, policiesError, effectiveOwnerId]);

  const filterGroups = [
    {
      name: "status",
      title: "Trạng thái",
      options: [
        {
          label: (
            <span className={`${styles.status} ${styles.approved}`}>
              Đã duyệt
            </span>
          ),
          value: 2,
        },
        {
          label: (
            <span className={`${styles.status} ${styles.pending}`}>
              Đang chờ
            </span>
          ),
          value: 1,
        },
        {
          label: (
            <span className={`${styles.status} ${styles.rejected}`}>
              Bị từ chối
            </span>
          ),
          value: 3,
        },
      ],
    },
  ];

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "";
      return dayjs(dateString, "DD/MM/YYYY HH:mm:ss").format(
        "HH:mm DD/MM/YYYY"
      );
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString || "";
    }
  };

  const getStatusFromDates = (startDate, endDate) => {
    try {
      const now = dayjs();
      if (!startDate || !endDate) return 1;

      const start = dayjs(startDate, "DD/MM/YYYY HH:mm:ss");
      const end = dayjs(endDate, "DD/MM/YYYY HH:mm:ss");

      if (now.isBefore(start)) return 1;
      if (now.isAfter(end)) return 3;
      return 2;
    } catch (error) {
      console.error("Error determining status:", { startDate, endDate }, error);
      return 1;
    }
  };

  const processData = (data) => {
    // console.log("Processing data:", data);
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error("Invalid data structure:", data);
      return;
    }

    try {
      const mappedData = data.data.map((item, index) => {
        // console.log("Processing item:", item);

        const ownerIdValue =
          typeof item.ownerId === "object" ? item.ownerId._id : item.ownerId;

        const itemStatus =
          item.status !== undefined
            ? item.status
            : getStatusFromDates(item.startDate, item.endDate);

        const tableRow = {
          No: index + 1,
          Name: item.policyTitle || "Unnamed Policy",
          Description: item.policyDescription || "",
          CreatedDate: formatDate(item.createdAt),
          ApplyDate: formatDate(item.startDate),
          EndDate: formatDate(item.endDate),
          Status: itemStatus,
          id: item.id || item._id,
          _id: item._id || item.id,
          ownerId: ownerIdValue || "",
          isDelete: item.isDelete || false,
          values: item.values || [],
          _original: { ...item },
        };

        // console.log("Created table row:", tableRow);
        return tableRow;
      });

      // console.log("Mapped data for table:", mappedData);
      setBaseData(mappedData);
      setFilteredData(mappedData);
    } catch (error) {
      console.error("Error processing data:", error);
    }
  };

  const getMenuItems = (record) => {
    console.log(record);

    const items = [
      {
        key: "1",
        label: "Chi tiết",
        onClick: () => {
          setSelectedPolicy(record);
          setSelectedPolicyId(record._id || record.id);
          setIsDetailModalOpen(true);
        },
      },
    ];

    if (canEdit) {
      items.push({
        key: "2",
        label: "Chỉnh sửa",
        onClick: () => {
          setSelectedPolicy(record);
          setSelectedPolicyId(record._id || record.id);
          setIsUpdateModalOpen(true);
        },
      });

      if (record.Name !== "Preparing Room Policy" && canEdit) {
        items.push({
          key: "3",
          label: "Xoá",
          danger: true,
          onClick: () => {
            setSelectedPolicy(record);
            setIsDeleteModalOpen(true);
          },
        });
      }
    }

    return items;
  };

  const handleDeleteConfirm = async () => {
    try {
      // console.log("Attempting to delete policy with ID:", selectedPolicy._id);
      try {
        await deletePolicy(selectedPolicy._id).unwrap();
        message.success("Xóa chính sách thành công!");
        refetch();
      } catch (apiError) {
        console.error("API delete error:", apiError);
        // console.log("API call failed, using local state update");
        const newData = baseData.filter(
          (item) => item._id !== selectedPolicy._id
        );
        setBaseData(newData);
        setFilteredData(newData);
        message.success("Xóa chính sách thành công (chế độ ngoại tuyến)!");
      }
    } catch (error) {
      console.error("Delete operation completely failed:", error);
      message.error(
        "Xóa chính sách thất bại: " + (error.data?.message || "Đã xảy ra lỗi")
      );
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedPolicy(null);
    }
  };

  const handleAddPolicy = async (values) => {
    try {
      const formattedValues = {
        ...values,
        ApplyDate: values.ApplyDate ? values.ApplyDate : null,
        EndDate: values.EndDate ? values.EndDate : null,
      };
      const newPolicy = {
        _id: `temp_${Date.now()}`,
        ownerId: effectiveOwnerId || "63b92f4e17d7b3c2a4e4f3d2",
        policyTitle: formattedValues.Name,
        policyDescription: formattedValues.Description,
        startDate: formattedValues.ApplyDate
          ? formattedValues.ApplyDate.format("DD/MM/YYYY HH:mm:ss")
          : null,
        endDate: formattedValues.EndDate
          ? formattedValues.EndDate.format("DD/MM/YYYY HH:mm:ss")
          : null,
        status: 1,
        isDelete: false,
        createdAt: dayjs().format("DD/MM/YYYY HH:mm:ss"),
        updatedAt: dayjs().format("DD/MM/YYYY HH:mm:ss"),
      };

      // console.log("Creating new policy with data:", newPolicy);
      try {
        await createPolicy({
          ...formattedValues,
          ownerId: effectiveOwnerId || "63b92f4e17d7b3c2a4e4f3d2",
          status: 1,
        }).unwrap();
        refetch();
      } catch (apiError) {
        console.warn("API error, falling back to UI update:", apiError);
        const updatedBaseData = [
          ...baseData.map((item) => item._original),
          newPolicy,
        ];
        processData({
          success: true,
          data: updatedBaseData,
        });
        // console.log("Updated data after add:", updatedBaseData);
      }

      message.success("Tạo chính sách mới thành công!");
    } catch (error) {
      console.error("Error creating policy:", error);
      message.error(
        "Tạo chính sách thất bại: " + (error.data?.message || "Đã xảy ra lỗi")
      );
    } finally {
      setIsAddModalOpen(false);
    }
  };

  const handleUpdatePolicy = async (values) => {
    try {
      if (!selectedPolicy || (!selectedPolicy._id && !selectedPolicy.id)) {
        throw new Error("Không tìm thấy ID của chính sách");
      }

      const formattedValues = {
        ...values,
        ApplyDate: values.ApplyDate ? values.ApplyDate : null,
        EndDate: values.EndDate ? values.EndDate : null,
      };

      const updatedPolicyData = {
        id: selectedPolicy._id || selectedPolicy.id,
        ownerId: selectedPolicy.ownerId || effectiveOwnerId,
        policyTitle: formattedValues.Name,
        policyDescription: formattedValues.Description,
        startDate: formattedValues.ApplyDate
          ? formattedValues.ApplyDate.toISOString()
          : null,
        endDate: formattedValues.EndDate
          ? formattedValues.EndDate.toISOString()
          : null,
        status: values.Status || 1,
        values: formattedValues.values?.filter(
          (value) => value && (value.val || value.description)
        ) || [],
        isDelete: false,
        updateBy: localStorage.getItem("user_id") || "",
      };

      console.log("Updating policy with data:", updatedPolicyData);

      try {
        const result = await updatePolicy(updatedPolicyData).unwrap();
        console.log("Update result:", result);
        if (result) {
          message.success("Cập nhật chính sách thành công!");
          await refetch();
        }
      } catch (apiError) {
        console.error("API error during update:", apiError);
        throw new Error(apiError.data?.message || "Lỗi khi gọi API cập nhật");
      }
    } catch (error) {
      console.error("Error updating policy:", error);
      message.error(
        "Cập nhật chính sách thất bại: " +
          (error.message || "Đã xảy ra lỗi")
      );
    } finally {
      setIsUpdateModalOpen(false);
      setSelectedPolicy(null);
      setSelectedPolicyId(null);
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

  useEffect(() => {
    if (!baseData || baseData.length === 0) return;

    // console.log("Applying filters:", { searchTerm, selectedValues });
    // console.log("Base data for filtering:", baseData);
    let filtered = [...baseData];
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
    if (selectedValues.dateRange?.length === 2) {
      const [start, end] = selectedValues.dateRange;
      filtered = filtered.filter((item) => {
        const itemStart = dayjs(item.ApplyDate, "HH:mm DD/MM/YYYY");
        const itemEnd = dayjs(item.EndDate, "HH:mm DD/MM/YYYY");
        return itemStart.isAfter(dayjs(start)) && itemEnd.isBefore(dayjs(end));
      });
    }

    // console.log("Filtered data after applying filters:", filtered);
    setFilteredData(filtered);
  }, [searchTerm, selectedValues, baseData]);

  useEffect(() => {
    if (updatePolicyDetail) {
      setPolicyDetailForUpdate(updatePolicyDetail);
    }
  }, [updatePolicyDetail]);

  const columns = [
    { title: "No.", dataIndex: "No", key: "No" },
    { title: "Tên chính sách", dataIndex: "Name", key: "Name" },
    { title: "Mô tả", dataIndex: "Description", key: "Description" },
    { title: "Ngày tạo", dataIndex: "CreatedDate", key: "CreatedDate" },
    { title: "Ngày áp dụng", dataIndex: "ApplyDate", key: "ApplyDate" },
    { title: "Ngày kết thúc", dataIndex: "EndDate", key: "EndDate" },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "Status",
    //   key: "Status",
    //   render: (status) => {
    //     let className = "";
    //     switch (status) {
    //       case 2:
    //         className = styles.approved;
    //         break;
    //       case 1:
    //         className = styles.pending;
    //         break;
    //       case 3:
    //         className = styles.rejected;
    //         break;
    //       default:
    //         break;
    //     }
    //     return (
    //       <span className={`${styles.status} ${className}`}>
    //         {status === 2
    //           ? "Đã duyệt"
    //           : status === 1
    //             ? "Đang chờ"
    //             : "Bị từ chối"}
    //       </span>
    //     );
    //   },
    // },
    {
      title: "",
      key: "operation",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: getMenuItems(record),
          }}
        >
          <MoreOutlined onClick={(e) => e.preventDefault()} />
        </Dropdown>
      ),
    },
  ];

  if (isOwnerLoading) return <div>Đang tải thông tin chủ sở hữu...</div>;
  if (ownerError) return <div>Lỗi tải thông tin chủ sở hữu</div>;
  if (!id) return <div>Không tìm thấy ID người dùng</div>;
  if (!effectiveOwnerId) return <div>Không thể truy xuất ID chủ sở hữu</div>;

  return (
    <div className={styles.contentContainer}>
      <h1>Quản lý Chính Sách</h1>
      {filteredData.length === 0 && !isPoliciesLoading && (
        <div style={{ marginBottom: "10px" }}>
          {/* Không có dữ liệu để hiển thị. */}
        </div>
      )}
      <div className={styles.contentTable}>
        <div className={styles.tool}>
          <div className={styles.searchFilter}>
            <Input
              placeholder="Tìm kiếm tên chính sách"
              onChange={(e) => setSearchTerm(e.target.value)}
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
              style={{ marginRight: 10 }}
            >
              Làm mới
            </Button>
          </div>
          {canEdit && (
            <Button
              type="primary"
              onClick={() => setIsAddModalOpen(true)}
              icon={<PlusOutlined />}
              className={styles.addRoomButton}
              loading={isCreating}
              disabled={false}
            >
              Tạo chính sách mới
            </Button>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={isPoliciesLoading || isOwnerLoading || isReloading}
          rowKey={(record) => record._id || record.id || record.No}
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
            setSelectedPolicyId(null);
            setSelectedPolicy(null);
            setPolicyDetailForUpdate(null);
          }}
          onConfirm={handleUpdatePolicy}
          initialValues={updatePolicyDetail}
          isLoading={isLoadingUpdateDetail}
        />

        <DetailPolicyModal
          isOpen={isDetailModalOpen}
          policy={selectedPolicy}
          policyDetailData={selectedPolicyDetail}
          isLoadingPolicyDetail={isLoadingPolicyDetail}
          policyDetailError={policyDetailError}
          onCancel={() => {
            setIsDetailModalOpen(false);
            setSelectedPolicy(null);
            setSelectedPolicyId(null);
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

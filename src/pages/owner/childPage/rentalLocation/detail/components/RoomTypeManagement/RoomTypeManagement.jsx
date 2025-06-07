import { useState, useEffect, useMemo } from "react"
import { Table, Button, Input, Dropdown, message, Tooltip, Tag, Modal, Alert } from "antd"
import {
  MoreOutlined,
  PlusOutlined,
  FilterOutlined,
  CloseOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import styles from "./RoomTypeManagement.module.scss"
import AddRoomTypeModal from "./components/AddRoomTypeModal/AddRoomTypeModal"
import UpdateRoomTypeModal from "./components/UpdateRoomTypeModal/UpdateRoomTypeModal"
import DetailRoomTypeModal from "./components/DetailRoomTypeModal/DetailRoomTypeModal"
import Filter from "./components/Filter/Filter"
import debounce from "lodash/debounce"
import {
  useGetAllAccommodationTypesQuery,
  useUpdateAccommodationTypeMutation,
  useDeleteAccommodationTypeMutation,
} from "../../../../../../../redux/services/accommodationTypeApi"
import { useGetAllAmenitiesQuery } from "../../../../../../../redux/services/serviceApi"
import {
  useUpdateRentalLocationMutation,
  useGetRentalLocationByIdQuery,
} from "../../../../../../../redux/services/rentalLocationApi"
import { useParams } from "react-router-dom"

const StyledModalConfirm = ({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "warning",
  loading = false,
  error = null,
}) => {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <DeleteOutlined className={styles.dangerIcon} />
      case "warning":
        return <ExclamationCircleOutlined className={styles.warningIcon} />
      default:
        return <ExclamationCircleOutlined className={styles.infoIcon} />
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={420}
      className={styles.styledModal}
      maskClosable={false}
    >
      <div className={styles.modalContent}>
        <div className={styles.iconWrapper}>{getIcon()}</div>

        <div className={styles.textContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.content}>{content}</p>

          {error && <Alert message={error} type="error" showIcon className={styles.errorAlert} />}
        </div>

        <div className={styles.buttonGroup}>
          <Button onClick={onCancel} className={styles.cancelButton} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            danger={type === "danger"}
            type="primary"
            onClick={onConfirm}
            loading={loading}
            className={`${styles.confirmButton} ${type === "danger" ? styles.dangerButton : ""}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

const RoomTypeManagement = ({ isOwner, ownerId, rentalLocationId, canEdit }) => {
  const { id } = useParams()
  const locationId = rentalLocationId || id

  const [selectedValues, setSelectedValues] = useState({
    maxOccupancy: [],
    priceRange: { min: null, max: null },
    serviceTypes: [],
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [selectedRoomType, setSelectedRoomType] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [serviceNames, setServiceNames] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReloading, setIsReloading] = useState(false)
  const [roomTypeToDelete, setRoomTypeToDelete] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  const {
    data: roomTypesData,
    isLoading: isRoomTypesLoading,
    refetch: refetchRoomTypes,
  } = useGetAllAccommodationTypesQuery(locationId, { skip: !locationId })

  const { data: servicesData, isLoading: isServicesLoading } = useGetAllAmenitiesQuery()
  const { data: rentalLocationData, refetch: refetchRentalLocation } = useGetRentalLocationByIdQuery(locationId, {
    skip: !locationId,
  })

  const [updateRentalLocation, { isLoading: isUpdating }] = useUpdateRentalLocationMutation()
  const [updateAccommodationType] = useUpdateAccommodationTypeMutation()
  const [deleteAccommodationType] = useDeleteAccommodationTypeMutation()

  const roomTypes = Array.isArray(roomTypesData?.data)
    ? roomTypesData.data
    : Array.isArray(roomTypesData)
      ? roomTypesData
      : []

  const services = Array.isArray(servicesData?.data)
    ? servicesData.data
    : Array.isArray(servicesData)
      ? servicesData
      : []

  useEffect(() => {
    const processServiceNames = () => {
      const newServiceNames = {}
      services.forEach((service) => {
        newServiceNames[service._id] = service.name
      })
      setServiceNames(newServiceNames)
    }

    if (services.length > 0) processServiceNames()
  }, [services])

  const handleUpdateRoomType = async (values) => {
    try {
      setIsSubmitting(true)
      await updateAccommodationType({
        id: selectedRoomType._id,
        ...values,
      }).unwrap()
      message.success("Cập nhật loại phòng thành công")
      refetchRoomTypes()
      setIsUpdateModalOpen(false)
      setSelectedRoomType(null)
    } catch (error) {
      if (error.data?.message) {
        message.error(error.data.message)
      } else {
        message.error("Cập nhật loại phòng thất bại")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveRoomType = (roomTypeId) => {
    setRoomTypeToDelete(roomTypeId)
    setDeleteError(null) // Reset error when opening modal
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteRoomType = async () => {
    try {
      setIsSubmitting(true)
      setDeleteError(null) // Reset error before attempting delete

      if (!rentalLocationData?.data?.accommodationTypeIds) {
        throw new Error("Không tìm thấy dữ liệu chỗ ở")
      }

      const currentIds = [...rentalLocationData.data.accommodationTypeIds]
      const updatedIds = currentIds.filter((id) => id !== roomTypeToDelete)

      if (updatedIds.length === currentIds.length) {
        throw new Error("Loại phòng này không tồn tại trong chỗ ở")
      }

      await updateRentalLocation({
        id: locationId,
        updatedData: { accommodationTypeIds: updatedIds },
      }).unwrap()

      message.success("Xóa loại phòng khỏi chỗ ở thành công")
      await refetchRentalLocation()
      refetchRoomTypes()
      setIsDeleteModalOpen(false)
      setRoomTypeToDelete(null)
      setDeleteError(null)
    } catch (error) {
      console.error("Lỗi khi xóa:", error)
      const errorMessage = error.data?.message || ""
      let displayError = ""

      if (errorMessage.includes("cannot be deleted because it's used by an accommodation")) {
        const roomTypeName = roomTypes.find((rt) => rt._id === roomTypeToDelete)?.name || "này"
        displayError = `Không thể xóa loại phòng vì đang có phòng sử dụng loại ${roomTypeName}`
      } else if (errorMessage.includes("AccommodationTypeId")) {
        const match = errorMessage.match(/AccommodationTypeId\s+(\w+)/)
        if (match) {
          displayError = `Không thể xóa loại phòng (ID: ${match[1]}) vì đang có phòng sử dụng`
        } else {
          displayError = "Không thể xóa loại phòng vì đang có phòng sử dụng"
        }
      } else {
        displayError = error.message || error.data?.message || "Xóa loại phòng thất bại"
      }

      setDeleteError(displayError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const cancelDeleteRoomType = () => {
    setIsDeleteModalOpen(false)
    setRoomTypeToDelete(null)
    setDeleteError(null)
  }

  const handleReload = async () => {
    try {
      setIsReloading(true)
      await refetchRoomTypes()
      message.success("Dữ liệu đã được làm mới")
    } catch (error) {
      message.error("Làm mới dữ liệu thất bại")
    } finally {
      setIsReloading(false)
    }
  }

  const menuItems = [
    {
      key: "1",
      label: "Chi tiết",
      onClick: (record) => {
        setSelectedRoomType(record)
        setIsDetailModalOpen(true)
      },
    },
    ...(canEdit
      ? [
          {
            key: "2",
            label: "Chỉnh sửa",
            onClick: (record) => {
              setSelectedRoomType(record)
              setIsUpdateModalOpen(true)
            },
          },
        ]
      : []),
  ]

  const filterGroups = useMemo(() => {
    if (!roomTypes.length) return [];

    const uniqueMaxPeople = [...new Set(roomTypes.map(room => room.maxPeopleNumber))]
      .filter(num => num != null)
      .sort((a, b) => a - b)
      .map(num => ({
        label: `${num} người`,
        value: num
      }));

    const uniqueServices = [...new Set(roomTypes.flatMap(room => 
      room.serviceIds?.map(service => JSON.stringify({ id: service._id, name: service.name })) || []
    ))]
      .map(serviceStr => {
        const service = JSON.parse(serviceStr);
        return {
          label: service.name,
          value: service.id
        };
      });

    return [
      {
        name: "maxOccupancy",
        title: "Số người tối đa",
        type: "checkbox",
        options: uniqueMaxPeople,
      },
      {
        name: "priceRange",
        title: "Khoảng giá",
        type: "range",
      },
      {
        name: "serviceTypes",
        title: "Loại dịch vụ",
        type: "checkbox",
        options: uniqueServices,
      },
    ];
  }, [roomTypes]);

  const handleFilterChange = (filterType, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    count += selectedValues.maxOccupancy.length;
    count += selectedValues.serviceTypes.length;
    if (selectedValues.priceRange.min || selectedValues.priceRange.max) {
      count += 1;
    }
    return count;
  };

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value.trim())
  }, 500)

  useEffect(() => {
    if (!roomTypes.length) {
      setFilteredData([]);
      return;
    }

    let filtered = [...roomTypes];

    if (searchTerm) {
      filtered = filtered.filter((item) => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

    if (selectedValues.maxOccupancy.length > 0) {
      filtered = filtered.filter((item) => 
        selectedValues.maxOccupancy.includes(item.maxPeopleNumber)
      );
    }

    if (selectedValues.priceRange.min !== null || selectedValues.priceRange.max !== null) {
      filtered = filtered.filter((item) => {
        const price = item.basePrice;
        const min = selectedValues.priceRange.min;
        const max = selectedValues.priceRange.max;

        if (min !== null && max !== null) {
          return price >= min && price <= max;
        } else if (min !== null) {
          return price >= min;
        } else if (max !== null) {
          return price <= max;
        }
        return true;
      });
    }

    if (selectedValues.serviceTypes.length > 0) {
      filtered = filtered.filter((item) => {
        if (item.serviceIds && Array.isArray(item.serviceIds)) {
          const serviceIdsInRoom = item.serviceIds.map(service =>
            typeof service === 'string' ? service : service._id
          );
          return selectedValues.serviceTypes.some(id =>
            serviceIdsInRoom.includes(id)
          );
        } else if (item.serviceId) {
          return selectedValues.serviceTypes.includes(item.serviceId);
        }
        return false;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedValues, roomTypes]);

  const customTagStyle = {
    borderRadius: "16px",
    padding: "4px 12px",
    fontSize: "12px",
    background: "#e2e3e5",
    color: "#343a40",
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên loại phòng",
      dataIndex: "name",
      key: "name",
      align: "left",
      width: 150,
    },
    // {
    //   title: "Mô tả",
    //   dataIndex: "description",
    //   key: "description",
    //   align: "left",
    //   width: 200,
    //   ellipsis: true,
    //   render: (description) => (
    //     <Tooltip placement="topLeft" title={description}>
    //       {description || "N/A"}
    //     </Tooltip>
    //   ),
    // },
    {
      title: "Số người tối đa",
      dataIndex: "maxPeopleNumber",
      key: "maxPeopleNumber",
      align: "center",
      width: 120,
      render: (value) => value || "N/A",
    },
    {
      title: "Giá cơ bản",
      dataIndex: "basePrice",
      key: "basePrice",
      align: "center",
      width: 120,
      render: (price) => (price ? `${price.toLocaleString()}đ` : "N/A"),
    },
    {
      title: "Giá theo giờ",
      dataIndex: "overtimeHourlyPrice",
      key: "overtimeHourlyPrice",
      align: "center",
      width: 120,
      render: (price) => (price ? `${price.toLocaleString()}đ/giờ` : "N/A"),
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceIds",
      key: "serviceIds",
      align: "center",
      width: 100,
      render: (serviceIds, record) => {
        const ids = serviceIds || [record.serviceId]
        const count = ids?.filter((id) => id).length || 0
        return count > 0 ? <Tag style={customTagStyle}>{count} dịch vụ</Tag> : "N/A"
      },
    },
    {
      title: "",
      key: "operation",
      align: "center",
      width: 60,
      fixed: "right",
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
    ...(canEdit
      ? [
          {
            title: "",
            key: "remove",
            align: "center",
            width: 60,
            fixed: "right",
            render: (_, record) => (
              <Button
                danger
                type="link"
                onClick={() => handleRemoveRoomType(record._id)}
                disabled={!isOwner || isSubmitting}
                icon={<CloseOutlined />}
                loading={isSubmitting}
              />
            ),
          },
        ]
      : []),
  ]

  return (
    <div className={styles.contentContainer}>
      <h1>Quản lý Loại Phòng</h1>
      <div className={styles.contentTable}>
        <div className={styles.tool}>
          <div className={styles.searchFilter}>
            <Input
              placeholder="Tìm kiếm tên loại phòng"
              onChange={(e) => {
                const value = e.target.value;
                // If input is only whitespace, set empty string
                if (value.trim() === '') {
                  debouncedSearch('');
                } else {
                  debouncedSearch(value);
                }
              }}
              onBlur={(e) => {
                const trimmedValue = e.target.value.trim();
                e.target.value = trimmedValue;
                debouncedSearch(trimmedValue);
              }}
              style={{ width: "250px" }}
            />
            <Dropdown
              trigger={["click"]}
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
            <Button icon={<ReloadOutlined spin={isReloading} />} onClick={handleReload} loading={isReloading}>
              Làm mới
            </Button>
          </div>
          {canEdit && (
            <Button
              type="primary"
              onClick={() => setIsAddModalOpen(true)}
              icon={<PlusOutlined />}
              className={styles.addRoomButton}
              disabled={isSubmitting || isUpdating}
            >
              Thêm loại phòng
            </Button>
          )}
        </div>

        <Table
          loading={isRoomTypesLoading || isServicesLoading || isUpdating || isReloading}
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          pagination={{
            total: filteredData.length,
            pageSize: 7,
            showSizeChanger: false,
            className: styles.customPagination,
          }}
          className={styles.reportTable}
        />

        <AddRoomTypeModal
          ownerId={ownerId}
          rentalLocationId={locationId}
          existingRoomTypeIds={roomTypes.map((rt) => rt._id)}
          isOpen={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          isSubmitting={isSubmitting || isUpdating}
        />

        <UpdateRoomTypeModal
          ownerId={ownerId}
          isOpen={isUpdateModalOpen}
          onCancel={() => {
            setIsUpdateModalOpen(false)
            setSelectedRoomType(null)
          }}
          onConfirm={handleUpdateRoomType}
          initialValues={selectedRoomType}
          services={services}
          isSubmitting={isSubmitting}
        />

        <DetailRoomTypeModal
          isOpen={isDetailModalOpen}
          roomType={selectedRoomType}
          services={services.filter((s) =>
            (selectedRoomType?.serviceIds || [selectedRoomType?.serviceId])?.includes(s._id),
          )}
          onCancel={() => {
            setIsDetailModalOpen(false)
            setSelectedRoomType(null)
          }}
        />

        <StyledModalConfirm
          open={isDeleteModalOpen}
          title="Xác nhận xóa loại phòng"
          content="Bạn có chắc chắn muốn xóa loại phòng này khỏi chỗ ở? Hành động này không thể hoàn tác."
          confirmText="Xóa"
          cancelText="Hủy"
          type="danger"
          loading={isSubmitting}
          error={deleteError}
          onConfirm={confirmDeleteRoomType}
          onCancel={cancelDeleteRoomType}
        />
      </div>
    </div>
  )
}

export default RoomTypeManagement

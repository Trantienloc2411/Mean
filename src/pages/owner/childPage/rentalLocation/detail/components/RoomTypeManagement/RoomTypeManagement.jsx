import { useState, useEffect } from "react"
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
    priceRange: [],
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

  const filterGroups = [
    {
      name: "maxOccupancy",
      title: "Số người tối đa",
      options: [
        { label: "2 người", value: 2 },
        { label: "4 người", value: 4 },
        { label: "6 người", value: 6 },
        { label: "8 người", value: 8 },
        { label: "10 người", value: 10 },
      ],
    },
    {
      name: "priceRange",
      title: "Khoảng giá",
      options: [
        { label: "Dưới 100.000đ", value: "0-100000" },
        { label: "100.000đ - 200.000đ", value: "100000-200000" },
        { label: "200.000đ - 300.000đ", value: "200000-300000" },
        { label: "300.000đ - 500.000đ", value: "300000-500000" },
        { label: "Trên 500.000đ", value: "500000" },
      ],
    },
    {
      name: "serviceTypes",
      title: "Loại dịch vụ",
      options: services.map((service) => ({
        label: service.name,
        value: service._id,
      })),
    },
  ]

  const handleFilterChange = (filterType, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const getActiveFiltersCount = () => {
    return Object.values(selectedValues).flat().length
  }

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value)
  }, 500)

  useEffect(() => {
    if (!roomTypes.length) {
      setFilteredData([])
      return
    }

    let filtered = [...roomTypes]

    if (searchTerm) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedValues.maxOccupancy.length > 0) {
      filtered = filtered.filter((item) => selectedValues.maxOccupancy.includes(item.maxPeopleNumber))
    }

    if (selectedValues.priceRange.length > 0) {
      filtered = filtered.filter((item) => {
        return selectedValues.priceRange.some((range) => {
          const [min, max] = range.split("-").map(Number)
          if (max === undefined) return item.basePrice >= min
          return item.basePrice >= min && item.basePrice <= max
        })
      })
    }

    if (selectedValues.serviceTypes.length > 0) {
      filtered = filtered.filter((item) =>
        (item.serviceIds || [item.serviceId])?.some((id) => selectedValues.serviceTypes.includes(id)),
      )
    }

    setFilteredData(filtered)
  }, [searchTerm, selectedValues, roomTypes])

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
              onChange={(e) => debouncedSearch(e.target.value)}
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

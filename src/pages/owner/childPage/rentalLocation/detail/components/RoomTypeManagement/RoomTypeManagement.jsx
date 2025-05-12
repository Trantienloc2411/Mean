"use client"

import { useState, useEffect } from "react"
import { Table, Button, Input, Dropdown, message, Tooltip, Tag } from "antd"
import { MoreOutlined, PlusOutlined, FilterOutlined } from "@ant-design/icons"
import styles from "./RoomTypeManagement.module.scss"
import DeleteRoomTypeModal from "./components/DeleteRoomTypeModal/DeleteRoomTypeModal"
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

const RoomTypeManagement = ({ isOwner, ownerId, rentalLocationId }) => {
  const { id } = useParams()
  // Use the passed rentalLocationId or the one from URL params
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

  // API Calls
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

  // Data processing
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

  const handleAddRoomTypesToRentalLocation = async (selectedAccommodationTypeIds) => {
    if (!locationId) {
      message.error("Không tìm thấy ID chỗ ở")
      return
    }

    if (!Array.isArray(selectedAccommodationTypeIds) || selectedAccommodationTypeIds.length === 0) {
      message.error("Vui lòng chọn ít nhất một loại phòng")
      return
    }

    try {
      setIsSubmitting(true)

      // Make sure locationId is a valid string
      const cleanId = String(locationId).trim()

      // Create the payload with the correct structure
      const payload = {
        id: cleanId,
        accommodationTypeIds: selectedAccommodationTypeIds,
      }

      console.log("Sending payload from parent component:", payload)

      // Call the Redux mutation with the correct parameters
      const result = await updateRentalLocation(payload).unwrap()

      console.log("API response in parent:", result)

      // If the API call was successful (didn't throw an error), consider it a success
      message.success("Thêm loại phòng thành công")

      // Force refetch both the rental location and room types data
      await Promise.all([refetchRentalLocation(), refetchRoomTypes()])

      setIsAddModalOpen(false)
    } catch (error) {
      console.error("Update error:", error)

      // Handle different types of errors
      if (error.data?.message) {
        message.error(error.data.message)
      } else if (error.message) {
        message.error(error.message)
      } else {
        message.error("Thêm loại phòng thất bại")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedRoomType?._id) {
      message.error("Không tìm thấy ID loại phòng")
      return
    }

    try {
      setIsSubmitting(true)
      await deleteAccommodationType(selectedRoomType._id).unwrap()
      message.success("Xóa loại phòng thành công")
      refetchRoomTypes()
      setIsDeleteModalOpen(false)
      setSelectedRoomType(null)
    } catch (error) {
      if (error.data?.message) {
        message.error(error.data.message)
      } else {
        message.error("Xóa loại phòng thất bại")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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

  // Table and Filter Config
  const menuItems = [
    {
      key: "1",
      label: "Chi tiết",
      onClick: (record) => {
        setSelectedRoomType(record)
        setIsDetailModalOpen(true)
      },
    },
    {
      key: "2",
      label: "Chỉnh sửa",
      onClick: (record) => {
        setSelectedRoomType(record)
        setIsUpdateModalOpen(true)
      },
    },
    {
      key: "3",
      label: "Xoá",
      danger: true,
      onClick: (record) => {
        setSelectedRoomType(record)
        setIsDeleteModalOpen(true)
      },
    },
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

  // Table Columns
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
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "left",
      width: 200,
      ellipsis: true,
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description || "N/A"}
        </Tooltip>
      ),
    },
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
          </div>
          {isOwner && (
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
          loading={isRoomTypesLoading || isServicesLoading || isUpdating}
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          scroll={{ x: 1500 }}
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
          isOpen={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          onConfirm={handleAddRoomTypesToRentalLocation}
          isSubmitting={isSubmitting || isUpdating}
        />

        <UpdateRoomTypeModal
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

        <DeleteRoomTypeModal
          isOpen={isDeleteModalOpen}
          onCancel={() => {
            setIsDeleteModalOpen(false)
            setSelectedRoomType(null)
          }}
          onConfirm={handleDeleteConfirm}
          roomTypeName={selectedRoomType?.name}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}

export default RoomTypeManagement

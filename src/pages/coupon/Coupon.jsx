"use client"

import styles from "../coupon/Coupon.module.scss"
import { MoreOutlined, FilterOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"
import { Dropdown, Input, Button, DatePicker, Tag, Table, message } from "antd"
import debounce from "lodash/debounce"
import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import Filter from "../../components/Filter/Filter.jsx"
import DeleteCouponModal from "./components/DeleteCouponModal.jsx"
import AddCouponModal from "./components/AddCoupon/AddCouponModal.jsx"
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "../../redux/services/couponApi"
import UpdateCouponModal from "./components/UpdateCoupon/UpdateCouponModal.jsx"
import ViewCouponModal from "./components/ViewCoupon/ViewCouponModal.jsx"
const { RangePicker } = DatePicker

export default function Coupon() {
  dayjs.extend(isBetween)
  const { data: coupons, isLoading, refetch } = useGetCouponsQuery()
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation()
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation()
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation()
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    discountType: [],
    dateRange: [],
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isReloading, setIsReloading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  })

  const filterGroups = [
    {
      name: "discountBasedOn",
      title: "Hình thức giảm",
      options: [
        { key: "1", label: "Phần trăm", value: "Percentage" },
        { key: "2", label: "Cố định", value: "Fixed" },
      ],
    },
    {
      name: "isActive",
      title: "Trạng thái",
      options: [
        { label: <Tag color="green">Đang hoạt động</Tag>, value: true },
        { label: <Tag color="red">Hết hạn</Tag>, value: false },
      ],
    },
  ]

  const handleAddCoupon = async (values) => {
    try {
      await createCoupon(values).unwrap()
      message.success({
        content: "Thêm mã giảm giá thành công",
        className: "custom-message",
        style: { marginTop: "20vh" },
      })
      setIsAddModalOpen(false)
      refetch()
    } catch (error) {
      message.error({
        content: error.data?.message || "Có lỗi xảy ra khi thêm mã giảm giá",
        className: "custom-message",
        style: { marginTop: "20vh" },
      })
      throw error
    }
  }

  const handleUpdateCoupon = async (valuesFromModal) => {
    // valuesFromModal here will NOT contain couponCode due to the change in UpdateCouponModal's handleSubmit
    try {
      const payload = {
        id: selectedCoupon.id, // Crucial: ensure ID is always sent
        name: valuesFromModal.name,
        discountBasedOn: valuesFromModal.discountBasedOn,
        amount: Number(valuesFromModal.amount),
        maxDiscount: valuesFromModal.maxDiscount ? Number(valuesFromModal.maxDiscount) : null,
        startDate: valuesFromModal.startDate, // Already formatted by modal
        endDate: valuesFromModal.endDate, // Already formatted by modal
        isActive: valuesFromModal.isActive,
        // couponCode is intentionally omitted from the payload
      }

      await updateCoupon(payload).unwrap()

      message.success({
        content: "Cập nhật mã giảm giá thành công",
        className: "custom-message",
        style: { marginTop: "20vh" },
      })

      setIsUpdateModalOpen(false)
      setSelectedCoupon(null)
      refetch()
    } catch (error) {
      message.error({
        content: error.data?.message || "Có lỗi xảy ra khi cập nhật mã giảm giá",
        className: "custom-message",
        style: { marginTop: "10vh" },
      })
      throw error
    }
  }

  const handleAddCancel = () => {
    setIsAddModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteCoupon(selectedCoupon.id).unwrap()
      message.success({
        content: "Xóa mã giảm giá thành công",
        className: "custom-message",
        style: { marginTop: "10vh" },
      })
      setIsDeleteModalOpen(false)
      setSelectedCoupon(null)
      refetch()
    } catch (error) {
      message.error({
        content: error.data?.message || "Có lỗi xảy ra khi xóa mã giảm giá",
        className: "custom-message",
        style: { marginTop: "10vh" },
      })
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setSelectedCoupon(null)
  }

  const handleFilterChange = (filterName, newValues) => {
    const updatedValues = { ...selectedValues, [filterName]: newValues }
    setSelectedValues(updatedValues)
  }

  const handleDateRangeChange = (dates, dateStrings) => {
    setSelectedValues((prev) => ({ ...prev, dateRange: dates ? dateStrings : [] }))
  }

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value)
  }, 500)

  const handleSearch = (e) => {
    debouncedSearch(e.target.value)
  }

  const handleReload = async () => {
    try {
      setIsReloading(true)
      await refetch()
      message.success({
        content: "Dữ liệu đã được làm mới",
        className: "custom-message",
        style: { marginTop: "10vh" },
      })
    } catch (error) {
      message.error({
        content: "Làm mới dữ liệu thất bại",
        className: "custom-message",
        style: { marginTop: "10vh" },
      })
    } finally {
      setIsReloading(false)
    }
  }

  useEffect(() => {
    if (!coupons) {
      setFilteredData([])
      return
    }
    const sortedCoupons = [...coupons].sort((a, b) =>
      dayjs(b.startDate, "DD/MM/YYYY HH:mm:ss").diff(dayjs(a.startDate, "DD/MM/YYYY HH:mm:ss")),
    )
    let filtered = sortedCoupons
    if (searchTerm) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (selectedValues.isActive?.length > 0) {
      filtered = filtered.filter((item) => selectedValues.isActive.includes(item.isActive))
    }
    if (selectedValues.discountBasedOn?.length > 0) {
      filtered = filtered.filter((item) => selectedValues.discountBasedOn.includes(item.discountBasedOn))
    }
    if (selectedValues.dateRange?.length === 2) {
      const [start, end] = selectedValues.dateRange
      filtered = filtered.filter((item) => {
        const rangeStart = dayjs(start, "DD/MM/YYYY")
        const rangeEnd = dayjs(end, "DD/MM/YYYY").endOf("day")
        const couponStart = dayjs(item.startDate, "DD/MM/YYYY HH:mm:ss")
        const couponEnd = dayjs(item.endDate, "DD/MM/YYYY HH:mm:ss")
        return (
          ((couponStart.isSame(rangeStart) || couponStart.isAfter(rangeStart)) &&
            (couponStart.isSame(rangeEnd) || couponStart.isBefore(rangeEnd))) ||
          ((couponEnd.isSame(rangeStart) || couponEnd.isAfter(rangeStart)) &&
            (couponEnd.isSame(rangeEnd) || couponEnd.isBefore(rangeEnd)))
        )
      })
    }
    setFilteredData(filtered)
  }, [searchTerm, selectedValues, coupons])

  const tableColumn = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: "5%",
    },
    { title: "Mã giảm giá", dataIndex: "couponCode", key: "couponCode" },
    {
      title: "Hình thức giảm",
      dataIndex: "discountBasedOn",
      key: "discountBasedOn",
      render: (type) => (type === "Percentage" ? "Phần trăm" : "Cố định"),
    },
    {
      title: "Giá trị",
      dataIndex: "amount",
      key: "amount",
      render: (value, record) =>
        !value && value !== 0
          ? "-"
          : record.discountBasedOn === "Percentage"
            ? `${value}%`
            : `${value.toLocaleString()}đ`,
    },
    {
      title: "Khuyến mãi tối đa",
      dataIndex: "maxDiscount",
      key: "maxDiscount",
      render: (value) => (!value && value !== 0 ? "Không giới hạn" : `${value.toLocaleString()}đ`),
    },
    { title: "Ngày bắt đầu", dataIndex: "startDate", key: "startDate" },
    { title: "Ngày kết thúc", dataIndex: "endDate", key: "endDate" },
    {
      title: <span className="titleTable">Trạng thái</span>,
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (isActive) => (
        <span className={`${styles.status} ${styles[isActive ? "active" : "inactive"]}`}>
          {isActive ? "Đang hoạt động" : "Hết hạn"}
        </span>
      ),
    },
    {
      title: "",
      key: "operation",
      width: "5%",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: "Xem chi tiết",
                onClick: () => {
                  setSelectedCoupon(record)
                  setIsViewModalOpen(true)
                },
              },
              {
                key: "2",
                label: "Chỉnh sửa",
                onClick: () => {
                  setSelectedCoupon(record)
                  setIsUpdateModalOpen(true)
                },
              },
              {
                key: "3",
                label: "Vô hiệu hoá",
                danger: true,
                onClick: () => {
                  setSelectedCoupon(record)
                  setIsDeleteModalOpen(true)
                },
              },
            ],
          }}
          trigger={["click"]}
        >
          <MoreOutlined style={{ cursor: "pointer" }} />
        </Dropdown>
      ),
    },
  ]

  return (
    <div className={styles.contentContainer}>
      <h1>Quản lí mã giảm giá</h1>
      <h2>Danh sách mã giảm giá</h2>
      <div className={styles.contentTable}>
        <div className={styles.tool}>
          <div className={styles.searchFilter}>
            <Input
              placeholder="Tìm kiếm tên mã"
              onChange={handleSearch}
              style={{ width: "250px", marginRight: "10px" }}
            />
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              dropdownRender={() => (
                <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  <Filter
                    filterGroups={filterGroups}
                    selectedValues={selectedValues}
                    onFilterChange={handleFilterChange}
                    onDateRangeChange={handleDateRangeChange}
                  />
                </div>
              )}
            >
              <Button icon={<FilterOutlined />}>
                Lọc
                {Object.values(selectedValues).flat().length > 0 && ` (${Object.values(selectedValues).flat().length})`}
              </Button>
            </Dropdown>
            <DeleteCouponModal
              isOpen={isDeleteModalOpen}
              onCancel={handleDeleteCancel}
              onConfirm={handleDeleteConfirm}
              couponName={selectedCoupon?.name}
            />
            <DatePicker.RangePicker
              style={{ width: "300px", margin: "16px 0", marginLeft: 10 }}
              onChange={handleDateRangeChange}
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              format="DD/MM/YYYY"
              value={
                selectedValues.dateRange?.length === 2
                  ? [dayjs(selectedValues.dateRange[0], "DD/MM/YYYY"), dayjs(selectedValues.dateRange[1], "DD/MM/YYYY")]
                  : null
              }
            />
            <Button
              icon={<ReloadOutlined spin={isReloading} />}
              onClick={handleReload}
              loading={isReloading}
              style={{ marginRight: 10 }}
            >
              Làm mới
            </Button>
          </div>
          <Button
            type="default"
            className={styles.createButton}
            onClick={() => setIsAddModalOpen(true)}
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#fff", borderColor: "#667085", color: "#667085" }}
          >
            Tạo mã giảm giá
          </Button>
          <AddCouponModal
            isOpen={isAddModalOpen}
            onCancel={handleAddCancel}
            onConfirm={handleAddCoupon}
            isLoading={isCreating}
          />
          <UpdateCouponModal
            isOpen={isUpdateModalOpen}
            onCancel={() => {
              setIsUpdateModalOpen(false)
              setSelectedCoupon(null)
            }}
            onConfirm={handleUpdateCoupon}
            isLoading={isUpdating}
            initialData={selectedCoupon}
          />
          <ViewCouponModal
            isOpen={isViewModalOpen}
            onCancel={() => {
              setIsViewModalOpen(false)
              setSelectedCoupon(null)
            }}
            couponData={selectedCoupon}
          />
        </div>
        <Table
          columns={tableColumn}
          dataSource={filteredData || []}
          loading={isLoading || isReloading}
          pagination={{
            ...pagination,
            total: filteredData?.length || 0,
            showSizeChanger: false,
            className: styles.customPagination,
            onChange: (page) => setPagination((prev) => ({ ...prev, current: page })),
            itemRender: (page, type, originalElement) => {
              const totalPages = Math.ceil((filteredData?.length || 0) / pagination.pageSize)
              if (type === "prev")
                return (
                  <button className={styles.paginationButton} disabled={page === 0}>
                    {" "}
                    « Trước{" "}
                  </button>
                )
              if (type === "next")
                return (
                  <button className={styles.paginationButton} disabled={page >= totalPages}>
                    {" "}
                    Tiếp »{" "}
                  </button>
                )
              return originalElement
            },
          }}
          className={styles.couponTable}
        />
      </div>
    </div>
  )
}
  
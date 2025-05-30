import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Table, message, Modal, Alert } from "antd"
import {
  ExclamationCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  UserDeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import styles from "../components/AccountTable.module.scss"
import UserDetailModal from "./UserDetailModal"
import { useActiveUserMutation, useBlockUserMutation } from "../../../redux/services/userApi"
import { FaEye, FaLock, FaLockOpen } from "react-icons/fa"
import OwnerDetailModal from "./OwnerDetailModal"
import { useUpdateOwnerMutation } from "../../../redux/services/ownerApi"

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
        return <UserDeleteOutlined className={styles.dangerIcon} />
      case "block":
        return <LockOutlined className={styles.blockIcon} />
      case "unblock":
        return <UnlockOutlined className={styles.unblockIcon} />
      case "warning":
        return <ExclamationCircleOutlined className={styles.warningIcon} />
      default:
        return <CheckCircleOutlined className={styles.infoIcon} />
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
          <button onClick={onCancel} className={styles.cancelButton} disabled={loading}>
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`${styles.confirmButton} ${styles[`${type}Button`]}`}
          >
            {loading ? <div className={styles.loadingSpinner}></div> : null}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default function AccountTable({ data, loading }) {
  const navigate = useNavigate()
  const [updateOwner] = useUpdateOwnerMutation()

  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedUserOwner, setSelectedUserOwner] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDetailOpenOwner, setIsDetailOpenOwner] = useState(false)
  const [activeUser] = useActiveUserMutation()
  const [blockUser] = useBlockUserMutation()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: data.length,
  })

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false)
  const [userToBlock, setUserToBlock] = useState(null)
  const [userToUnblock, setUserToUnblock] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState(null)

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"

    try {
      if (typeof dateString === "string" && dateString.includes("/")) {
        return dateString
      }

      const date = new Date(dateString)

      if (isNaN(date.getTime())) {
        return "N/A"
      }

      return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      console.error("Date formatting error:", error)
      return "N/A"
    }
  }

  const columns = [
    {
      title: "No.",
      key: "no",
      width: 60,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 230,
      ellipsis: true,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      ellipsis: true,
    },

    { title: "Email", dataIndex: "email", key: "email", ellipsis: true },
    {
      title: "Vai Trò",
      dataIndex: "roleName",
      align: "center",
      key: "roleName",
      render: (role, record) => (
        <>
          <span className={`${styles.role} ${styles[role.toLowerCase()]}`}>
            {role === "Admin"
              ? "Nhân viên"
              : role === "Owner"
              ? "Chủ hộ"
              : "Khách hàng"}
          </span>
          {record.owner && (
            <span
              style={{ margin: 8 }}
              className={`${styles.isActive} ${
                styles[record?.owner?.isApproved]
              }`}
            >
              {record?.owner?.isApproved ? "Duyệt" : "Chưa duyệt"}
            </span>
          )}
        </>
      ),
    },

    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      align: "center",
      key: "isActive",
      render: (_, record) => (
        <>
          <span className={`${styles.isActive} ${styles[record.isActive]}`}>
            {record.isActive ? "Hoạt động" : "Đang Khóa"}
          </span>
        </>
      ),
    },

    // {
    //   title: "Xác thực",
    //   dataIndex: "isVerified",
    //   align: "center",

    //   key: "isVerified",
    //   render: (_, record) => (
    //     <div className={styles.verifyContainer}>
    //       <span
    //         className={`${styles.isVerifiedEmail} ${
    //           styles[record.isVerifiedEmail]
    //         }`}
    //       >
    //         Email
    //       </span>
    //       <span
    //         className={`${styles.isVerifiedPhone} ${
    //           styles[record.isVerifiedPhone]
    //         }`}
    //       >
    //         Phone
    //       </span>
    //     </div>
    //   ),
    // },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "createdAt",
    //   align: "center",
    //   key: "createdAt",
    //   sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    //   render: (createdAt) => new Date(createdAt).toLocaleDateString("vi-VN"),
    // },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      align: "center",
      // sorter: (a, b) =>
      //   dayjs(a.updatedAt, "DD/MM/YYYY HH:mm:ss").toDate() -
      //   dayjs(b.updatedAt, "DD/MM/YYYY HH:mm:ss").toDate(),
      render: (_, record) =>
        dayjs(record.updatedAt).format("hh:mm:ss DD/MM/YYYY"),
    },
    {
      key: "view",
      // title: "Xem",
      width: 50,
      align: "center",
      render: (_, record) => (
        <>
          {record.roleName === "Owner" ? (
            <span
              className={styles.iconViewDetail}
              onClick={() => {
                handleViewModelOwner(record)
              }}
            >
              <FaEye />
            </span>
          ) : (
            <span
              className={styles.iconViewDetail}
              onClick={() => {
                handleViewModel(record)
              }}
            >
              <FaEye />
            </span>
          )}
        </>
      ),
    },
    {
      key: "status",
      // title: "Khóa",
      align: "center",
      width: 50,
      render: (_, record) => (
        <>
          {["Customer", "Owner"].includes(record.roleName) &&
            (record.isActive ? (
              <span
                className={styles.iconViewDetail}
                onClick={(e) => {
                  handleBlockUser(record)
                }}
              >
                <FaLockOpen style={{ color: "green" }} />
              </span>
            ) : (
              <span
                className={styles.iconViewDetail}
                onClick={(e) => {
                  handleActiveUser(record)
                }}
              >
                <FaLock style={{ color: "red" }} />
              </span>
            ))}
        </>
      ),
    },
  ]

  const handleBlockUser = (user) => {
    setUserToBlock(user)
    setActionError(null)
    setIsBlockModalOpen(true)
  }

  const handleActiveUser = (user) => {
    setUserToUnblock(user)
    setActionError(null)
    setIsUnblockModalOpen(true)
  }

  const confirmBlockUser = async () => {
    try {
      setActionLoading(true)
      setActionError(null)
      await blockUser(userToBlock._id).unwrap()
      message.success("Khóa tài khoản thành công!")
      setIsBlockModalOpen(false)
      setUserToBlock(null)
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi khóa tài khoản!"
      setActionError(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  const confirmUnblockUser = async () => {
    try {
      setActionLoading(true)
      setActionError(null)
      await activeUser(userToUnblock._id).unwrap()
      message.success("Cho phép hoạt động thành công!")
      setIsUnblockModalOpen(false)
      setUserToUnblock(null)
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi mở khóa tài khoản!"
      setActionError(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  const cancelBlockUser = () => {
    setIsBlockModalOpen(false)
    setUserToBlock(null)
    setActionError(null)
  }

  const cancelUnblockUser = () => {
    setIsUnblockModalOpen(false)
    setUserToUnblock(null)
    setActionError(null)
  }

  const handleViewModel = (user) => {
    setSelectedUser(user)
    setIsDetailOpen(true)
  }

  const handleViewModelOwner = async (user) => {
    setSelectedUserOwner(user)
    setIsDetailOpenOwner(true)
  }

  return (
    <div style={{ marginTop: 10 }}>
      <Table
        scroll={{ x: "max-content" }}
        dataSource={data}
        loading={loading}
        columns={columns}
        rowKey="_id"
        pagination={{
          current: pagination.current,
          pageSize: 7,
          total: data.length,
          showSizeChanger: false,
          onChange: (page) => setPagination((prev) => ({ ...prev, current: page })),
          itemRender: (page, type, originalElement) => {
            const totalPages = Math.ceil(data.length / 7)
            if (type === "prev") {
              return (
                <button className={styles.paginationButton} disabled={pagination.current === 1}>
                  « Trước
                </button>
              )
            }
            if (type === "next") {
              return (
                <button className={styles.paginationButton} disabled={pagination.current >= totalPages}>
                  Tiếp »
                </button>
              )
            }
            return originalElement
          },
        }}
        className={styles.accountTable}
      />

      <UserDetailModal open={isDetailOpen} onClose={() => setIsDetailOpen(false)} user={selectedUser} />
      <OwnerDetailModal
        open={isDetailOpenOwner}
        onClose={() => setIsDetailOpenOwner(false)}
        user={selectedUserOwner}
        handleBlockUser={handleBlockUser}
        handleActiveUser={handleActiveUser}
        updateOwner={updateOwner}
      />

      <StyledModalConfirm
        open={isBlockModalOpen}
        title="Xác nhận khóa tài khoản"
        content={`Bạn có chắc chắn muốn khóa tài khoản "${userToBlock?.fullName}" không? Người dùng sẽ không thể đăng nhập sau khi bị khóa.`}
        confirmText="Khóa tài khoản"
        cancelText="Hủy"
        type="block"
        loading={actionLoading}
        error={actionError}
        onConfirm={confirmBlockUser}
        onCancel={cancelBlockUser}
      />

      <StyledModalConfirm
        open={isUnblockModalOpen}
        title="Xác nhận mở khóa tài khoản"
        content={`Bạn có chắc chắn muốn cho phép tài khoản "${userToUnblock?.fullName}" hoạt động trở lại không?`}
        confirmText="Mở khóa"
        cancelText="Hủy"
        type="unblock"
        loading={actionLoading}
        error={actionError}
        onConfirm={confirmUnblockUser}
        onCancel={cancelUnblockUser}
      />
    </div>
  )
}

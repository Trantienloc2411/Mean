import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, message } from "antd";
import styles from "../components/AccountTable.module.scss";
import UserDetailModal from "./UserDetailModal";
import {
  useActiveUserMutation,
  useBlockUserMutation,
} from "../../../redux/services/userApi";
import { FaEye, FaLock, FaLockOpen } from "react-icons/fa";
import dayjs from "dayjs";
import OwnerDetailModal from "./OwnerDetailModal";
import {
  useLazyGetOwnerDetailByUserIdQuery,
  useUpdateOwnerMutation,
} from "../../../redux/services/ownerApi";
import { Modal } from "antd";

export default function AccountTable({ data, loading }) {
  const navigate = useNavigate();
  // const [triggerGetOwnerDetail] = useLazyGetOwnerDetailByUserIdQuery();
  const [updateOwner] = useUpdateOwnerMutation();

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserOwner, setSelectedUserOwner] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailOpenOwner, setIsDetailOpenOwner] = useState(false);
  const [activeUser] = useActiveUserMutation();
  const [blockUser] = useBlockUserMutation();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: data.length,
  });

  const columns = [
    {
      title: "No.",
      key: "no",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Loại",
      dataIndex: "roleName",
      align: "center",
      key: "roleName",
      render: (role) => (
        <span className={`${styles.role} ${styles[role.toLowerCase()]}`}>
          {role === "Admin"
            ? "Nhân viên"
            : role === "Owner"
              ? "Chủ hộ"
              : "Khách hàng"}
        </span>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      align: "center",
      key: "isActive",
      render: (isActive) => (
        <span className={`${styles.isActive} ${styles[isActive]}`}>
          {isActive ? "Hoạt động" : "Đang Khóa"}
        </span>
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
      // dataIndex: "updatedAt",
      align: "center",
      sorter: (a, b) =>
        dayjs(a.updatedAt, "DD/MM/YYYY HH:mm:ss").toDate() -
        dayjs(b.updatedAt, "DD/MM/YYYY HH:mm:ss").toDate(),
      render: (_, record) =>
        dayjs(record.updatedAt, "DD/MM/YYYY HH:mm:ss").format(
          "hh:mm:ss DD/MM/YYYY"
        ),
    },
    {
      key: "view",
      title: "Xem",
      align: "center",
      render: (_, record) => (
        <>
          {/* Bạn có thể giữ lại dòng này để debug nếu muốn */}
          {/* {console.log(record.roleName)} */}

          {record.roleName === "Owner" ? (
            <span
              className={styles.iconViewDetail}
              onClick={() => {
                handleViewModelOwner(record);
              }}
            >
              <FaEye />
            </span>
          ) : (
            <span
              className={styles.iconViewDetail}
              onClick={() => {
                handleViewModel(record);
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
      title: "Khóa",
      align: "center",
      render: (_, record) => (
        <>
          {["Customer", "Owner"].includes(record.roleName) &&
            (record.isActive ? (
              <span
                className={styles.iconViewDetail}
                onClick={(e) => {
                  handleBlockUser(record);
                }}
              >
                <FaLockOpen style={{ color: "green" }} />
              </span>
            ) : (
              <span
                className={styles.iconViewDetail}
                onClick={(e) => {
                  handleActiveUser(record);
                }}
              >
                <FaLock style={{ color: "red" }} />
              </span>
            ))}
        </>
      ),
    },
  ];

  // const handleViewDetails = (user) => {
  //   navigate(
  //     user.roleName === "Customer"
  //       ? `/customer/${user._id}`
  //       : `/owner/${user._id}/information`
  //   );
  // };

  const handleBlockUser = (user) => {
    Modal.confirm({
      title: "Xác nhận khóa tài khoản?",
      content: `Bạn có chắc chắn muốn khóa tài khoản "${user.fullName}" không?`,
      okText: "Khóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await blockUser(user._id).unwrap();
          message.success("Khóa tài khoản thành công!");
        } catch {
          message.error("Lỗi khi cập nhật trạng thái!");
        }
      },
    });
  };

  const handleActiveUser = (user) => {
    Modal.confirm({
      title: "Xác nhận mở khóa tài khoản?",
      content: `Bạn có chắc chắn muốn cho phép tài khoản "${user.fullName}" hoạt động trở lại?`,
      okText: "Mở khóa",
      cancelText: "Hủy",
      okType: "primary",
      onOk: async () => {
        try {
          await activeUser(user._id).unwrap();
          message.success("Cho phép hoạt động thành công!");
        } catch {
          message.error("Lỗi khi cập nhật trạng thái!");
        }
      },
    });
  };

  const handleViewModel = (user) => {
    setSelectedUser(user); // Lưu user được chọn
    setIsDetailOpen(true); // Mở modal
  };
  const handleViewModelOwner = async (user) => {
    // console.log("Opening owner details for:", user.fullName);

    // Có thể fetch dữ liệu của owner từ API nếu cần
    // Ví dụ:
    // try {
    //   const ownerDetails = await triggerGetOwnerDetail(user._id);
    //   // setSelectedUserOwner({
    //   //   ...user,
    //   // });
    setSelectedUserOwner(user);
    // } catch (error) {
    // message.error("Không thể tải thông tin chủ sở hữu");
    // console.error("Error fetching owner details:", error);
    // return;
    // }

    // Nếu không fetch thì chỉ cần set user hiện tại
    setIsDetailOpenOwner(true);
  };
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
            const totalPages = Math.ceil(data.length / 7);
            if (type === "prev") {
              return (
                <button
                  className={styles.paginationButton}
                  disabled={pagination.current === 1}
                >
                  « Trước
                </button>
              );
            }
            if (type === "next") {
              return (
                <button
                  className={styles.paginationButton}
                  disabled={pagination.current >= totalPages}
                >
                  Tiếp »
                </button>
              );
            }
            return originalElement;
          },
        }}
        className={styles.accountTable}
      />

      <UserDetailModal
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        user={selectedUser}
      />
      <OwnerDetailModal
        open={isDetailOpenOwner}
        onClose={() => setIsDetailOpenOwner(false)}
        user={selectedUserOwner}
        handleBlockUser={handleBlockUser}
        handleActiveUser={handleActiveUser}
        updateOwner={updateOwner}
      />
    </div>
  );
}

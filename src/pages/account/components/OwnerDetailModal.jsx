import { Modal, Avatar, Tabs, Button, Table } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./AccountTable.module.scss";
import { useEffect } from "react";
import { useState } from "react";
import { FaEdit, FaLock, FaLockOpen } from "react-icons/fa";
import { Input } from "antd";
import { message } from "antd";
import { useGetOwnerDetailByUserIdQuery } from "../../../redux/services/ownerApi";
import { Spin } from "antd";

const { TabPane } = Tabs;

export default function OwnerDetailModal({
  open,
  onClose,
  user,
  handleActiveUser,
  handleBlockUser,
  updateOwner,
}) {
  if (!user) return null;
  const { data: owner, refetch } = useGetOwnerDetailByUserIdQuery(user?.id);

  const handleRedirect = () => {
    window.open(`/owner/${owner?.userId._id}/information`, "_blank");
  };
  if (!owner) {
    <Spin spinning={!owner}></Spin>;
  }

  return (
    <Modal
      title="👤 Thông tin chủ sở hữu"
      open={open}
      onCancel={onClose}
      footer={null}
      width={"70%"}
      bodyStyle={{
        maxHeight: "70vh", // hoặc "calc(100vh - 200px)"
        overflowY: "auto",
        // paddingRight: 16,
      }}
      afterOpenChange={(isOpen) => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
      }}
      destroyOnClose
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Avatar
          size={100}
          src={owner?.userId.avatarUrl?.[0]}
          icon={!owner?.userId.avatarUrl?.length && <UserOutlined />}
        />
        <h2 style={{ marginTop: 10, marginBottom: 5 }}>
          {owner?.userId.fullName}
        </h2>
        <Button type="primary" onClick={handleRedirect}>
          Xem chi tiết
        </Button>
      </div>

      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="👤 Người dùng" key="1">
          <UserInfo
            owner={owner}
            handleActiveUser={handleActiveUser}
            handleBlockUser={handleBlockUser}
            onClose={onClose}
          />
        </TabPane>

        {/* {owner.businessInformationId && ( */}
        <TabPane tab="🏢 Thông tin kinh doanh" key="2">
          <BusinessInfo business={owner?.businessInformationId} />
        </TabPane>
        {/* )} */}

        <TabPane tab="📄 Hồ sơ" key="3">
          <ProfileInfo
            owner={owner}
            updateOwner={updateOwner}
            refetch={refetch}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
}

function InfoItem({ label, value, isStatus }) {
  return (
    <div className={styles.infoItem}>
      <div className={styles.infoLabel}>{label}</div>
      <div
        className={`${styles.infoValue} ${isStatus ? styles[isStatus] : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

function UserInfo({ owner, handleActiveUser, handleBlockUser, onClose }) {
  const user = owner?.userId;

  const handleToggleActive = async () => {
    if (user.isActive) {
      handleBlockUser(user);
      onClose();
    } else {
      handleActiveUser(user);
      onClose();
    }
  };

  return (
    <div className={styles.infoGrid}>
      <InfoItem label="Email" value={user?.email} />
      <InfoItem label="Số điện thoại" value={user?.phone} />
      <InfoItem label="Ngày sinh" value={user?.doB} />
      <InfoItem
        label="Trạng thái tài khoản"
        value={
          <>
            {user?.isActive ? "Hoạt động" : "Bị khóa"}
            <Button
              danger={owner?.userId.isActive}
              style={{ border: "0px" }}
              onClick={handleToggleActive}
            >
              {owner?.userId.isActive ? (
                <FaLockOpen color="green" />
              ) : (
                <FaLock color="red" />
              )}
            </Button>
          </>
        }
        isStatus={user?.isActive ? "true" : "false"}
      />

      <InfoItem
        label="Email xác thực"
        value={user?.isVerifiedEmail ? "Đã xác thực" : "Chưa xác thực"}
        isStatus={user?.isVerifiedEmail ? "true" : "false"}
      />
      <InfoItem
        label="SĐT xác thực"
        value={user?.isVerifiedPhone ? "Đã xác thực" : "Chưa xác thực"}
        isStatus={user?.isVerifiedPhone ? "true" : "false"}
      />
      <InfoItem label="Ngày tạo" value={user?.createdAt} />
      <InfoItem label="Lần cập nhật" value={user?.updatedAt} />
    </div>
  );
}

function BusinessInfo({ business }) {
  if (!business) {
    return <>Không có thông tin doanh nghiệp</>;
  }
  return (
    <div className={styles.infoGrid}>
      <InfoItem label="Tên công ty" value={business?.companyName} />
      <InfoItem label="Người đại diện" value={business?.representativeName} />
      <InfoItem label="CMND/CCCD" value={business?.citizenIdentification} />
      <InfoItem label="Địa chỉ công ty" value={business?.companyAddress} />
      <InfoItem label="Mã số thuế" value={business?.taxID} />
      <InfoItem
        label="Giấy phép KD"
        value={
          business?.businessLicensesFile ? (
            <a
              href={business?.businessLicensesFile}
              target="_blank"
              rel="noreferrer"
            >
              Xem tài liệu
            </a>
          ) : (
            "Không có"
          )
        }
      />
      {/* <InfoItem label="Ngày tạo" value={business?.createdAt} /> */}
      {/* <InfoItem label="Lần cập nhật" value={business?.updatedAt} /> */}
    </div>
  );
}

function ProfileInfo({ owner, updateOwner, refetch }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState("");

  const approvalHistory = owner.approvalHistory || [];

  const handleApprove = async () => {
    try {
      await updateOwner({
        id: owner._id,
        updatedData: { isApproved: true, reason: null },
      }).unwrap();

      message.success("Đã phê duyệt chủ sở hữu!");
      setReason("");
      setModalVisible(false);
      await refetch();
    } catch (error) {
      message.error("Phê duyệt thất bại!");
    }
  };

  const handleReject = async () => {
    try {
      await updateOwner({
        id: owner._id,
        updatedData: { isApproved: false, note: reason },
      }).unwrap();

      message.success("Đã từ chối phê duyệt!");
      setReason("");
      setModalVisible(false);
      await refetch();
    } catch (error) {
      message.error("Từ chối phê duyệt thất bại!");
    }
  };

  const approvalColumns = [
    {
      title: "Thời điểm",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "approved" ? (
          <span className={styles.true}>Đã duyệt</span>
        ) : status === "rejected" ? (
          <span className={styles.false}>Từ chối</span>
        ) : (
          <span>Chờ duyệt</span>
        ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (text) => <span>{text || "—"}</span>,
    },
  ];

  return (
    <div>
      <div className={styles.infoGrid}>
        <InfoItem
          label="Trạng thái duyệt"
          value={
            <div style={{ display: "flex", alignItems: "center" }}>
              {owner.isApproved ? "Đã duyệt" : "Chưa duyệt"}
              <FaEdit
                color="#0366d6"
                style={{ marginLeft: 12, cursor: "pointer" }}
                onClick={() => setModalVisible(true)}
              />
            </div>
          }
          isStatus={owner.isApproved ? "true" : "false"}
        />
        <InfoItem
          label="Trạng thái xóa"
          value={owner.isDelete ? "Đã xóa" : "Còn hoạt động"}
        />
        <InfoItem label="Ngày tạo hồ sơ" value={owner.createdAt} />
        <InfoItem label="Lần cập nhật" value={owner.updatedAt} />
      </div>

      <h3 style={{ marginTop: 24 }}>📜 Lịch sử phê duyệt</h3>
      <Table
        columns={approvalColumns}
        dataSource={approvalHistory}
        pagination={false}
        rowKey={(record, index) => `approval-${index}`}
        size="small"
      />

      {/* Modal cập nhật phê duyệt */}
      <Modal
        title="Cập nhật phê duyệt"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="reject" danger onClick={handleReject}>
            Từ chối
          </Button>,
          <Button key="approve" type="primary" onClick={handleApprove}>
            Phê duyệt
          </Button>,
        ]}
        destroyOnClose
        maskClosable
      >
        <p>
          Nhập lý do nếu bạn muốn từ chối phê duyệt, để trống nếu muốn phê
          duyệt.
        </p>
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do từ chối (nếu có)..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </div>
  );
}

import {
  Card,
  Typography,
  Space,
  Tooltip,
  Modal,
  Input,
  Button,
  Table,
} from "antd";
import { InfoCircleOutlined, EyeOutlined } from "@ant-design/icons";
import styles from "./AccountStatus.module.scss";
import { useState } from "react";

const { Text } = Typography;

export default function StatusInfo({
  approvalStatus, // "APPROVED", "REJECTED", "PENDING"
  note,
  isAccountActive,
  ownerId,
  refreshOwner,
  tooltipAccountStatus,
  isAccountVerified,
  tooltipAccountVerified,
  refetchLogs,
  approvalLogs = [],

  updateOwner,
}) {
  const [resubmitVisible, setResubmitVisible] = useState(false);
  const [resubmitNote, setResubmitNote] = useState("");
  const getEyeIconColor = () => {
    switch (approvalStatus) {
      case "REJECTED":
        return "#ff4d4f";
      case "PENDING":
        return "#faad14";
      default:
        return "#d9d9d9";
    }
  };
  const handleReSend = async () => {
    if (!resubmitNote.trim()) {
      return Modal.warning({ title: "Vui lòng nhập lý do gửi lại!" });
    }

    try {
      await updateOwner({
        id: ownerId,
        updatedData: {
          approvalStatus: 4, // hoặc "RE_SUBMITTED" nếu có enum riêng
          note: resubmitNote,
        },
      }).unwrap();

      setResubmitNote("");
      setResubmitVisible(false);
      // Có thể refetch lại data nếu cần, ví dụ:
      await refetchLogs();
      await refreshOwner();

      // Hiển thị thông báo thành công nếu cần
      // message.success("Đã gửi lại phê duyệt!");
    } catch (error) {
      Modal.error({
        title: "Gửi lại phê duyệt thất bại!",
        content: error.message,
      });
    }
  };

  const getApprovalValue = () => {
    switch (approvalStatus) {
      case 1:
        return "Chờ phê duyệt";
      case 2:
        return "Đã phê duyệt";
      case 3:
        return "Bị từ chối";
      case 4:
        return "Phê duyệt lại";
      default:
        return "Không xác định";
    }
  };

  const getApprovalStyle = () => {
    switch (approvalStatus) {
      case "APPROVED":
        return styles.statusTrue;
      case "REJECTED":
        return styles.statusFalse;
      case "PENDING":
        return styles.statusPending; // cần thêm class này trong SCSS
      default:
        return "";
    }
  };

  const statusInfo = [
    {
      label: "Trạng thái hoạt động:",
      status: isAccountActive,
      value: isAccountActive ? "Hoạt động" : "Không hoạt động",
      tooltip: tooltipAccountStatus,
      valueStyle: isAccountActive ? styles.statusTrue : styles.statusFalse,
    },
    {
      label: "Trạng thái xác thực:",
      status: isAccountVerified,
      value: isAccountVerified ? "Đã xác thực" : "Chưa xác thực",
      tooltip: tooltipAccountVerified,
      valueStyle: isAccountVerified ? styles.statusTrue : styles.statusFalse,
    },
    {
      label: "Trạng thái phê duyệt:",
      status: approvalStatus !== "APPROVED",
      value: getApprovalValue(),
      tooltip: note,
      valueStyle: getApprovalStyle(),
    },
  ];
  console.log(approvalLogs);

  return (
    <>
      <Card title="Trạng thái tài khoản" className={styles.cardStyle}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {statusInfo.map((item, index) => {
            const isApprovalStatus = item.label === "Trạng thái phê duyệt:";

            return (
              <div key={index} className={styles.statusItem}>
                <Text className={styles.statusLabel}>{item.label}</Text>
                <span className={`${styles.statusValue} ${item.valueStyle}`}>
                  {item.value}
                </span>

                {/* Tooltip cho trạng thái chưa đạt */}
                {/* {!item.status && ( */}
                <>
                  <Tooltip title={item.tooltip}>
                    <InfoCircleOutlined
                      style={{
                        color: "#1890ff",
                        cursor: "pointer",
                        marginLeft: 8,
                      }}
                    />
                  </Tooltip>

                  {/* Icon 👁️ chỉ hiển thị cho "Trạng thái phê duyệt" */}
                  {isApprovalStatus && (
                    <Tooltip title="Xem/Gửi lại phê duyệt">
                      <EyeOutlined
                        style={{
                          color: getEyeIconColor(),
                          cursor: "pointer",
                          marginLeft: 8,
                        }}
                        onClick={() => setResubmitVisible(true)}
                      />
                    </Tooltip>
                  )}
                </>
                {/* )} */}
              </div>
            );
          })}
        </Space>
      </Card>

      <Modal
        title="Gửi lại phê duyệt"
        open={resubmitVisible}
        onCancel={() => {
          setResubmitVisible(false);
          setResubmitNote("");
        }}
        footer={[
          <Button key="cancel" onClick={() => setResubmitVisible(false)}>
            Hủy
          </Button>,
          <Button key="resubmit" type="primary" onClick={handleReSend}>
            Gửi lại
          </Button>,
        ]}
        width={800}
        style={{ maxWidth: "90%" }}
      >
        <p>Nhập lý do bạn muốn gửi lại phê duyệt:</p>
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do..."
          value={resubmitNote}
          onChange={(e) => setResubmitNote(e.target.value)}
        />

        <hr style={{ margin: "20px 0" }} />
        <h4>Lịch sử phê duyệt</h4>
        <Table
          columns={[
            { title: "Thời điểm", dataIndex: "createdAt", key: "createdAt" },
            {
              title: "Trạng thái",
              dataIndex: "newStatus",
              key: "newStatus",
              render: (newStatus) => {
                let statusText = ""; // Khởi tạo giá trị mặc định

                // Chuyển đổi trạng thái số thành văn bản
                switch (newStatus) {
                  case 1:
                    statusText = "Chờ phê duyệt";
                    break;
                  case 2:
                    statusText = "Đã phê duyệt";
                    break;
                  case 3:
                    statusText = "Bị từ chối";
                    break;
                  case 4:
                    statusText = "Phê duyệt lại";
                    break;
                  default:
                    statusText = "Không xác định";
                }

                // Tùy chỉnh màu sắc cho từng trạng thái
                let color = "#000"; // Màu mặc định
                if (statusText === "Đã phê duyệt") color = "#52c41a";
                if (statusText === "Bị từ chối") color = "#ff4d4f";
                if (statusText === "Chờ phê duyệt") color = "#faad14";

                return (
                  <Tooltip
                    title={`Trạng thái: ${statusText}`}
                    placement="topLeft"
                  >
                    <span style={{ color }}>{statusText}</span>
                  </Tooltip>
                );
              },
            },

            {
              title: "Ghi chú",
              dataIndex: "note",
              key: "note",
              render: (note) => note || "—",
            },
          ]}
          dataSource={[...(approvalLogs || [])].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )}
          pagination={false}
          size="small"
          rowKey={(record, index) => `resubmit-${index}`}
        />
      </Modal>
    </>
  );
}

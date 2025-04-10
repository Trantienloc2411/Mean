import { Card, Typography, Space, Tooltip } from "antd"
import { InfoCircleOutlined } from "@ant-design/icons"
import styles from "./AccountStatus.module.scss"

const { Text } = Typography

export default function StatusInfo({
                                     userInfo,
                                     isApproved,
                                     note,
                                     isAccountActive,
                                     tooltipAccountStatus,
                                     isAccountVerified,
                                     tooltipAccountVerified,
                                   }) {
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
      status: isApproved,
      value: isApproved ? "Phê duyệt" : "Chưa phê duyệt",
      tooltip: note,
      valueStyle: isApproved ? styles.statusTrue : styles.statusFalse,
    },
  ]

  return (
      <Card title="Trạng thái tài khoản" className={styles.cardStyle}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {statusInfo.map((item, index) => (
              <div key={index} className={styles.statusItem}>
                <Text className={styles.statusLabel}>{item.label}</Text>
                <span className={`${styles.statusValue} ${item.valueStyle}`}>{item.value}</span>
                {item.status ? null : (
                    <Tooltip title={item.tooltip}>
                      <InfoCircleOutlined style={{ color: "#1890ff", cursor: "pointer" }} />
                    </Tooltip>
                )}
              </div>
          ))}
        </Space>
      </Card>
  )
}
